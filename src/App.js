import "./App.css";
import Navbar from "./components/Navbar";
import Feeding from "./pages/Feeding";
import FeedingSettingsPage from "./pages/FeedingSettingsPage";
import FeedingHistoryPage from "./pages/FeedingHistoryPage";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Irrigation from "./pages/Irrigation"; // Import Irrigation page
import Payesh from "./components/payesh/Payesh"; // Import Payesh component
import PayeshTimePlansPage from "./pages/PayeshTimePlansPage"; // Import PayeshTimePlansPage
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
        <Route path="/payesh" element={<Payesh />} />
        <Route path="/payesh-time-plans" element={<PayeshTimePlansPage />} />
        <Route path="/feeding-history" element={<FeedingHistoryPage />} />
        <Route path="/feeding-settings" element={<FeedingSettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;



