import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String(15), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)
    aadhaar_number = Column(String(12), nullable=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String(20), default="citizen")  # citizen, admin
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaints = relationship("Complaint", back_populates="citizen", cascade="all, delete-orphan")
    supports = relationship("Support", back_populates="user", cascade="all, delete-orphan")
