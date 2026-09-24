import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=True, index=True)
    whatsapp_number = Column(String(20), unique=True, nullable=True, index=True)
    whatsapp_linked_at = Column(DateTime, nullable=True)
    
    full_name = Column(String(100), nullable=True)
    profile_image = Column(Text, nullable=True)
    
    is_phone_verified = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    is_aadhaar_verified = Column(Boolean, default=False)
    
    # Security: Raw 12-digit Aadhaar is NEVER stored! Only last 4 digits.
    aadhaar_last4 = Column(String(4), nullable=True)
    verification_reference = Column(String(100), nullable=True)
    verification_timestamp = Column(DateTime, nullable=True)
    
    role = Column(String(20), default="citizen")  # citizen, admin
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    complaints = relationship("Complaint", back_populates="citizen", cascade="all, delete-orphan")
    supports = relationship("Support", back_populates="user", cascade="all, delete-orphan")
