// Mock initial database for MyCity AI / Nagar Seva AI Platform

export const CATEGORIES = [
  { id: 'pothole', name: 'Pothole & Road Damage', dept: 'Public Works & Roads', icon: 'Construction', color: '#ef4444' },
  { id: 'garbage', name: 'Garbage & Waste Accumulation', dept: 'Sanitation & Solid Waste Management', icon: 'Trash2', color: '#f97316' },
  { id: ' streetlight', name: 'Broken Streetlight / Dark Spot', dept: 'Electrical & Power Department', icon: 'Zap', color: '#eab308' },
  { id: 'water', name: 'Water Leakage / Pipe Burst', dept: 'Water Supply & Sewerage Board', icon: 'Droplets', color: '#06b6d4' },
  { id: 'drainage', name: 'Blocked Drainage / Waterlogging', dept: 'Stormwater & Drainage Dept', icon: 'Waves', color: '#8b5cf6' }
];

export const INITIAL_ISSUES = [
  {
    id: 'MYC-1024',
    title: 'Severe Deep Potholes on School Zone Arterial Road',
    category: 'pothole',
    categoryName: 'Pothole & Road Damage',
    department: 'Public Works & Roads',
    description: 'Dangerous cluster of deep potholes directly outside St. Mary’s High School. High risk to school buses and two-wheelers during monsoon water accumulation.',
    location: {
      address: 'Sector 15, Near Gate 2, St. Mary High School',
      zone: 'North Ward Zone A',
      lat: 28.6139,
      lng: 77.2090
    },
    priorityScore: 92,
    severity: 'critical',
    reportCount: 31,
    status: 'In Progress',
    assignedTo: 'Engineer Rajesh Kumar (PWD)',
    assignedTeam: 'Road Maintenance Unit 4',
    createdAt: '2026-09-14T08:30:00Z',
    updatedAt: '2026-09-15T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    explainableBreakdown: {
      baseSeverity: 30,
      reportConsensus: 25, // 31 citizen reports
      proximitySensitivity: 20, // 45m from High School
      trafficCorridor: 12, // High traffic bus route
      escalationAge: 5 // Open for 24h+
    },
    citizenFeedback: null, // null | 'fixed' | 'reopened'
    timeline: [
      { step: 'Reported', time: 'Sep 14, 08:30 AM', note: 'Reported by Citizen via Mobile App (Deduplicated 31 reports)' },
      { step: 'AI Analysis', time: 'Sep 14, 08:30 AM', note: 'AI Vision confirmed Pothole. Priority Score: 92/100' },
      { step: 'Assigned', time: 'Sep 14, 10:15 AM', note: 'Automatically routed to Public Works & Roads Dept' },
      { step: 'In Progress', time: 'Sep 15, 09:15 AM', note: 'Asphalt repair crew dispatched to Sector 15' }
    ]
  },
  {
    id: 'MYC-1025',
    title: 'Major Underground Pipe Burst & Drinking Water Leak',
    category: 'water',
    categoryName: 'Water Leakage / Pipe Burst',
    department: 'Water Supply & Sewerage Board',
    description: 'Clean drinking water gushing onto the main road from ruptured underground mainline pipe. Thousands of gallons being wasted per hour.',
    location: {
      address: 'Crossroads 4, Commercial Complex, Sector 22',
      zone: 'Central Ward Zone C',
      lat: 28.6250,
      lng: 77.2180
    },
    priorityScore: 86,
    severity: 'critical',
    reportCount: 18,
    status: 'Assigned',
    assignedTo: 'Chief Inspector Verma (Water Dept)',
    assignedTeam: 'Emergency Leakage Squad B',
    createdAt: '2026-09-15T06:20:00Z',
    updatedAt: '2026-09-15T07:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
    explainableBreakdown: {
      baseSeverity: 30,
      reportConsensus: 18,
      proximitySensitivity: 15,
      trafficCorridor: 15,
      escalationAge: 8
    },
    citizenFeedback: null,
    timeline: [
      { step: 'Reported', time: 'Sep 15, 06:20 AM', note: 'Reported via WhatsApp AI Bot' },
      { step: 'AI Analysis', time: 'Sep 15, 06:21 AM', note: 'AI Vision detected High Volume Pipe Burst. Priority: 86/100' },
      { step: 'Assigned', time: 'Sep 15, 07:00 AM', note: 'Routed to Water Supply & Sewerage Board' }
    ]
  },
  {
    id: 'MYC-1026',
    title: 'Illegal Commercial Garbage Dumping Site',
    category: 'garbage',
    categoryName: 'Garbage & Waste Accumulation',
    department: 'Sanitation & Solid Waste Management',
    description: 'Unattended overflowing trash pile blocking pedestrian walkway. Smells foul and breeding mosquitoes near market residential entrance.',
    location: {
      address: 'Behind City Plaza Mall, Ward 12',
      zone: 'East Ward Zone B',
      lat: 28.6080,
      lng: 77.2300
    },
    priorityScore: 74,
    severity: 'high',
    reportCount: 24,
    status: 'Reported',
    assignedTo: 'Unassigned',
    assignedTeam: 'Pending Dispatch',
    createdAt: '2026-09-15T09:45:00Z',
    updatedAt: '2026-09-15T09:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    explainableBreakdown: {
      baseSeverity: 22,
      reportConsensus: 22,
      proximitySensitivity: 15,
      trafficCorridor: 10,
      escalationAge: 5
    },
    citizenFeedback: null,
    timeline: [
      { step: 'Reported', time: 'Sep 15, 09:45 AM', note: 'Reported by 24 citizens across 3 hours' },
      { step: 'AI Analysis', time: 'Sep 15, 09:45 AM', note: 'AI classified as Solid Waste Overflow. Priority: 74/100' }
    ]
  },
  {
    id: 'MYC-1027',
    title: 'Dark Spot due to 5 Broken Streetlights in Row',
    category: 'streetlight',
    categoryName: 'Broken Streetlight / Dark Spot',
    department: 'Electrical & Power Department',
    description: 'Entire 200m stretch of residential lane has dead streetlights. Poses severe safety hazard for women and night commuters.',
    location: {
      address: 'Lane 7, Rosewood Colony, Sector 9',
      zone: 'South Ward Zone D',
      lat: 28.5950,
      lng: 77.2020
    },
    priorityScore: 68,
    severity: 'high',
    reportCount: 14,
    status: 'Resolved',
    assignedTo: 'Lineman Suresh Chand (Electrical Dept)',
    assignedTeam: 'Zone D Repair Crew',
    createdAt: '2026-09-13T19:00:00Z',
    updatedAt: '2026-09-14T18:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    explainableBreakdown: {
      baseSeverity: 20,
      reportConsensus: 15,
      proximitySensitivity: 18,
      trafficCorridor: 10,
      escalationAge: 5
    },
    citizenFeedback: 'fixed',
    resolutionProofUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=80',
    timeline: [
      { step: 'Reported', time: 'Sep 13, 07:00 PM', note: 'Reported by Rosewood Residents Association' },
      { step: 'AI Analysis', time: 'Sep 13, 07:01 PM', note: 'AI Priority: 68/100 (Safety Hazard Dark Zone)' },
      { step: 'Assigned', time: 'Sep 14, 09:00 AM', note: 'Assigned to Electrical Dept' },
      { step: 'Resolved', time: 'Sep 14, 06:30 PM', note: 'Replaced 5 LED streetlamp transformers & bulbs. Citizen confirmed OK.' }
    ]
  },
  {
    id: 'MYC-1028',
    title: 'Clogged Stormwater Drain Overflowing onto Highway',
    category: 'drainage',
    categoryName: 'Blocked Drainage / Waterlogging',
    department: 'Stormwater & Drainage Dept',
    description: 'Heavy silt accumulated in primary stormwater drain causing water to spill over to Ring Road, slowing traffic down.',
    location: {
      address: 'Ring Road Flyover Underpass, Ward 5',
      zone: 'North Ward Zone A',
      lat: 28.6300,
      lng: 77.2100
    },
    priorityScore: 82,
    severity: 'critical',
    reportCount: 22,
    status: 'In Progress',
    assignedTo: 'Supervisor Inspector Mehta',
    assignedTeam: 'Hydraulic Desilting Team 1',
    createdAt: '2026-09-15T04:10:00Z',
    updatedAt: '2026-09-15T08:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
    explainableBreakdown: {
      baseSeverity: 28,
      reportConsensus: 20,
      proximitySensitivity: 14,
      trafficCorridor: 15,
      escalationAge: 5
    },
    citizenFeedback: null,
    timeline: [
      { step: 'Reported', time: 'Sep 15, 04:10 AM', note: 'Automated flood sensor + 22 citizen reports' },
      { step: 'AI Analysis', time: 'Sep 15, 04:11 AM', note: 'AI Flagged Highway Flood Vulnerability. Priority: 82/100' },
      { step: 'In Progress', time: 'Sep 15, 08:00 AM', note: 'Suction machine unit deployed' }
    ]
  }
];

export const PREDICTIVE_HOTSPOTS = [
  {
    id: 'HOT-1',
    zone: 'Sector 15 & Metro Corridor',
    problemType: 'Pothole & Pavement Collapse Vulnerability',
    riskLevel: 'HIGH',
    riskScore: 88,
    predictedDateWindow: 'Next 5 - 7 Days',
    reasoning: 'Monsoon rainfall forecast combined with heavy multi-axle bus traffic on asphalt laid >3 years ago. 31 reports already logged within 100m radius.',
    recommendedAction: 'Proactive micro-surfacing and drain clearing before forecasted heavy downpour on Sep 18.',
    affectedCitizensEst: '~25,000 daily commuters'
  },
  {
    id: 'HOT-2',
    zone: 'Sector 22 Market Crossroads',
    problemType: 'Major Water Pipeline Burst Risk',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    predictedDateWindow: 'Next 48 Hours',
    reasoning: 'Pressure sensors indicate 18% abnormal pressure spike in 40-year-old cast iron supply line. 1 major burst already registered nearby today (MYC-1025).',
    recommendedAction: 'Dispatch pressure valve regulation team immediately; issue preventive maintenance order for valve replacement.',
    affectedCitizensEst: '~14,000 households'
  },
  {
    id: 'HOT-3',
    zone: 'Rosewood Colony & Sector 9',
    problemType: 'Transformer Overload & Streetlight Outage',
    riskLevel: 'MEDIUM',
    riskScore: 65,
    predictedDateWindow: 'Next 10 Days',
    reasoning: 'Recent heatwave led to peak air conditioner power load causing sub-station overheating. High probability of secondary lamp ballast burnouts.',
    recommendedAction: 'Perform thermal camera audit of sub-station distribution box #9.',
    affectedCitizensEst: '~6,000 residents'
  }
];
