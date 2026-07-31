import "./App.css";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute, { SuperuserRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import VirtualKeyboard from "./components/common/VirtualKeyboard";
import ModalRequestPause from "./components/common/ModalRequestPause";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Feeding = lazy(() => import("./pages/Feeding"));
const FeedingSettingsPage = lazy(() => import("./pages/FeedingSettingsPage"));
const FeedingHistoryPage = lazy(() => import("./pages/FeedingHistoryPage"));
const Irrigation = lazy(() => import("./pages/Irrigation"));
const Payesh = lazy(() => import("./components/payesh/Payesh"));
const PayeshTimePlansPage = lazy(() => import("./pages/PayeshTimePlansPage"));
const AdminSetting = lazy(() => import("./components/admin/AdminSetting"));
const Login = lazy(() => import("./pages/Login"));
const CalculatorPreviewPage = lazy(() => import("./pages/CalculatorPreviewPage"));

const PageFallback = () => null;

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-center" />
        <VirtualKeyboard />
        <ModalRequestPause />
        <Outlet />
        <Navbar />
        <Suspense fallback={<PageFallback />}>
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
                <SuperuserRoute>
                  <AdminSetting />
                </SuperuserRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/dev/calculator" element={<CalculatorPreviewPage />} />
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
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;

