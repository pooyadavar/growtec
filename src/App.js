import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Feeding from "./pages/Feeding";
import IrrigationCard from "./card/IrrigationCard";
import TimePlansCards from "./card/TimePlansCards";
import Eghlim from "./components/dashboard/Eghlim";
import { Link, Outlet } from "react-router-dom";
import Storages from "./components/dashboard/Storages";
import Payesh from "./components/payesh/Payesh";
import Login from "./pages/Login";
import TimePlans from "./components/payesh/TimePlans";
import AdminSetting from "./components/admin/AdminSetting";
import FeedingSettingsPage from "./pages/FeedingSettingsPage";
function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      {/* <Dashboard /> */}
      {/* <Feeding /> */}
      {/* <Payesh /> */}
      {/* <TimePlans /> */}
      {/* <TimePlansCards /> */}
      {/* <Login /> */}
      {/* <AdminSetting /> */}

      {/* صفحه تنظیمات محلول */}
      {/* <FeedingSettingsPage/> */}
      
      <Outlet />
    </div>
  );
}

export default App;
