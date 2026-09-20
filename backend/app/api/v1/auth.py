from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import SendOTPRequest, VerifyOTPRequest, VerifyAadhaarRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/send-otp")
def send_otp(request: SendOTPRequest):
    """
    Mock OTP generation for citizen phone login.
    """
    if len(request.phone_number) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number format.")
    return {
        "success": True,
        "message": f"OTP successfully sent to {request.phone_number}.",
        "mock_otp": "123456"
    }

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies OTP and returns or creates User record.
    """
    if request.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code. Use mock OTP 123456.")
    
    user = db.query(User).filter(User.phone_number == request.phone_number).first()
    if not user:
        user = User(
            phone_number=request.phone_number,
            name="Citizen " + request.phone_number[-4:],
            is_verified=False,
            role="citizen"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/verify-aadhaar", response_model=UserResponse)
def verify_aadhaar(request: VerifyAadhaarRequest, db: Session = Depends(get_db)):
    """
    Mock Aadhaar verification flow. Marks citizen user as verified.
    """
    if len(request.aadhaar_number) != 12 or not request.aadhaar_number.isdigit():
        raise HTTPException(status_code=400, detail="Aadhaar number must be exactly 12 numeric digits.")

    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        # Check by phone
        user = db.query(User).filter(User.phone_number == request.phone_number).first()

    if not user:
        user = User(
            phone_number=request.phone_number,
            name=request.name,
            aadhaar_number=request.aadhaar_number,
            is_verified=True,
            role="citizen"
        )
        db.add(user)
    else:
        user.name = request.name
        user.aadhaar_number = request.aadhaar_number
        user.is_verified = True

    db.commit()
    db.refresh(user)
    return user
