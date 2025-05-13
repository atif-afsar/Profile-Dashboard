// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Loading profiles...</p>
      </div>
    </div>
  );
}
