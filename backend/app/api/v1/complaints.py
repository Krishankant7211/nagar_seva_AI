from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.complaint import Complaint
from app.models.support import Support
from app.models.user import User
from app.schemas.complaint import (
    ComplaintCreate,
    DuplicateCheckRequest,
    ComplaintResponse,
    SupportRequest
)
from app.services.ai_service import AIService
from app.services.duplicate_service import DuplicateService

router = APIRouter(prefix="/complaints", tags=["Complaints Feed & Submission"])

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (Pending, In Progress, Resolved, Rejected)"),
    search: Optional[str] = Query(None, description="Search term for location/description"),
    db: Session = Depends(get_db)
):
    """
    Public feed of all complaints.
    """
    query = db.query(Complaint)
    
    if category and category != "All":
        query = query.filter(Complaint.category == category)
        
    if status and status != "All":
        query = query.filter(Complaint.status == status)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Complaint.location.ilike(search_fmt)) |
            (Complaint.description.ilike(search_fmt)) |
            (Complaint.category.ilike(search_fmt))
        )
        
    complaints = query.order_by(Complaint.created_at.desc()).all()
    return complaints

@router.post("/check-duplicate")
def check_duplicate(request: DuplicateCheckRequest, db: Session = Depends(get_db)):
    """
    Checks if a similar complaint exists at the location before submission.
    """
    active_complaints = db.query(Complaint).all()
    comp_dicts = [
        {
            "id": c.id,
            "location": c.location,
            "category": c.category,
            "description": c.description,
            "status": c.status,
            "image_url": c.image_url,
            "ai_summary": c.ai_summary,
            "created_at": c.created_at.isoformat() if c.created_at else "",
            "support_count": c.support_count
        }
        for c in active_complaints
    ]
    
    match = DuplicateService.check_duplicate(
        new_location=request.location,
        new_category=request.category,
        new_description=request.description,
        existing_complaints=comp_dicts
    )
    
    if match:
        return {
            "is_duplicate": True,
            "matched_complaint": match,
            "message": "A similar complaint already exists at this location. We recommend supporting the existing report!"
        }
    
    return {
        "is_duplicate": False,
        "matched_complaint": None,
        "message": "No duplicate found. Proceed with submission."
    }

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Submits a new civic complaint, runs Gemini AI analysis, and stores the record.
    """
    # Run Gemini AI Service Layer
    ai_result = AIService.analyze_complaint(
        image_url=data.image_url,
        description=data.description or "",
        category=data.category
    )

    new_complaint = Complaint(
        citizen_id=data.citizen_id,
        citizen_name=data.citizen_name or "Verified Citizen",
        image_url=data.image_url,
        description=data.description,
        location=data.location,
        latitude=data.latitude,
        longitude=data.longitude,
        category=data.category,
        status="Pending",
        ai_summary=ai_result["summary"],
        predicted_category=ai_result["predicted_category"],
        estimated_severity=ai_result["estimated_severity"],
        support_count=0
    )
    
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.post("/{complaint_id}/support")
def support_complaint(complaint_id: str, req: SupportRequest, db: Session = Depends(get_db)):
    """
    Verified citizen supports a complaint. Enforces 1 support per user per complaint.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found. Please log in.")
        
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Only verified citizens with valid Aadhaar can support complaints.")

    # Check for existing support record
    existing_support = db.query(Support).filter(
        Support.complaint_id == complaint_id,
        Support.user_id == req.user_id
    ).first()

    if existing_support:
        raise HTTPException(status_code=400, detail="You have already supported this complaint.")

    new_support = Support(complaint_id=complaint_id, user_id=req.user_id)
    db.add(new_support)
    
    complaint.support_count += 1
    db.commit()
    db.refresh(complaint)

    return {
        "success": True,
        "message": "Complaint supported successfully!",
        "new_support_count": complaint.support_count
    }
