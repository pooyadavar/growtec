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
import AdminSetting from "./components/admin/AdminSetting"; // Import AdminSetting
import Login from "./pages/Login"; // Import Login page
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-center" />
        <Outlet />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Dashboard />} />
          <Route
            path="/Feeding"
            element={
              <ProtectedRoute>
                <Feeding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/irrigation"
            element={
              <ProtectedRoute>
                <Irrigation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payesh"
            element={
              <ProtectedRoute>
                <Payesh />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payesh-time-plans"
            element={
              <ProtectedRoute>
                <PayeshTimePlansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-settings"
            element={
              <ProtectedRoute>
                <AdminSetting />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/feeding-history"
            element={
              <ProtectedRoute>
                <FeedingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feeding-settings"
            element={
              <ProtectedRoute>
                <FeedingSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;



