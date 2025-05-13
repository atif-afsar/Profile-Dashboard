// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from "./Components/Loader";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import HomePage from "./pages/HomePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route for HomePage (assuming you have a home page) */}
        <Route path="/" element={<HomePage />} />

        {/* Route for AdminDashboard */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Route for ProfileDetailsPage */}
        <Route path="/profile/:id" element={<ProfileDetailsPage />} />

        {/* You can add more routes here as needed */}

        {/* Fallback Loader route if something goes wrong (this can be omitted if you prefer) */}
        <Route path="*" element={<Loader />} />
      </Routes>
    </Router>
  );
}
