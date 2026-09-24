from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    RegisterRequest,
    LoginRequest,
    InitiateVerificationRequest,
    ConfirmVerificationRequest,
    LinkWhatsAppRequest,
    SendOTPRequest,
    VerifyOTPRequest,
    VerifyAadhaarRequest,
    UserResponse
)
from app.services.auth_service import AuthService
from app.services.verification_service import verification_service

router = APIRouter(prefix="/auth", tags=["Authentication & Identity Verification"])

@router.post("/register", response_model=UserResponse)
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers or synchronizes user profile with Supabase Auth.
    """
    if not request.email and not request.phone_number:
        raise HTTPException(status_code=400, detail="Either email or phone number is required.")

    user = AuthService.get_or_create_user(
        db=db,
        user_id=request.user_id,
        email=request.email,
        phone_number=request.phone_number,
        full_name=request.full_name
    )
    return user

@router.post("/verify-identity/initiate")
def initiate_identity_verification(
    request: InitiateVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Step 3 Onboarding: Initiates Aadhaar identity verification via VerificationProvider.
    Sends OTP to registered Aadhaar mobile.
    """
    clean_aadhaar = request.aadhaar_number.replace(" ", "").strip()
    if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
        raise HTTPException(status_code=400, detail="Aadhaar number must consist of exactly 12 numeric digits.")

    res = verification_service.send_otp(clean_aadhaar)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("message", "Failed to initiate verification."))

    return res

@router.post("/verify-identity/confirm", response_model=UserResponse)
def confirm_identity_verification(
    request: ConfirmVerificationRequest,
    user_id: str = Header(..., alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    """
    Step 3 Onboarding: Confirms Aadhaar OTP and marks citizen identity as verified.
    Raw Aadhaar is NEVER stored! Only last 4 digits & reference ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")

    res = verification_service.verify_otp(
        reference_id=request.reference_id,
        otp=request.otp,
        full_name=request.full_name,
        aadhaar_number=request.aadhaar_number
    )

    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("message", "Verification failed."))

    # Store ONLY last 4 digits, reference ID, and timestamp. Raw Aadhaar is NEVER saved!
    user.full_name = request.full_name
    user.is_aadhaar_verified = True
    user.aadhaar_last4 = res.get("aadhaar_last4")
    user.verification_reference = res.get("verification_reference")
    user.verification_timestamp = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)
    return user

@router.post("/link-whatsapp", response_model=UserResponse)
def link_whatsapp_number(
    request: LinkWhatsAppRequest,
    user_id: str = Header(..., alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    """
    Links WhatsApp number to verified user account.
    Requires prior Aadhaar identity verification.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")

    if not user.is_aadhaar_verified:
        raise HTTPException(
            status_code=403,
            detail="Access Denied: Complete Aadhaar identity verification before linking WhatsApp."
        )

    clean_whatsapp = request.whatsapp_number.strip()
    user.whatsapp_number = clean_whatsapp
    user.whatsapp_linked_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    user_id: str = Header(..., alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    """
    Returns current user profile & verification status.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")
    return user

# Legacy backward compatibility endpoints
@router.post("/send-otp")
def send_otp_legacy(request: SendOTPRequest):
    if len(request.phone_number) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number format.")
    return {
        "success": True,
        "message": f"OTP successfully sent to {request.phone_number}.",
        "mock_otp": "123456"
    }

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp_legacy(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    if request.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code. Use mock OTP 123456.")
    
    user = db.query(User).filter(User.phone_number == request.phone_number).first()
    if not user:
        user = AuthService.get_or_create_user(
            db=db,
            phone_number=request.phone_number,
            full_name="Citizen " + request.phone_number[-4:]
        )
    return user

@router.post("/verify-aadhaar", response_model=UserResponse)
def verify_aadhaar_legacy(request: VerifyAadhaarRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        user = db.query(User).filter(User.phone_number == request.phone_number).first()

    if not user:
        user = AuthService.get_or_create_user(
            db=db,
            user_id=request.user_id,
            phone_number=request.phone_number,
            full_name=request.name
        )

    res = verification_service.verify_otp(
        reference_id="REF-DL-LEGACY",
        otp="123456",
        full_name=request.name,
        aadhaar_number=request.aadhaar_number
    )

    user.full_name = request.name
    user.is_aadhaar_verified = True
    user.aadhaar_last4 = res.get("aadhaar_last4")
    user.verification_reference = res.get("verification_reference")
    user.verification_timestamp = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)
    return user
