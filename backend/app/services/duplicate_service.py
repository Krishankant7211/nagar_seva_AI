from typing import List, Optional
from difflib import SequenceMatcher

class DuplicateService:
    @staticmethod
    def check_duplicate(
        new_location: str,
        new_category: Optional[str],
        new_description: Optional[str],
        existing_complaints: List[dict]
    ) -> Optional[dict]:
        """
        Compares new complaint against existing active complaints.
        Returns the existing duplicate complaint if match confidence > threshold, else None.
        """
        if not existing_complaints:
            return None

        new_loc_clean = (new_location or "").strip().lower()
        new_desc_clean = (new_description or "").strip().lower()
        new_cat_clean = (new_category or "").strip().lower()

        for complaint in existing_complaints:
            # Skip resolved or rejected complaints for duplicate checking
            if complaint.get("status") in ["Resolved", "Rejected"]:
                continue

            exist_loc = (complaint.get("location") or "").strip().lower()
            exist_desc = (complaint.get("description") or "").strip().lower()
            exist_cat = (complaint.get("category") or "").strip().lower()

            # Location match confidence
            loc_similarity = SequenceMatcher(None, new_loc_clean, exist_loc).ratio()
            location_match = (
                new_loc_clean in exist_loc or 
                exist_loc in new_loc_clean or 
                loc_similarity > 0.6
            )

            # Category match
            category_match = (new_cat_clean == exist_cat) if (new_cat_clean and exist_cat) else True

            # Description similarity
            desc_similarity = 0.0
            if new_desc_clean and exist_desc:
                desc_similarity = SequenceMatcher(None, new_desc_clean, exist_desc).ratio()

            # Decision logic: Same location + (same category OR high text match)
            if location_match and (category_match or desc_similarity > 0.5):
                return complaint

        return None
