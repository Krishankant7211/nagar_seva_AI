import { INITIAL_COMPLAINTS } from '../data/initialData';

const BASE_URL = 'http://localhost:8000/api/v1';

// Local storage key for fallback persistence
const STORAGE_KEY = 'nagar_seva_complaints_db';
const USER_KEY = 'nagar_seva_citizen_user';
const SUPPORTS_KEY = 'nagar_seva_user_supports';

function getLocalComplaints() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  return JSON.parse(data);
}

function saveLocalComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function getLocalUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function saveLocalUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getLocalSupports() {
  const data = localStorage.getItem(SUPPORTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalSupport(complaintId, userId) {
  const supports = getLocalSupports();
  supports.push(`${userId}_${complaintId}`);
  localStorage.setItem(SUPPORTS_KEY, JSON.stringify(supports));
}

export const apiService = {
  // Auth API
  async sendOtp(phone_number) {
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, message: `OTP sent to ${phone_number}`, mock_otp: '123456' };
  },

  async verifyOtp(phone_number, otp) {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number, otp })
      });
      if (res.ok) {
        const user = await res.json();
        saveLocalUser(user);
        return user;
      }
    } catch (e) {
      // Fallback
    }
    const mockUser = {
      id: `USER-${Math.floor(1000 + Math.random() * 9000)}`,
      phone_number,
      name: `Citizen ${phone_number.slice(-4)}`,
      is_verified: false,
      role: 'citizen'
    };
    saveLocalUser(mockUser);
    return mockUser;
  },

  async verifyAadhaar(userId, name, phone, aadhaarNumber) {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-aadhaar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name,
          phone_number: phone,
          aadhaar_number: aadhaarNumber
        })
      });
      if (res.ok) {
        const user = await res.json();
        saveLocalUser(user);
        return user;
      }
    } catch (e) {
      // Fallback
    }
    const currentUser = getLocalUser() || { id: userId, phone_number: phone };
    const updatedUser = {
      ...currentUser,
      name,
      aadhaar_number: aadhaarNumber,
      is_verified: true
    };
    saveLocalUser(updatedUser);
    return updatedUser;
  },

  // Complaints API
  async getComplaints(category = 'All', status = 'All', search = '') {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (status && status !== 'All') params.append('status', status);
      if (search) params.append('search', search);

      const res = await fetch(`${BASE_URL}/complaints?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    let list = getLocalComplaints();
    if (category && category !== 'All') {
      list = list.filter(c => c.category === category);
    }
    if (status && status !== 'All') {
      list = list.filter(c => c.status === status);
    }
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(
        c => (c.location && c.location.toLowerCase().includes(term)) ||
             (c.description && c.description.toLowerCase().includes(term)) ||
             (c.category && c.category.toLowerCase().includes(term))
      );
    }
    return list;
  },

  async checkDuplicate(location, category, description) {
    try {
      const res = await fetch(`${BASE_URL}/complaints/check-duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, category, description })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const complaints = getLocalComplaints();
    const newLocClean = (location || '').toLowerCase();
    const match = complaints.find(c =>
      c.status !== 'Resolved' &&
      c.status !== 'Rejected' &&
      (c.location.toLowerCase().includes(newLocClean) || newLocClean.includes(c.location.toLowerCase()))
    );

    if (match) {
      return {
        is_duplicate: true,
        matched_complaint: match,
        message: 'A similar complaint already exists at this location.'
      };
    }
    return { is_duplicate: false, matched_complaint: null };
  },

  async createComplaint(payload) {
    try {
      const res = await fetch(`${BASE_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        // sync local
        const local = getLocalComplaints();
        local.unshift(data);
        saveLocalComplaints(local);
        return data;
      }
    } catch (e) {
      // Fallback
    }

    // Heuristic AI fallback
    const severityMap = {
      'Electricity Issue': 'Critical',
      'Water Leakage': 'High',
      'Pothole': 'High',
      'Road Damage': 'Medium',
      'Sanitation Issue': 'Medium'
    };

    const newCompl = {
      id: `COMP-${Math.floor(100 + Math.random() * 900)}`,
      citizen_id: payload.citizen_id || 'ANON',
      citizen_name: payload.citizen_name || 'Verified Citizen',
      image_url: payload.image_url,
      description: payload.description || '',
      location: payload.location,
      category: payload.category,
      status: 'Pending',
      ai_summary: payload.description || `${payload.category} issue reported at ${payload.location}`,
      predicted_category: payload.category,
      estimated_severity: severityMap[payload.category] || 'Medium',
      support_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const list = getLocalComplaints();
    list.unshift(newCompl);
    saveLocalComplaints(list);
    return newCompl;
  },

  async supportComplaint(complaintId, userId) {
    try {
      const res = await fetch(`${BASE_URL}/complaints/${complaintId}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      if (res.ok) {
        const data = await res.json();
        saveLocalSupport(complaintId, userId);
        return data;
      }
      const err = await res.json();
      throw new Error(err.detail || 'Support failed');
    } catch (e) {
      if (e.message.includes('already supported') || e.message.includes('verified')) {
        throw e;
      }
    }

    const supports = getLocalSupports();
    if (supports.includes(`${userId}_${complaintId}`)) {
      throw new Error('You have already supported this complaint.');
    }

    const list = getLocalComplaints();
    const item = list.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found.');

    item.support_count = (item.support_count || 0) + 1;
    saveLocalComplaints(list);
    saveLocalSupport(complaintId, userId);

    return {
      success: true,
      message: 'Complaint supported successfully!',
      new_support_count: item.support_count
    };
  },

  // Admin API
  async adminLogin(username, password) {
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    if (username === 'admin' && password === 'admin123') {
      return { success: true, message: 'Admin authentication successful.', role: 'admin' };
    }
    throw new Error('Invalid admin credentials.');
  },

  async getAdminAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const list = getLocalComplaints();
    return {
      total_complaints: list.length,
      pending: list.filter(c => c.status === 'Pending').length,
      in_progress: list.filter(c => c.status === 'In Progress').length,
      resolved: list.filter(c => c.status === 'Resolved').length,
      rejected: list.filter(c => c.status === 'Rejected').length
    };
  },

  async updateStatus(complaintId, newStatus) {
    try {
      const res = await fetch(`${BASE_URL}/admin/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocalComplaints();
        const idx = list.findIndex(c => c.id === complaintId);
        if (idx !== -1) {
          list[idx] = updated;
          saveLocalComplaints(list);
        }
        return updated;
      }
    } catch (e) {
      // Fallback
    }

    const list = getLocalComplaints();
    const item = list.find(c => c.id === complaintId);
    if (item) {
      item.status = newStatus;
      item.updated_at = new Date().toISOString();
      saveLocalComplaints(list);
      return item;
    }
    throw new Error('Complaint not found.');
  },

  // Helper for stored user
  getCurrentUser() {
    return getLocalUser();
  },
  saveCurrentUser(u) {
    saveLocalUser(u);
  },
  logoutUser() {
    localStorage.removeItem(USER_KEY);
  }
};
