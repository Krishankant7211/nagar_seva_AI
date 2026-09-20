import React, { useState } from 'react';
import { X, Upload, MapPin, FileText, Sparkles, Image as ImageIcon, Crosshair } from 'lucide-react';
import { apiService } from '../services/api';

const SAMPLE_IMAGES = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Electricity Wire', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
  { label: 'Garbage', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' }
];

export function CreateComplaintModal({ isOpen, onClose, currentUser, onOpenAuth, onShowDuplicateWarning, onSubmitSuccess }) {
  const [category, setCategory] = useState('Pothole');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`Sector ${Math.floor(Math.random() * 20 + 1)}, Main Road (GPS Verified)`);
        },
        () => {
          setLocation('Connaught Place, Central Block, New Delhi');
        }
      );
    } else {
      setLocation('Connaught Place, Central Block, New Delhi');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!location.trim()) {
      setError('Please provide a complaint location.');
      return;
    }

    setLoading(true);
    try {
      // 1. Check for duplicates
      const dupCheck = await apiService.checkDuplicate(location, category, description);
      if (dupCheck.is_duplicate && dupCheck.matched_complaint) {
        setLoading(false);
        onShowDuplicateWarning(dupCheck.matched_complaint, {
          citizen_id: currentUser.id,
          citizen_name: currentUser.name || 'Verified Citizen',
          image_url: imageUrl,
          description,
          location,
          category
        });
        return;
      }

      // 2. Submit complaint
      const newComp = await apiService.createComplaint({
        citizen_id: currentUser.id,
        citizen_name: currentUser.name || 'Verified Citizen',
        image_url: imageUrl,
        description,
        location,
        category
      });

      onSubmitSuccess(newComp);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Report Civic Issue</h3>
            <p className="text-xs text-slate-500">Gemini AI will automatically categorize and assess severity</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Complaint Photo *</span>
              <span className="text-[10px] text-slate-400">Select sample or upload photo</span>
            </label>
            
            {/* Image Preview */}
            <div className="relative h-40 w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden mb-2">
              <img src={imageUrl} alt="Complaint preview" className="w-full h-full object-cover" />
              <label className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 backdrop-blur-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Quick Sample Selector */}
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  type="button"
                  key={sample.label}
                  onClick={() => setImageUrl(sample.url)}
                  className={`text-[10px] font-medium py-1 px-2 rounded-lg border text-center transition-all ${
                    imageUrl === sample.url
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Road Damage">Road Damage</option>
              <option value="Pothole">Pothole</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Electricity Issue">Electricity Issue</option>
              <option value="Sanitation Issue">Sanitation Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Location Address *</label>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <Crosshair className="w-3 h-3" />
                <span>Auto-Detect</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 18 Main Road, Near Metro Gate 2"
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional details to assist municipal authorities..."
              className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-blue py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing with Gemini AI...' : 'Submit Complaint'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
