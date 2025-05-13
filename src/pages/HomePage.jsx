// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../Components/ProfileCard';
import SearchBar from '../Components/SearchBar';
import Loader from '../Components/Loader';

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);
      setFilteredProfiles(parsedProfiles);
    }
    setLoading(false);
  }, []);

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

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(profile => 
        profile.role.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white py-8 mb-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl font-bold mb-4 md:mb-0 animate-slide-down text-black">Profile Dashboard</h1>
            <Link
              to="/admin"
              className="bg-white text-black px-6 py-2 rounded-full hover:bg-primary-50 transition-colors duration-300 flex items-center animate-slide-up shadow-md font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleFilter('all')}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                activeFilter === 'all'
                  ? 'bg-primary-500 text-black shadow-md'
                  : 'bg-white text-secondary-700 hover:bg-primary-50 shadow-sm'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('engineer')}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                activeFilter === 'engineer'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-secondary-700 hover:bg-primary-50 shadow-sm'
              }`}
            >
              Engineers
            </button>
            <button
              onClick={() => handleFilter('designer')}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                activeFilter === 'designer'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-secondary-700 hover:bg-primary-50 shadow-sm'
              }`}
            >
              Designers
            </button>
            <button
              onClick={() => handleFilter('manager')}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                activeFilter === 'manager'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-secondary-700 hover:bg-primary-50 shadow-sm'
              }`}
            >
              Managers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles && filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile, index) => (
              <div
                key={profile.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProfileCard profile={profile} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-secondary-700 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-medium text-secondary-800">No profiles found</p>
              <p className="text-sm mt-2 text-secondary-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
