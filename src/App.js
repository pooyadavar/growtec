import "./App.css";
import Navbar from "./components/Navbar";
import Feeding from "./pages/Feeding";
import FeedingSettingsPage from "./pages/FeedingSettingsPage";
import FeedingHistoryPage from "./pages/FeedingHistoryPage";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Irrigation from "./pages/Irrigation"; // Import Irrigation page
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      <Outlet />
      <Navbar />
      <Routes>
        <Route path="/" element={<Feeding />} />
        <Route path="/Home" element={<Dashboard />} />
        <Route path="/irrigation" element={<Irrigation />} /> 
        <Route path="/feeding-history" element={<FeedingHistoryPage />} />
        <Route path="/feeding-settings" element={<FeedingSettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;



