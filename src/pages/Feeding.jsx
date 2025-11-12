import Control from "../components/feeding/Control";
import FeedingMixer from "../components/feeding/FeedingMixer";
import FeedingPlans from "../components/feeding/FeedingPlans";
import FeedingStatusBar from "../components/feeding/FeedingStatusBar";
import DailyChart from "../components/feeding/DailyChart";
import { Box, Container, Typography, Stack, Paper } from "@mui/material";
import React, { useState } from "react";
import PhEcControlCard from "../components/dashboard/Mixer";
import PhEcControlCardMixer from "../components/feeding/FeedingMixer";
import IconTextButton from "../card/IconTextButton";
import assets from "../assets";

const Feeding = () => {
  const apiData = {
    ec_ph: {
      /* ... */
    },
    contents: {
      max_volume: 100.0,
      filled_volume: 80.0,
      buttom_float_switch: false,
      middle_float_switch: true,
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
      [0, 0.0, 0.0, 0.0, 0.0, 0.0, 500.0, 0.0, 0.0, 0.0, 0.0],
      [0, 0, 0, 0, 0, 0, 0, 26214, 16230, 52429, 16268],
    ],
  };

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
            contents={apiData.contents}
            statusText={getStatusText(apiData.status_number)}
            ecTargetValue={ecTarget}
            onEcTargetChange={handleEcChange}
            reportData={apiData.acid_stock_report}
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
