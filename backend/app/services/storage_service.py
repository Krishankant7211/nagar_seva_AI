import logging
from app.config import settings

logger = logging.getLogger(__name__)

class StorageService:
    @staticmethod
    def upload_image(file_bytes: bytes, filename: str) -> str:
        """
        Uploads image file to Cloudinary storage or returns data URL / hosted link.
        """
        cloud_name = settings.CLOUDINARY_CLOUD_NAME
        api_key = settings.CLOUDINARY_API_KEY
        api_secret = settings.CLOUDINARY_API_SECRET

        if cloud_name and api_key and api_secret:
            try:
                import cloudinary
                import cloudinary.uploader
                cloudinary.config(
                    cloud_name=cloud_name,
                    api_key=api_key,
                    api_secret=api_secret
                )
                res = cloudinary.uploader.upload(file_bytes, folder="nagar_seva_complaints")
                return res.get("secure_url")
            except Exception as e:
                logger.warning(f"Cloudinary upload failed ({e}). Returning default media standard link.")

        # Default standard placeholder/demo media URL if no Cloudinary keys supplied
        return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
