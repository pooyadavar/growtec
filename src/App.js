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
import FeedingHistoryPage from "./pages/FeedingHistoryPage";
import Control from "./components/feeding/Control";
import FeedingPlans from "./components/feeding/FeedingPlans";

import IrrigationOneStorage from "./components/Irrigation/IrrigationOneStorage";
function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      {/* <Dashboard /> */}
      {/* <Feeding /> */}
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
      <Feeding/>

      {/* <Eghlim/> */}
      {/* <Payesh/> */}
      {/* <TimePlans/> */}
      {/* <TimePlans/> */}
      {/* <Control/> */}
      {/* <IrrigationCard/> */}
      {/* <IrrigationManyStorage/> */}
      {/* <IrrigationOneStorage/> */}
      <Outlet />
    </div>
  );
}

export default App;



