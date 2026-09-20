from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ComplaintCreate(BaseModel):
    citizen_id: Optional[str] = None
    citizen_name: str = "Verified Citizen"
    image_url: str
    description: Optional[str] = ""
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str = "Other"

class DuplicateCheckRequest(BaseModel):
    location: str
    category: Optional[str] = None
    description: Optional[str] = ""

class ComplaintResponse(BaseModel):
    id: str
    citizen_id: Optional[str] = None
    citizen_name: str
    image_url: str
    description: Optional[str] = ""
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str
    status: str
    ai_summary: Optional[str] = None
    predicted_category: Optional[str] = None
    estimated_severity: Optional[str] = "Medium"
    support_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SupportRequest(BaseModel):
    user_id: str

class AdminStatusUpdate(BaseModel):
    status: str # Pending, In Progress, Resolved, Rejected
