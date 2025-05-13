import { useState } from 'react';
import { Link } from 'react-router-dom';
import MapModal from './MapModel';

export default function ProfileCard({ profile }) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-card overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
      <div className="relative">
        <img
          src={profile.avatar}
          alt={profile.name}
          loading="lazy"
          className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-600/70 via-secondary-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-2xl font-bold text-primary-700">{profile.name}</h3>
        <p className="text-secondary-500 font-medium">{profile.role}</p>
        <p className="text-secondary-600 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {profile.location}
        </p>

        <div className="flex gap-2 pt-3">
          <Link
            to={`/profile/${profile.id}`}
            aria-label="View profile details"
            className="flex-1 bg-green-500 hover:bg-primary-600 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center font-medium shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </Link>

          <button
            onClick={() => setIsMapOpen(true)}
            aria-label="View location on map"
            className="flex-1 bg-blue-500 hover:bg-secondary-600 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center font-medium shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Map
          </button>
        </div>
      </div>

      {isMapOpen && (
        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          location={profile.location}
          coordinates={profile.coordinates}
        />
      )}
    </div>
  );
}
