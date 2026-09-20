from app.schemas.user import SendOTPRequest, VerifyOTPRequest, VerifyAadhaarRequest, UserResponse
from app.schemas.complaint import ComplaintCreate, DuplicateCheckRequest, ComplaintResponse
from app.schemas.whatsapp import WhatsAppWebhookPayload

__all__ = [
    "SendOTPRequest",
    "VerifyOTPRequest",
    "VerifyAadhaarRequest",
    "UserResponse",
    "ComplaintCreate",
    "DuplicateCheckRequest",
    "ComplaintResponse",
    "WhatsAppWebhookPayload",
]
