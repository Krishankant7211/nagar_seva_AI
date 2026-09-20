from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.complaint import Complaint
from app.config import settings
from app.schemas.complaint import AdminStatusUpdate, ComplaintResponse

router = APIRouter(prefix="/admin", tags=["Admin Panel & Analytics"])

class AdminLoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def admin_login(req: AdminLoginRequest):
    """
    Admin credentials authentication.
    """
    if req.username == settings.ADMIN_USERNAME and req.password == settings.ADMIN_PASSWORD:
        return {
            "success": True,
            "message": "Admin authentication successful.",
            "token": "admin-session-jwt-token-nagar-seva",
            "role": "admin"
        }
    raise HTTPException(status_code=401, detail="Invalid admin credentials.")

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """
    Returns high-level analytical metrics for admin dashboard.
    """
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == "Pending").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "In Progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    rejected = db.query(Complaint).filter(Complaint.status == "Rejected").count()

    return {
        "total_complaints": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "rejected": rejected
    }

@router.patch("/complaints/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: str,
    req: AdminStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Admin status update (Pending -> In Progress -> Resolved / Rejected).
    """
    allowed_statuses = ["Pending", "In Progress", "Resolved", "Rejected"]
    if req.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{req.status}'. Allowed statuses: {allowed_statuses}"
        )

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    complaint.status = req.status
    db.commit()
    db.refresh(complaint)
    return complaint
