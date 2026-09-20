import React, { useState } from 'react';
import { Search, Filter, AlertCircle, PlusCircle } from 'lucide-react';
import { ComplaintCard } from './ComplaintCard';

const CATEGORIES = [
  'All',
  'Road Damage',
  'Pothole',
  'Water Leakage',
  'Electricity Issue',
  'Sanitation Issue',
  'Other'
];

export function PublicFeed({ complaints, currentUser, onSupport, onOpenAuth, onOpenCreate, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || c.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q));

    return matchesCat && matchesStat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Public Civic Complaint Feed</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Real-time public transparency for city infrastructure issues. Report, track, and support verified civic grievances in your neighborhood.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Complaint</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, keyword..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Loading civic complaints...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Complaints Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No complaints match your selected filters or search criteria. Try selecting another category or report a new issue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              currentUser={currentUser}
              onSupport={onSupport}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
