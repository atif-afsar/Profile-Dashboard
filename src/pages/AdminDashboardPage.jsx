import { useState, useEffect } from "react";
import profilesData from "../data/profiles.js";
import Loader from "../Components/Loader";
import SearchBar from "../Components/SearchBar";
import MapModal from "../Components/MapModel.jsx";

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({ name: "", role: "", location: "" });
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState("");

  // Load profiles from localStorage or use initial data
  useEffect(() => {
    console.log('Initial profilesData:', profilesData); // Debug log

    try {
      const savedProfiles = localStorage.getItem('profiles');
      console.log('Saved profiles from localStorage:', savedProfiles); // Debug log

      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        console.log('Parsed profiles:', parsedProfiles); // Debug log
        setProfiles(parsedProfiles);
        setFilteredProfiles(parsedProfiles);
      } else {
        console.log('No saved profiles, using initial data'); // Debug log
        setProfiles(profilesData);
        setFilteredProfiles(profilesData);
        localStorage.setItem('profiles', JSON.stringify(profilesData));
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles(profilesData);
      setFilteredProfiles(profilesData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debug log for profiles state
  useEffect(() => {
    console.log('Current profiles state:', profiles);
  }, [profiles]);

  // Debug log for filtered profiles state
  useEffect(() => {
    console.log('Current filtered profiles state:', filteredProfiles);
  }, [filteredProfiles]);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      try {
        localStorage.setItem('profiles', JSON.stringify(profiles));
      } catch (error) {
        console.error('Error saving profiles:', error);
      }
    }
  }, [profiles]);

  const validateLocation = (location) => {
    // Basic validation for location format
    const locationRegex = /^[^,]+,\s*[^,]+$/;
    return locationRegex.test(location);
  };

  const handleAdd = () => {
    setError("");
    
    if (!newProfile.name || !newProfile.role || !newProfile.location) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateLocation(newProfile.location)) {
      setError("Please enter location in the format: 'City, State/Country' (e.g., 'New York, NY')");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newProfile.name,
      role: newProfile.role,
      location: newProfile.location,
      avatar: `https://i.pravatar.cc/150?img=${profiles.length + 3}`,
      coordinates: { lat: 0, lng: 0 },
      description: `${newProfile.role} at ${newProfile.location}`,
      contact: `${newProfile.name.toLowerCase().replace(' ', '.')}@example.com`,
      interests: ["New Profile"]
    };
    
    const updatedProfiles = [...profiles, newEntry];
    setProfiles(updatedProfiles);
    setFilteredProfiles(updatedProfiles);
    setNewProfile({ name: "", role: "", location: "" });
  };

  const handleDelete = (id) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    setProfiles(updatedProfiles);
    setFilteredProfiles(updatedProfiles);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(profile => {
        return (
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredProfiles(filtered);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Debug log before render
  console.log('Rendering with profiles:', profiles);
  console.log('Rendering with filteredProfiles:', filteredProfiles);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Profile</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Name" 
            value={newProfile.name}
            onChange={e => setNewProfile({ ...newProfile, name: e.target.value })}
            className="border p-2 rounded w-full md:w-1/4" 
          />
          <input 
            type="text" 
            placeholder="Role" 
            value={newProfile.role}
            onChange={e => setNewProfile({ ...newProfile, role: e.target.value })}
            className="border p-2 rounded w-full md:w-1/4" 
          />
          <input 
            type="text" 
            placeholder="Location (e.g., New York, NY)" 
            value={newProfile.location}
            onChange={e => setNewProfile({ ...newProfile, location: e.target.value })}
            className="border p-2 rounded w-full md:w-1/4" 
          />
          <button 
            onClick={handleAdd} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Location format: City, State/Country (e.g., "New York, NY" or "London, UK")
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles && filteredProfiles.length > 0 ? (
          filteredProfiles.map(profile => (
            <div key={profile.id} className="bg-white shadow rounded p-4">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-16 h-16 rounded-full mx-auto mb-2" 
              />
              <h3 className="text-center font-semibold">{profile.name}</h3>
              <p className="text-center text-sm text-gray-500">{profile.role}</p>
              <p className="text-center text-xs text-gray-400">{profile.location}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setSelectedProfile(profile)} 
                  className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
                >
                  View Map
                </button>
                <button 
                  onClick={() => handleDelete(profile.id)} 
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No profiles found
          </div>
        )}
      </div>

      {selectedProfile && (
        <MapModal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          location={selectedProfile.location}
          coordinates={selectedProfile.coordinates}
        />
      )}
    </div>
  );
}
