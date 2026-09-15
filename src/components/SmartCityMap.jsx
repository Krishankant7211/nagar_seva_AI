import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Sparkles, MapPin, AlertCircle, Layers } from 'lucide-react';

export default function SmartCityMap({ 
  issues, 
  predictiveHotspots, 
  onSelectIssue, 
  onOpenExplainModal 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map centered around city coordinates (e.g. Delhi / Sector 15)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090],
        zoom: 13,
        zoomControl: true
      });

      // Dark Mode Tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add Issue Markers
    issues.forEach(issue => {
      if (!issue.location || !issue.location.lat || !issue.location.lng) return;

      const priority = issue.priorityScore || 50;
      const severityClass = priority >= 80 ? 'critical' : priority >= 65 ? 'high' : priority >= 45 ? 'medium' : 'low';
      
      const count = issue.reportCount || 1;
      const isCluster = count > 5;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
          <div class="custom-map-pin ${isCluster ? 'cluster-pin' : 'pin-' + severityClass}">
            ${isCluster ? count : '📍'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="color: #0f172a; padding: 4px; font-family: system-ui;">
          <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">${issue.title}</div>
          <div style="font-size: 0.8rem; color: #475569; margin-bottom: 6px;">📍 ${issue.location.address}</div>
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
            <span style="background: ${priority >= 80 ? '#ef4444' : '#3b82f6'}; color: white; padding: 2px 8px; border-radius: 99px; font-weight: 700; font-size: 0.75rem;">
              Score: ${priority}/100
            </span>
            ${count > 1 ? `<span style="background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 99px; font-weight: 600; font-size: 0.75rem;">${count} Reports Merged</span>` : ''}
          </div>
          <div style="font-size: 0.8rem; color: #334155;">Status: <strong>${issue.status}</strong></div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectIssue(issue);
      });
    });

    // Add Predictive Hotspot Overlays (Glowing Circles)
    predictiveHotspots.forEach(hot => {
      if (hot.id === 'HOT-1') {
        L.circle([28.6139, 77.2090], {
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.25,
          radius: 600
        }).addTo(map).bindPopup(`<b>🔮 Predictive AI Hotspot:</b> ${hot.problemType}`);
      } else if (hot.id === 'HOT-2') {
        L.circle([28.6250, 77.2180], {
          color: '#f97316',
          fillColor: '#f97316',
          fillOpacity: 0.25,
          radius: 500
        }).addTo(map).bindPopup(`<b>🔮 Predictive AI Hotspot:</b> ${hot.problemType}`);
      }
    });

  }, [issues, predictiveHotspots]);

  return (
    <div style={{ width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 400,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '0.75rem',
        color: '#e2e8f0',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} /> Critical (80+)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }} /> High (65-79)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} /> Merged Cluster
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(239,68,68,0.4)', border: '1px solid #ef4444' }} /> AI Predicted Risk Zone
        </div>
      </div>
    </div>
  );
}
