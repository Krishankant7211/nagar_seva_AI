// Storage & Offline Queue Service for MyCity AI / Nagar Seva AI

import { INITIAL_ISSUES } from '../data/mockData';

const ISSUES_KEY = 'nagar_seva_issues_v1';
const OFFLINE_QUEUE_KEY = 'nagar_seva_offline_queue_v1';

export function getStoredIssues() {
  const data = localStorage.getItem(ISSUES_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse issues from local storage', e);
    }
  }
  // Initialize with mock dataset if empty
  localStorage.setItem(ISSUES_KEY, JSON.stringify(INITIAL_ISSUES));
  return INITIAL_ISSUES;
}

export function saveStoredIssues(issues) {
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
}

export function getOfflineQueue() {
  const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
  if (queue) {
    try {
      return JSON.parse(queue);
    } catch (e) {
      console.error('Failed to parse offline queue', e);
    }
  }
  return [];
}

export function addToOfflineQueue(reportData) {
  const queue = getOfflineQueue();
  queue.push({
    ...reportData,
    queuedAt: new Date().toISOString()
  });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  return queue.length;
}

export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}
