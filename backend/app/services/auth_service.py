import uuid
import logging
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    def get_or_create_user(
        db: Session,
        user_id: Optional[str] = None,
        email: Optional[str] = None,
        phone_number: Optional[str] = None,
        full_name: Optional[str] = None
    ) -> User:
        """
        Retrieves existing user profile or creates a new user profile linked to Supabase Auth.
        """
        user = None
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()

        if not user and email:
            user = db.query(User).filter(User.email == email).first()

        if not user and phone_number:
            user = db.query(User).filter(User.phone_number == phone_number).first()

        if not user:
            user_id_final = user_id or str(uuid.uuid4())
            user = User(
                id=user_id_final,
                email=email,
                phone_number=phone_number,
                full_name=full_name or "Citizen",
                is_phone_verified=bool(phone_number),
                is_email_verified=bool(email),
                is_aadhaar_verified=False,
                role="citizen"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Created new user profile in database: {user.id}")
        else:
            # Update missing attributes if provided
            updated = False
            if full_name and not user.full_name:
                user.full_name = full_name
                updated = True
            if email and not user.email:
                user.email = email
                updated = True
            if phone_number and not user.phone_number:
                user.phone_number = phone_number
                updated = True
            if updated:
                db.commit()
                db.refresh(user)

        return user
