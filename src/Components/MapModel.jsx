import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const libraries = ['places'];

export default function MapModal({ isOpen, onClose, location, coordinates }) {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        setError(null);

        // First check if we have valid coordinates
        if (coordinates && coordinates.lat !== 0 && coordinates.lng !== 0) {
          setCenter(coordinates);
          setLoading(false);
          return;
        }

        // If no valid coordinates, try to geocode the address
        const geocoder = new window.google.maps.Geocoder();
        
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Geocoding timeout')), 5000);
        });

        const geocodePromise = new Promise((resolve, reject) => {
          geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        try {
          const result = await Promise.race([geocodePromise, timeoutPromise]);
          const location = result.geometry.location;
          const newCoordinates = {
            lat: location.lat(),
            lng: location.lng()
          };
          setCenter(newCoordinates);
          
          // Update the coordinates in localStorage
          const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
          const updatedProfiles = savedProfiles.map(profile => {
            if (profile.location === location) {
              return { ...profile, coordinates: newCoordinates };
            }
            return profile;
          });
          localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
          setError(`Could not find location: "${location}". Please try a more specific address (e.g., "New York, NY" instead of just "New York").`);
        }
      } catch (err) {
        console.error('Map error:', err);
        setError('Error loading map. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && location && isLoaded) {
      geocodeAddress();
    }
  }, [isOpen, location, coordinates, isLoaded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Location Map</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!isLoaded || loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center text-red-500 p-4">
            <p className="text-center mb-4">{error}</p>
            <p className="text-sm text-gray-600">Tips for entering locations:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Include city and state/country</li>
              <li>Use proper formatting (e.g., "New York, NY")</li>
              <li>Check for spelling errors</li>
            </ul>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            <Marker 
              position={center}
              title={location}
            />
          </GoogleMap>
        )}
      </div>
    </div>
  );
} 