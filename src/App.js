import "./App.css";
import Navbar from "./components/Navbar";
import Feeding from "./pages/Feeding";
import FeedingSettingsPage from "./pages/FeedingSettingsPage";
import FeedingHistoryPage from "./pages/FeedingHistoryPage";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
            {/* <Navbar /> */}
      {/* <Dashboard /> */}
      {/* <Feeding /> */}

      {/* برنامه زمانی ساخت محلول */}
      {/* <FeedingPlans/> */}

      {/* <Payesh /> */}
      {/* <TimePlans /> */}
      {/* <TimePlansCards /> */}
      {/* <Login /> */}
      {/* <AdminSetting /> */}

      {/* صفحه تنظیمات محلول */}
      {/* <FeedingSettingsPage/> */}
      {/* تاریخچه ساخت محلول */}
      {/* <FeedingHistoryPage/> */}
      {/* <Feeding/> */}

      {/* <Eghlim/> */}
      {/* <Payesh/> */}
      {/* <TimePlans/> */}
      {/* <TimePlans/> */}
      {/* <Control/> */}
      {/* <IrrigationCard/> */}
      {/* <IrrigationManyStorage/> */}
      {/* <IrrigationOneStorage/> */}
      <Outlet />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Feeding />} />
        <Route path="/feeding-history" element={<FeedingHistoryPage />} />
        <Route path="/feeding-settings" element={<FeedingSettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;



