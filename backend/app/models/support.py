import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Support(Base):
    __tablename__ = "supports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("complaint_id", "user_id", name="unique_user_complaint_support"),
    )

    complaint = relationship("Complaint", back_populates="supports")
    user = relationship("User", back_populates="supports")
