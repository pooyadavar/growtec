import Around from "../components/dashboard/Around";
import Eghlim from "../components/dashboard/Eghlim";
import ErrorComponent from "../components/dashboard/ErrorComponent";
import PhEcControlCard from "../components/dashboard/Mixer";
import Mixer from "../components/dashboard/Mixer";
import StatusBar from "../components/dashboard/StatusBar";
import Storages from "../components/dashboard/Storages";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMixTankStatus } from "../api/dashboardApi";

const Dashboard = () => {
  sessionStorage.setItem("sample", 2);
  const [ecTarget, setEcTarget] = useState(2.1);

  const {
    data: mixTankData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["mixTankStatus"],
    queryFn: getMixTankStatus,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ marginTop: "2rem" }}>
        <Alert severity="error">
          خطا در دریافت اطلاعات داشبورد: {error.message}
        </Alert>
      </Container>
    );
  }

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
            contents={mixTankData.contents}
            statusText={getStatusText(mixTankData.status_number)}
            ecTargetValue={ecTarget}
            onEcTargetChange={handleEcChange}
            reportData={mixTankData.acid_stock_report}
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
            <StatusBar
              ecValue={mixTankData.ec_ph.ec}
              phValue={mixTankData.ec_ph.ph}
              ecRange={mixTankData.ec_ph.range.ec}
              phRange={mixTankData.ec_ph.range.ph}
            />
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
