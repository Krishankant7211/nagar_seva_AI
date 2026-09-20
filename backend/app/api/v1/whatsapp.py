from fastapi import APIRouter, Depends, status
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
    """
    # 1. Lookup or create citizen user record linked to WhatsApp phone
    user = db.query(User).filter(User.phone_number == payload.sender_phone).first()
    if not user:
        user = User(
            phone_number=payload.sender_phone,
            name="WhatsApp Citizen (" + payload.sender_phone[-4:] + ")",
            is_verified=True, # WhatsApp phone is pre-verified
            role="citizen"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Analyze incoming media & text with Gemini AI
    ai_result = AIService.analyze_complaint(
        image_url=payload.media_url,
        description=payload.description or "",
        category="Other"
    )

    # 3. Create complaint automatically
    complaint = Complaint(
        citizen_id=user.id,
        citizen_name=user.name,
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
