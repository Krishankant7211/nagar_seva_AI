from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    user_id: Optional[str] = None # Supabase auth user ID if available
    email: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = None
    full_name: str = Field(..., example="Rahul Sharma")

class LoginRequest(BaseModel):
    email_or_phone: str = Field(..., example="rahul@example.com")
    password: str = Field(..., example="Password123!")

class InitiateVerificationRequest(BaseModel):
    full_name: str = Field(..., example="Rahul Sharma")
    aadhaar_number: str = Field(..., example="123456789012")

class ConfirmVerificationRequest(BaseModel):
    reference_id: str
    otp: str = Field(..., example="123456")
    full_name: str
    aadhaar_number: str = Field(..., example="123456789012")

class LinkWhatsAppRequest(BaseModel):
    whatsapp_number: str = Field(..., example="+919876543210")

# Legacy compatibility schemas
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
    email: Optional[str] = None
    phone_number: Optional[str] = None
    whatsapp_number: Optional[str] = None
    whatsapp_linked_at: Optional[datetime] = None
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    is_phone_verified: bool = False
    is_email_verified: bool = False
    is_aadhaar_verified: bool = False
    aadhaar_last4: Optional[str] = None
    verification_reference: Optional[str] = None
    verification_timestamp: Optional[datetime] = None
    role: str = "citizen"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
