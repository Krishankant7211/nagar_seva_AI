// Agentic AI Engine for MyCity AI / Nagar Seva AI Platform

import { CATEGORIES } from '../data/mockData';

/**
 * Calculates distance between two GPS coordinates in meters using Haversine formula
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Simulates Multimodal AI Vision & NLP analysis of an uploaded photo or complaint text
 */
export function analyzeCivicReport(imageDataUrl, userText = '') {
  const textLower = userText.toLowerCase();

  let category = 'pothole';
  let severity = 'high';
  let confidence = 94;
  let title = 'AI Detected Pothole & Asphalt Damage';

  if (textLower.includes('water') || textLower.includes('leak') || textLower.includes('pipe') || textLower.includes('burst')) {
    category = 'water';
    severity = 'critical';
    title = 'AI Detected Major Pipeline Water Leakage';
    confidence = 96;
  } else if (textLower.includes('garbage') || textLower.includes('trash') || textLower.includes('waste') || textLower.includes('smell')) {
    category = 'garbage';
    severity = 'high';
    title = 'AI Detected Garbage & Waste Accumulation';
    confidence = 92;
  } else if (textLower.includes('light') || textLower.includes('dark') || textLower.includes('lamp') || textLower.includes('street')) {
    category = 'streetlight';
    severity = 'medium';
    title = 'AI Detected Broken Streetlight / Dark Zone';
    confidence = 95;
  } else if (textLower.includes('drain') || textLower.includes('flood') || textLower.includes('waterlog')) {
    category = 'drainage';
    severity = 'critical';
    title = 'AI Detected Clogged Drainage & Waterlogging Risk';
    confidence = 93;
  } else if (textLower.includes('hole') || textLower.includes('road') || textLower.includes('pothole') || textLower.includes('crack')) {
    category = 'pothole';
    severity = 'high';
    title = 'AI Detected Deep Pothole & Road Structure Defect';
    confidence = 97;
  }

  const catObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  return {
    category: catObj.id,
    categoryName: catObj.name,
    department: catObj.dept,
    severity,
    confidence,
    title,
    aiTagLine: `AI Multi-Modal Classifier (${confidence}% confidence): ${title}`
  };
}

/**
 * AI Duplicate Report Detection & Aggregation Engine
 * Searches for reports of the same category within 300 meters
 */
export function findDuplicateIssue(newLat, newLng, newCategory, existingIssues) {
  const RADIUS_METERS = 350;

  for (const issue of existingIssues) {
    if (issue.category === newCategory && issue.status !== 'Resolved') {
      const dist = calculateDistanceMeters(newLat, newLng, issue.location.lat, issue.location.lng);
      if (dist <= RADIUS_METERS) {
        return {
          isDuplicate: true,
          matchedIssue: issue,
          distanceMeters: dist
        };
      }
    }
  }

  return { isDuplicate: false, matchedIssue: null, distanceMeters: 0 };
}

/**
 * Dynamic Explainable AI Priority Score Formula (0 - 100)
 */
export function computePriorityScore(issue) {
  // 1. Base Severity Score (Max 30)
  let baseSeverity = 20;
  if (issue.severity === 'critical') baseSeverity = 30;
  else if (issue.severity === 'high') baseSeverity = 22;
  else if (issue.severity === 'medium') baseSeverity = 15;
  else if (issue.severity === 'low') baseSeverity = 8;

  // 2. Report Consensus Bonus (Max 25 pts for high report volume)
  const count = issue.reportCount || 1;
  const reportConsensus = Math.min(25, Math.round(count * 0.85));

  // 3. Proximity Sensitivity (School, Hospital, Highway, Residential) (Max 20 pts)
  let proximitySensitivity = 10;
  const desc = (issue.description || '') + (issue.location?.address || '');
  if (/school|hospital|market|bus|metro|highway|station/i.test(desc)) {
    proximitySensitivity = 20;
  } else if (/colony|residential|sector/i.test(desc)) {
    proximitySensitivity = 15;
  }

  // 4. Traffic Corridor Density (Max 15 pts)
  let trafficCorridor = 8;
  if (/main road|highway|crossroads|arterial|expressway|flyover/i.test(desc)) {
    trafficCorridor = 15;
  }

  // 5. Escalation Age Factor (Max 10 pts)
  const ageHours = issue.createdAt ? (new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60) : 0;
  const escalationAge = Math.min(10, Math.round(ageHours * 0.2));

  const total = Math.min(100, baseSeverity + reportConsensus + proximitySensitivity + trafficCorridor + escalationAge);

  return {
    priorityScore: total,
    breakdown: {
      baseSeverity,
      reportConsensus,
      proximitySensitivity,
      trafficCorridor,
      escalationAge
    }
  };
}

/**
 * Generates an Explainable AI natural language summary
 */
export function getExplainableAiSummary(issue) {
  const { priorityScore, breakdown } = computePriorityScore(issue);
  return {
    score: priorityScore,
    severityLabel: priorityScore >= 80 ? 'CRITICAL EMERGENCY' : priorityScore >= 65 ? 'HIGH PRIORITY' : priorityScore >= 45 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY',
    breakdown: [
      { factor: 'Base Problem Severity', points: breakdown.baseSeverity, max: 30, desc: `Classified as ${issue.severity.toUpperCase()} impact` },
      { factor: 'Citizen Report Volume Consensus', points: breakdown.reportConsensus, max: 25, desc: `${issue.reportCount || 1} verified citizen reports aggregated` },
      { factor: 'Proximity to Sensitive Zone', points: breakdown.proximitySensitivity, max: 20, desc: 'Located near school/hospital/public transit node' },
      { factor: 'Traffic Corridor Density', points: breakdown.trafficCorridor, max: 15, desc: 'High vehicle & pedestrian throughput area' },
      { factor: 'Issue Escalation Age', points: breakdown.escalationAge, max: 10, desc: 'Accumulated time unaddressed' }
    ]
  };
}
