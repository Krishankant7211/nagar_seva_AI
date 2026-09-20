export interface User {
  id: string;
  phone_number: string;
  name?: string;
  aadhaar_number?: string;
  is_verified: boolean;
  role: 'citizen' | 'admin';
  created_at?: string;
}

export interface Complaint {
  id: string;
  citizen_id?: string;
  citizen_name: string;
  image_url: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  ai_summary?: string;
  predicted_category?: string;
  estimated_severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  support_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsStats {
  total_complaints: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}
