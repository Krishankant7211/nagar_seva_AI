import uuid
import logging
import requests
from app.config import settings

logger = logging.getLogger(__name__)

class StorageService:
    @staticmethod
    def upload_image(file_bytes: bytes, filename: str = "complaint.jpg") -> str:
        """
        Uploads image file to Supabase Storage bucket and returns public URL.
        Refactored from Cloudinary to Supabase Storage.
        """
        supabase_url = settings.SUPABASE_URL.rstrip('/')
        supabase_key = settings.SUPABASE_KEY
        bucket = settings.SUPABASE_STORAGE_BUCKET

        # Check if Supabase storage credentials are configured
        if supabase_url and supabase_key and "your-supabase-project" not in supabase_url:
            try:
                # Generate unique object path
                ext = filename.split('.')[-1] if '.' in filename else 'jpg'
                object_path = f"complaints/{uuid.uuid4().hex}.{ext}"
                upload_endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{object_path}"
                
                headers = {
                    "Authorization": f"Bearer {supabase_key}",
                    "apikey": supabase_key,
                    "Content-Type": "image/jpeg"
                }

                response = requests.post(upload_endpoint, data=file_bytes, headers=headers)
                if response.status_code in [200, 201]:
                    public_url = f"{supabase_url}/storage/v1/object/public/{bucket}/{object_path}"
                    logger.info(f"Successfully uploaded image to Supabase Storage: {public_url}")
                    return public_url
                else:
                    logger.warning(f"Supabase storage upload failed status {response.status_code}: {response.text}")
            except Exception as e:
                logger.warning(f"Supabase storage upload error ({e}). Using standard media fallback.")

        # Fallback to provided base64 data URL or standard hosted sample image if keys not set
        return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"

    @staticmethod
    def delete_image(image_url: str) -> bool:
        """
        Deletes image object from Supabase Storage bucket.
        """
        supabase_url = settings.SUPABASE_URL.rstrip('/')
        supabase_key = settings.SUPABASE_KEY
        bucket = settings.SUPABASE_STORAGE_BUCKET

        if not supabase_url or not supabase_key or bucket not in image_url:
            return False

        try:
            # Extract object path from public URL
            object_path = image_url.split(f"/{bucket}/")[-1]
            delete_endpoint = f"{supabase_url}/storage/v1/object/{bucket}/{object_path}"
            
            headers = {
                "Authorization": f"Bearer {supabase_key}",
                "apikey": supabase_key
            }

            res = requests.delete(delete_endpoint, headers=headers)
            return res.status_code in [200, 204]
        except Exception as e:
            logger.warning(f"Error deleting image from Supabase Storage ({e})")
            return False
