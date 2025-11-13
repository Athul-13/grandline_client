import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';

/**
 * Marker Utility Functions
 * Shared utilities for creating and managing map markers
 */

export interface MarkerColor {
  pickup: string;
  dropoff: string;
  stop: string;
}

export const MARKER_COLORS: MarkerColor = {
  pickup: '#10b981', // Green
  dropoff: '#ef4444', // Red
  stop: '#3b82f6', // Blue
};

/**
 * Create a map marker element
 */
const createMarkerElement = (color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = color;
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  return el;
};

/**
 * Create and add a marker to the map
 */
export const createMapMarker = (
  map: Map,
  longitude: number,
  latitude: number,
  color: string = MARKER_COLORS.stop
): mapboxgl.Marker | null => {
  if (!map || !map.loaded() || !map.getContainer()) {
    return null;
  }

  try {
    const el = createMarkerElement(color);
    const marker = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map);
    return marker;
  } catch (error) {
    console.warn('Failed to create marker:', error);
    return null;
  }
};

/**
 * Remove all markers from an array
 */
export const removeMarkers = (markers: mapboxgl.Marker[]): void => {
  markers.forEach((marker) => {
    try {
      marker.remove();
    } catch {
      // Marker might already be removed
    }
  });
};

