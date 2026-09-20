from pydantic import BaseModel, Field
from typing import Optional

class WhatsAppWebhookPayload(BaseModel):
    sender_phone: str = Field(..., example="+919876543210")
    media_url: str = Field(..., example="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7")
    description: Optional[str] = "Pothole on Main Street causing traffic disruption"
    location_string: str = Field(..., example="MG Road, Sector 14, City Center")
