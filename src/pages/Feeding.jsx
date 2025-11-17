import Control from "../components/feeding/Control";
import FeedingMixer from "../components/feeding/FeedingMixer";
import FeedingPlans from "../components/feeding/FeedingPlans";
import FeedingStatusBar from "../components/feeding/FeedingStatusBar";
import DailyChart from "../components/feeding/DailyChart";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import PhEcControlCardMixer from "../components/feeding/FeedingMixer";
import IconTextButton from "../card/IconTextButton";
import assets from "../assets";
import { useQuery } from "@tanstack/react-query";
import { getMixTankStatus } from "../api/dashboardApi";

const Feeding = () => {
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

  const handleHistoryClick = () => console.log("تاریخچه کلیک شد");
  const handleAiClick = () => console.log("هوش مصنوعی کلیک شد");
  const handleSettingsClick = () => console.log("تنظیمات کلیک شد");

  const [ecTarget, setEcTarget] = useState(2.1);

  const handleEcChange = (event) => {
    setEcTarget(event.target.value);
  };

  const getStatusText = (statusNumber) => {
    return statusNumber === 0 ? "در حال چک و اصلاح pH" : "وضعیت دیگر";
  };

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
          خطا در دریافت اطلاعات مخزن ساخت محلول: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div
        style={{
          paddingTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "950px",
          height: "338px",
          gap: "7px",
        }}
      >
        <div
          style={{
            width: "288px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            scale: "0.8",
            position: "relative",
            top: "-45px",
            left: "-20px",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={14}
          >
            کنترل دستی
          </Typography>
          <Control />
        </div>
        <div
          style={{
            width: "274px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scale: "1.10",
            position: "relative",
            top: "0px",
            left: "-40px",
          }}
        >
          <Typography fontFamily={"IRANSANS"} fontSize={14}>
            وضعیت محلول
          </Typography>
          <div
            style={{
              width: "100%",
              // height: "310px",
              height: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <FeedingStatusBar />
            {/* <FeedingPlans /> */}
          </div>
        </div>
        <div
          style={{
            width: "700px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            scale: "0.75",
            position: "relative",
            top: "-55px",
            left: "-20px",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={14}
          >
            مخزن ساخت محلول
          </Typography>
          {/* <FeedingMixer /> */}
          <PhEcControlCardMixer
            contents={mixTankData.contents}
            statusText={getStatusText(mixTankData.status_number)}
            ecTargetValue={ecTarget}
            onEcTargetChange={handleEcChange}
            reportData={mixTankData.acid_stock_report}
            ecValue={mixTankData.ec_ph?.ec}
            phValue={mixTankData.ec_ph?.ph}
            ecRange={mixTankData.ec_ph?.range?.ec}
            phRange={mixTankData.ec_ph?.range?.ph}
          />
          <Paper
            sx={{
              // boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
              borderRadius: "10px",
              height: "320px",
              backgroundColor: "#ffff",
              mt:"0.5rem"
            }}
          >
            <Stack
              direction="row"
              spacing={0} 
              gap={5}
              justifyContent="center"
              alignItems="center"
              sx={{
                width: "91%",
                margin: "8px 0", 
                px:"7px"
              }}
            >

              <Box sx={{}}>
                <IconTextButton
                  icon={assets.svg.clockicon}
                  text="تاریخچه ساخت "
                  bgColor="#FFD799"
                  textColor="#333"
                  onClick={handleHistoryClick}
                  width="110px"
                />
              </Box>

              <Box sx={{}}>
                <IconTextButton
                  icon={assets.svg.aiicon}
                  text="هوش مصنوعی Ai"
                  bgColor="#FF9933"
                  textColor="#fff"
                  onClick={handleAiClick}
                  width="110px"
                />
              </Box>

              <Box sx={{}}>
                <IconTextButton
                  icon={assets.svg.testtubeicone}
                  text="تنظیمات محلول"
                  bgColor="#86CCB2"
                  textColor="#333"
                  onClick={handleSettingsClick}
                  width="110px"
                />
              </Box>
            </Stack>
          </Paper>
        </div>
      </div>
      <div style={{ marginTop: "140px" , position:"relative" , top:"-120px"}}><DailyChart /></div>
    </Container>
  );
};
export default Feeding;
