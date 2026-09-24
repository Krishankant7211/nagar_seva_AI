import uuid
import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class VerificationProvider(ABC):
    @abstractmethod
    def send_otp(self, identifier: str) -> dict:
        """Initiates identity verification and dispatches OTP code."""
        pass

    @abstractmethod
    def verify_otp(self, reference_id: str, otp: str, full_name: str, aadhaar_number: str) -> dict:
        """Verifies OTP code and returns verification result metadata."""
        pass

class MockDigiLockerProvider(VerificationProvider):
    """
    Mock implementation of DigiLocker / Aadhaar identity verification provider.
    Designed for seamless drop-in replacement with real DigiLocker OAuth / Sandbox APIs in production.
    """
    
    def send_otp(self, identifier: str) -> dict:
        if not identifier or len(identifier.replace(" ", "")) < 10:
            return {
                "success": False,
                "message": "Invalid Aadhaar or phone identifier provided."
            }

        ref_id = f"REF-DL-{uuid.uuid4().hex[:8].upper()}"
        logger.info(f"[MockDigiLockerProvider] Sent OTP code '123456' for identifier '{identifier}'. Reference: {ref_id}")

        return {
            "success": True,
            "reference_id": ref_id,
            "message": "OTP successfully dispatched to Aadhaar registered mobile number.",
            "mock_otp": "123456" # For developer testing convenience
        }

    def verify_otp(self, reference_id: str, otp: str, full_name: str, aadhaar_number: str) -> dict:
        clean_aadhaar = (aadhaar_number or "").replace(" ", "").strip()
        
        if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
            return {
                "success": False,
                "message": "Aadhaar number must consist of exactly 12 numeric digits."
            }

        if otp != "123456":
            return {
                "success": False,
                "message": "Invalid OTP verification code. Please use 123456."
            }

        last4 = clean_aadhaar[-4:]
        timestamp = datetime.now(timezone.utc).isoformat()

        logger.info(f"[MockDigiLockerProvider] Successfully verified identity for '{full_name}' (Aadhaar ending {last4}). Reference: {reference_id}")

        return {
            "success": True,
            "message": "Aadhaar identity verification completed successfully via DigiLocker.",
            "aadhaar_last4": last4,
            "verification_reference": reference_id or f"REF-DL-{uuid.uuid4().hex[:8].upper()}",
            "verification_timestamp": timestamp
        }

# Provider instance
verification_service = MockDigiLockerProvider()
