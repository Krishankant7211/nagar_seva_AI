from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SendOTPRequest(BaseModel):
    phone_number: str = Field(..., example="9876543210")

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str = Field(..., example="123456")

class VerifyAadhaarRequest(BaseModel):
    user_id: str
    name: str
    phone_number: str
    aadhaar_number: str = Field(..., example="123456789012")

class UserResponse(BaseModel):
    id: str
    phone_number: str
    name: Optional[str] = None
    aadhaar_number: Optional[str] = None
    is_verified: bool = False
    role: str = "citizen"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
