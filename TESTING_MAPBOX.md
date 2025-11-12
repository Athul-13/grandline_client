# Testing Mapbox Integration (Commit 2)

## Prerequisites

1. **Mapbox Access Token**: Add to `.env` file:
   ```
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
   Get your token from: https://account.mapbox.com/access-tokens/

2. **Environment Setup**: Make sure the app is running:
   ```bash
   npm run dev
   ```

## Testing Steps

### 1. Create a Test Page

Create a temporary test page to verify Mapbox integration works:

**File**: `src/pages/test/mapbox_test_page.tsx`

```tsx
import { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapContainer } from '../../components/quotes/quote_builder/map_container';
import { LocationSearch } from '../../components/quotes/quote_builder/location_search';
import type { Map } from 'mapbox-gl';
import type { GeocodeResult } from '../../services/api/mapbox_service';
import type MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export const MapboxTestPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [geocoderInstance, setGeocoderInstance] = useState<MapboxGeocoder | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const handleMapReady = (map: Map | null) => {
    setMapInstance(map);
    console.log('Map ready:', map);
    
    // Get geocoder from map container (it's added to the map)
    // Note: In actual implementation, we'll expose geocoder from the hook
    // For now, we can access it via the map's controls
    if (map) {
      const controls = map.getContainer().querySelector('.mapboxgl-ctrl-geocoder');
      console.log('Geocoder element:', controls);
    }
  };

  const handleLocationSelect = (result: GeocodeResult) => {
    setSelectedLocation(result);
    console.log('Location selected:', result);
    
    // Add marker at selected location
    if (mapInstance && result.center) {
      const [lng, lat] = result.center;
      
      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      // Create new marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#C5630C';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapInstance);
      
      markerRef.current = marker;
      
      // Center map on location
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 1000,
      });
    }
  };

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mapbox Integration Test</h1>
      
      {!accessToken && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Warning:</strong> VITE_MAPBOX_ACCESS_TOKEN is not set in .env file
        </div>
      )}

      <div className="border rounded-lg overflow-hidden" style={{ height: '600px', position: 'relative' }}>
        <MapContainer
          className="w-full h-full"
          onMapReady={handleMapReady}
        />
        {/* Note: Geocoder is automatically added to map by the hook */}
        {/* LocationSearch component will handle events when geocoder is available */}
      </div>

      {selectedLocation && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Selected Location:</h2>
          <p><strong>Name:</strong> {selectedLocation.placeName}</p>
          <p><strong>Coordinates:</strong> {selectedLocation.center[1]}, {selectedLocation.center[0]}</p>
        </div>
      )}

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold mb-2">Map Status:</h2>
        <p>Map Instance: {mapInstance ? 'Initialized' : 'Not initialized'}</p>
        <p>Access Token: {accessToken ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
};
```

### 2. Add Test Route

Add to your routes file (temporarily):

```tsx
import { MapboxTestPage } from '../pages/test/mapbox_test_page';

// In your routes:
<Route path="/test/mapbox" element={<MapboxTestPage />} />
```

### 3. Test Checklist

Navigate to `/test/mapbox` and verify:

- [ ] Map renders without errors
- [ ] Map shows default view (world map)
- [ ] Geocoder search input appears on the map
- [ ] Can search for a location (e.g., "New York")
- [ ] Search results appear in dropdown
- [ ] Selecting a location triggers `onLocationSelect` callback
- [ ] Map centers on selected location
- [ ] Marker appears at selected location
- [ ] No console errors
- [ ] Map controls (zoom, pan) work

### 4. Manual Testing in Browser Console

Open browser console and test:

```javascript
// Check if map is initialized
console.log('Map:', window.mapInstance); // If you expose it

// Test geocoder
// The geocoder should be visible on the map
```

### 5. Expected Behavior

✅ **Success Indicators:**
- Map loads and displays
- Geocoder search box visible on map
- Can search and select locations
- Map centers on selected location
- Marker appears at selected location
- No TypeScript or runtime errors

❌ **Common Issues:**
- **Map not showing**: Check if `VITE_MAPBOX_ACCESS_TOKEN` is set
- **Geocoder not appearing**: Check if geocoder is added to map container
- **Type errors**: Check if all imports are correct
- **CSS not loading**: Check if Mapbox CSS is imported in `index.css`

### 6. Clean Up

After testing, remove:
- Test page file
- Test route
- This testing file (optional)

## Alternative: Quick Component Test

If you don't want to create a full test page, you can temporarily add the MapContainer to an existing page:

```tsx
// In any existing page component
import { MapContainer } from '../../components/quotes/quote_builder/map_container';

// In the component JSX:
<div style={{ height: '500px', width: '100%' }}>
  <MapContainer />
</div>
```

This will at least verify the map renders correctly.

