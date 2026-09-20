import React, { useState } from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { ComplaintCard } from '../ComplaintCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

const CATEGORIES = [
  'All',
  'Road Damage',
  'Pothole',
  'Water Leakage',
  'Electricity Issue',
  'Sanitation Issue',
  'Other'
];

export function CommunityFeedPage({
  complaints,
  currentUser,
  onSupport,
  onOpenAuth,
  onNavigate,
  onSelectComplaint,
  loading
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = complaints.filter(c => {
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
      
      {/* Title & Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community Complaint Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Public transparency portal displaying all verified citizen grievances in your municipality.
          </p>
        </div>
        <button
          onClick={() => onNavigate('report')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location, description..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-600"
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint Grid List */}
      {loading ? (
        <LoadingSpinner message="Fetching community complaints..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Complaints Match Your Filter"
          description="Try choosing another category or clear your search criteria."
          actionText="Report an Issue"
          onAction={() => onNavigate('report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((complaint) => (
            <div key={complaint.id} onClick={() => onSelectComplaint(complaint)} className="cursor-pointer">
              <ComplaintCard
                complaint={complaint}
                currentUser={currentUser}
                onSupport={onSupport}
                onOpenAuth={onOpenAuth}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
