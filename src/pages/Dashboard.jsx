import Around from "../components/dashboard/Around";
import Eghlim from "../components/dashboard/Eghlim";
import ErrorComponent from "../components/dashboard/ErrorComponent";
import PhEcControlCard from "../components/dashboard/Mixer";
import Mixer from "../components/dashboard/Mixer";
import StatusBar from "../components/dashboard/StatusBar";
import Storages from "../components/dashboard/Storages";
import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Dashboard = () => {
  sessionStorage.setItem("sample", 2);

  const apiData = {
    ec_ph: {
      /* ... */
    },
    contents: {
      max_volume: 100.0,
      filled_volume: 80.0,
      buttom_float_switch: false,
      middle_float_switch:true,
      top_float_switch: true,
    },
    injected: {
      /* ... */
    },
    stock_dosing_pump: true,
    acid_dosing_pump: true,
    input_water: [],
    input_water_number: 0,
    output_zone: [],
    output_zone_number: 0,
    status: null,
    status_number: 0,
    gif_counter: 0,
    acid_stock_report: [
      [
        0, 0.0, 0.0, 0.0, 0.0, 0.0, 500.0, 0.0, 0.0, 0.0, 0.0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 26214, 16230, 52429, 16268,
      ],
    ],
  };

  const [ecTarget, setEcTarget] = useState(2.1);

  const handleEcChange = (event) => {
    setEcTarget(event.target.value);
  };

  const getStatusText = (statusNumber) => {
    return statusNumber === 0 ? "در حال چک و اصلاح pH" : "وضعیت دیگر";
  };

  return (
    <Container
      className="dashboard-display"
      sx={{ marginTop: "1rem", height: "100%" }}
    >
      <div
        className="top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div className="errors" style={{ height: "351px" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            خطاها
          </Typography>
          <ErrorComponent />
        </div>
        <div className="mixer" style={{ height: "351px" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            فرایند ساخت محلول
          </Typography>
          <PhEcControlCard
            // Props های قبلی
            contents={apiData.contents}
            statusText={getStatusText(apiData.status_number)}
            ecTargetValue={ecTarget}
            onEcTargetChange={handleEcChange}
            // --- Prop جدید ---
            reportData={apiData.acid_stock_report}
          />
        </div>
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
          <div style={{ marginBottom: "0" }}>
            <Typography
              color="initial"
              fontFamily={"IRANSANS"}
              fontSize={14}
              textAlign={"center"}
              paddingBottom={"5px"}
            >
              وضعیت محلول
            </Typography>
            <StatusBar />
          </div>
          <div>
            <Typography
              color="initial"
              fontFamily={"IRANSANS"}
              fontSize={14}
              textAlign={"center"}
              paddingBottom={"5px"}
            >
              {" "}
              مخازن آبیاری
            </Typography>
            <Storages />
          </div>
        </div>
      </div>
      <div
        className="bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <div className="around" style={{ height: "240px" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            هواشناسی
          </Typography>
          <Around />
        </div>
        <div className="eghlim" style={{ height: "240px" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            اقلیم داخلی
          </Typography>
          <Eghlim />
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
