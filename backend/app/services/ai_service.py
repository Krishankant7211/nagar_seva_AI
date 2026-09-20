import json
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class AIService:
    @staticmethod
    def analyze_complaint(image_url: str, description: str, category: str) -> dict:
        """
        Analyzes complaint image and text using Gemini API.
        Returns: {
            "summary": str,
            "predicted_category": str,
            "estimated_severity": str ("Low" | "Medium" | "High" | "Critical")
        }
        """
        api_key = settings.GEMINI_API_KEY
        
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                
                prompt = f"""
                You are Nagar Seva AI, an expert city infrastructure intelligence assistant.
                Analyze the civic complaint image and user description provided.
                User Description: "{description or 'No description provided'}"
                Selected Category: "{category}"

                Return a strictly valid JSON object with the following fields:
                - "summary": A concise 1-2 sentence summary of the visible public defect.
                - "predicted_category": One of ["Road Damage", "Pothole", "Water Leakage", "Electricity Issue", "Sanitation Issue", "Other"]
                - "estimated_severity": One of ["Low", "Medium", "High", "Critical"] based on safety hazard.
                Do not include markdown code block formatting in the raw text output.
                """
                
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                
                raw_text = response.text.strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text.replace("```json", "").replace("```", "").strip()
                elif raw_text.startswith("```"):
                    raw_text = raw_text.replace("```", "").strip()
                    
                parsed = json.loads(raw_text)
                return {
                    "summary": parsed.get("summary", f"{category} reported at specified location."),
                    "predicted_category": parsed.get("predicted_category", category),
                    "estimated_severity": parsed.get("estimated_severity", "High")
                }
            except Exception as e:
                logger.warning(f"Gemini API call failed or misconfigured ({e}). Utilizing fallback AI rules.")
        
        # Rule-based fallback if Gemini API key is omitted or errored
        desc_lower = (description or "").lower()
        severity = "Medium"
        if any(w in desc_lower for w in ["spark", "wire", "electric", "fire", "danger", "burst"]):
            severity = "Critical"
        elif any(w in desc_lower for w in ["deep", "blocked", "flood", "overflow", "severe"]):
            severity = "High"
        elif any(w in desc_lower for w in ["minor", "small", "litter"]):
            severity = "Low"
        else:
            severity = "High" if category in ["Electricity Issue", "Water Leakage"] else "Medium"

        clean_cat = category if category in ["Road Damage", "Pothole", "Water Leakage", "Electricity Issue", "Sanitation Issue", "Other"] else "Other"
        
        summary_prefix = {
            "Pothole": "Hazardous road depression detected requiring immediate surface repair.",
            "Road Damage": "Damaged asphalt surface identified with structural cracks.",
            "Water Leakage": "Active water pipe leakage causing wastage and surface pooling.",
            "Electricity Issue": "Exposed power equipment or outage affecting public safety.",
            "Sanitation Issue": "Uncollected garbage accumulation requiring municipal sanitation response.",
            "Other": "Civic infrastructure anomaly reported by citizen."
        }
        
        return {
            "summary": description if description and len(description) > 10 else summary_prefix.get(clean_cat, "Civic complaint requiring inspection."),
            "predicted_category": clean_cat,
            "estimated_severity": severity
        }
