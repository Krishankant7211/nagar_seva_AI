import React, { useState } from 'react';
import { Upload, MapPin, Sparkles, Crosshair, CheckCircle2, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../../services/api';

const SAMPLE_PHOTOS = [
  { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Electricity Wire', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
  { label: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' }
];

export function ReportIssuePage({
  currentUser,
  onOpenAuth,
  onShowDuplicateWarning,
  onSubmitSuccess,
  onNavigate
}) {
  const [category, setCategory] = useState('Pothole');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation(`Sector ${Math.floor(Math.random() * 20 + 1)} Main Road (GPS Verified)`),
        () => setLocation('Connaught Place, Central Block, New Delhi')
      );
    } else {
      setLocation('Connaught Place, Central Block, New Delhi');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
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
      setError('Please provide a specific complaint location.');
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

      setSubmittedComplaint(newComp);
      onSubmitSuccess(newComp);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (submittedComplaint) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Complaint Submitted Successfully!</h2>
          <p className="text-xs text-slate-500">
            Your report has been logged and assigned to the municipal maintenance division.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Complaint Reference ID:</span>
            <span className="font-mono font-bold text-slate-900">{submittedComplaint.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-900">{submittedComplaint.category}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px]">{submittedComplaint.location}</span>
          </div>
          {submittedComplaint.ai_summary && (
            <div className="pt-2 border-t border-slate-200 text-xs">
              <span className="text-blue-700 font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini AI Summary
              </span>
              <p className="text-slate-600 italic">"{submittedComplaint.ai_summary}"</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onNavigate('my-reports')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Track My Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSubmittedComplaint(null);
              setLocation('');
              setDescription('');
            }}
            className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-2.5 rounded-xl text-sm transition-all"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Report an Infrastructure Issue</h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide complaint photo, location, and details for municipal inspection.
        </p>
      </div>

      {!currentUser && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between">
          <span>You must be logged in as a citizen to submit reports.</span>
          <button onClick={onOpenAuth} className="font-bold underline text-amber-900">
            Log In Now
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* 1. Upload Photo */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            1. Complaint Photo *
          </label>
          
          <div className="relative h-56 w-full rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden mb-3 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Complaint preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="text-xs font-medium">Click to upload photo or select sample below</p>
              </div>
            )}

            <label className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-md">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Preset Samples */}
          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_PHOTOS.map((sample) => (
              <button
                type="button"
                key={sample.label}
                onClick={() => setImageUrl(sample.url)}
                className={`text-[11px] font-medium py-1.5 px-2 rounded-lg border text-center transition-all ${
                  imageUrl === sample.url
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            2. Issue Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-slate-50 font-medium"
          >
            <option value="Road Damage">Road Damage</option>
            <option value="Pothole">Pothole</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Electricity Issue">Electricity Issue</option>
            <option value="Sanitation Issue">Sanitation Issue</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 3. Location Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Location Address *
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Use My Location (GPS)</span>
            </button>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sector 18 Main Road, Near Metro Gate 2"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* 4. Description (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            4. Additional Details (Optional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add relevant notes (e.g. deep pothole near school entrance causing traffic backlog)..."
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Large Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-blue-200" />
          <span>{loading ? 'Analyzing with Gemini AI & Submitting...' : 'Submit Civic Complaint'}</span>
        </button>
      </form>
    </div>
  );
}
