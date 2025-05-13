import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';
import MapModal from '../Components/MapModel';

export default function ProfileDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const foundProfile = savedProfiles.find(p => p.id === parseInt(id));
    
    if (foundProfile) {
      setProfile(foundProfile);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Profile Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-500 hover:text-blue-600 flex items-center"
        >
          ← Back to Profiles
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{profile.role}</p>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Location</h2>
                <p className="text-gray-600 mb-2">{profile.location}</p>
                <button
                  onClick={() => setShowMap(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  View on Map
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Contact</h2>
                <p className="text-gray-600">{profile.contact}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{profile.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMap && (
        <MapModal
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          location={profile.location}
          coordinates={profile.coordinates}
        />
      )}
    </div>
  );
}
