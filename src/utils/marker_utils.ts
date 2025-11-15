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
  console.log('📍 createMapMarker called', {
    longitude,
    latitude,
    color,
    hasMap: !!map,
    hasContainer: !!map?.getContainer(),
    mapLoaded: map?.loaded(),
  });

  // Basic validation - map and container must exist
  if (!map || !map.getContainer()) {
    console.log('❌ createMapMarker: Map or container not ready');
    return null;
  }

  // Check if map style is loaded - required for marker creation
  try {
    if (!map.isStyleLoaded()) {
      console.log('❌ createMapMarker: Map style not loaded yet');
      return null;
    }
  } catch (error) {
    // isStyleLoaded() might throw if style isn't initialized
    console.log('❌ createMapMarker: Cannot check style loaded state', error);
    return null;
  }

  // Try to create marker
  try {
    const el = createMarkerElement(color);
    console.log('📍 createMapMarker: Marker element created');
    
    // Get the map's container element where markers are added
    const container = map.getContainer();
    if (!container) {
      console.log('❌ createMapMarker: Map container not available');
      return null;
    }

    const marker = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map);
    console.log('✅ createMapMarker: Marker added to map successfully');
    return marker;
  } catch (error) {
    // Marker creation failed
    console.log('❌ createMapMarker: Failed to create marker', error);
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

