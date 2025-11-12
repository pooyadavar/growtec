import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import ErrorComponent from "../components/dashboard/ErrorComponent";
import PhEcControlCard from "../components/dashboard/Mixer";
import StatusBar from "../components/dashboard/StatusBar";
import Storages from "../components/dashboard/Storages";
import Around from "../components/dashboard/Around";
import Eghlim from "../components/dashboard/Eghlim";

const Dashboard = () => {
  sessionStorage.setItem("sample", 2);
  const [ecTarget, setEcTarget] = useState(2.1);

  // 🧩 mock data
  const mixTankData = {
    status_number: 0,
    contents: [
      { id: 1, name: "تانک A", volume: 120, capacity: 200, status: "در حال پر شدن" },
      { id: 2, name: "تانک B", volume: 80, capacity: 200, status: "آماده استفاده" },
      { id: 3, name: "تانک C", volume: 190, capacity: 200, status: "پر شده" },
    ],
    ec_ph: {
      ec: 2.05,
      ph: 6.7,
      range: {
        ec: { min: 1.8, max: 2.2 },
        ph: { min: 6.5, max: 7.0 },
      },
    },
    acid_stock_report: {
      acid_stock_level: 65,
      last_refill_date: "2025-11-10T08:45:00Z",
      consumption_rate: "5L/hour",
    },
  };

  const handleEcChange = (event) => setEcTarget(event.target.value);

  const getStatusText = (statusNumber) => {
    return statusNumber === 0 ? "در حال چک و اصلاح pH" : "فرایند دیگر";
  };

  return (
    <Container className="dashboard-display" sx={{ marginTop: "1rem", height: "100%" }}>
      {/* ---------- TOP SECTION ---------- */}
      <div
        className="top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* ERRORS */}
        <div className="errors" style={{ height: "351px" }}>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            خطاها
          </Typography>
          <ErrorComponent />
        </div>

        {/* MIXER */}
        <div className="mixer" style={{ height: "351px" }}>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            فرایند ساخت محلول
          </Typography>
          <PhEcControlCard
            contents={mixTankData.contents}
            statusText={getStatusText(mixTankData.status_number)}
            ecTargetValue={ecTarget}
            onEcTargetChange={handleEcChange}
            reportData={mixTankData.acid_stock_report}
          />
        </div>

        {/* STATUS + STORAGES */}
        <div
          className="status-storages"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "351px",
            paddingBottom: "4px",
          }}
        >
          <div>
            <Typography fontFamily={"IRANSANS"} fontSize={14} textAlign={"center"} paddingBottom={"5px"}>
              وضعیت محلول
            </Typography>
            <StatusBar
              ecValue={mixTankData.ec_ph.ec}
              phValue={mixTankData.ec_ph.ph}
              ecRange={mixTankData.ec_ph.range.ec}
              phRange={mixTankData.ec_ph.range.ph}
            />
          </div>
          <div>
            <Typography fontFamily={"IRANSANS"} fontSize={14} textAlign={"center"} paddingBottom={"5px"}>
              مخازن آبیاری
            </Typography>
            <Storages />
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM SECTION ---------- */}
      <div
        className="bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <div className="around" style={{ height: "240px" }}>
          <Typography fontFamily={"IRANSANS"} fontSize={14} textAlign={"center"} paddingBottom={"5px"}>
            هواشناسی
          </Typography>
          <Around />
        </div>

        <div className="eghlim" style={{ height: "240px" }}>
          <Typography fontFamily={"IRANSANS"} fontSize={14} textAlign={"center"} paddingBottom={"5px"}>
            اقلیم داخلی
          </Typography>
          <Eghlim />
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
