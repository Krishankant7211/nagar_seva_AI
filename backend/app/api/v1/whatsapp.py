from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.whatsapp import WhatsAppWebhookPayload
from app.services.ai_service import AIService

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp AI Agent Backend"])

@router.post("/webhook", status_code=status.HTTP_201_CREATED)
def whatsapp_webhook(payload: WhatsAppWebhookPayload, db: Session = Depends(get_db)):
    """
    Inbound WhatsApp webhook endpoint.
    Receives photo, description, and location from WhatsApp bot,
    runs AI analysis (Gemini), and creates complaint record automatically.
    Maps incoming WhatsApp number to verified users only.
    """
    # 1. Lookup citizen by whatsapp_number first, then phone_number
    user = db.query(User).filter(User.whatsapp_number == payload.sender_phone).first()
    if not user:
        user = db.query(User).filter(User.phone_number == payload.sender_phone).first()

    # 2. If unknown sender, create a provisional record (unverified)
    if not user:
        user = User(
            phone_number=payload.sender_phone,
            full_name="WhatsApp Citizen (" + payload.sender_phone[-4:] + ")",
            is_phone_verified=True,
            is_aadhaar_verified=False,
            role="citizen"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3. Access control: only Aadhaar-verified users can submit via WhatsApp
    if not user.is_aadhaar_verified:
        raise HTTPException(
            status_code=403,
            detail=(
                "Access Denied: WhatsApp complaint submission requires completed Aadhaar identity verification. "
                "Please visit the Nagar Seva AI portal to verify your identity first."
            )
        )

    # 4. Analyze incoming media & text with Gemini AI
    ai_result = AIService.analyze_complaint(
        image_url=payload.media_url,
        description=payload.description or "",
        category="Other"
    )

    # 5. Create complaint automatically
    complaint = Complaint(
        citizen_id=user.id,
        citizen_name=user.full_name or user.phone_number,
        image_url=payload.media_url,
        description=payload.description,
        location=payload.location_string,
        category=ai_result["predicted_category"],
        status="Pending",
        ai_summary=ai_result["summary"],
        predicted_category=ai_result["predicted_category"],
        estimated_severity=ai_result["estimated_severity"],
        support_count=1
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "success": True,
        "message": "Complaint automatically processed and registered via WhatsApp AI Agent.",
        "complaint_id": complaint.id,
        "ai_summary": complaint.ai_summary,
        "category": complaint.category,
        "severity": complaint.estimated_severity
    }
