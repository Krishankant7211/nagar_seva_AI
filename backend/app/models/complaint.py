import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    citizen_name = Column(String(100), nullable=False, default="Anonymous Citizen")
    image_url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Categories: Road Damage, Pothole, Water Leakage, Electricity Issue, Sanitation Issue, Other
    category = Column(String(50), nullable=False, default="Other")
    
    # Statuses: Pending, In Progress, Resolved, Rejected
    status = Column(String(20), nullable=False, default="Pending")
    
    # AI Generated Analysis
    ai_summary = Column(Text, nullable=True)
    predicted_category = Column(String(50), nullable=True)
    estimated_severity = Column(String(20), nullable=True, default="Medium") # Low, Medium, High, Critical
    
    support_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    citizen = relationship("User", back_populates="complaints")
    supports = relationship("Support", back_populates="complaint", cascade="all, delete-orphan")
