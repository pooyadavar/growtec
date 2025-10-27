import Control from "../components/feeding/Control";
import FeedingMixer from "../components/feeding/FeedingMixer";
import FeedingPlans from "../components/feeding/FeedingPlans";
import FeedingStatusBar from "../components/feeding/FeedingStatusBar";
import DailyChart from "../components/feeding/DailyChart";
import { Container, Typography } from "@mui/material";
import React from "react";

const Feeding = () => {
  return (
    <Container>
      <div
        style={{
          paddingTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "976px",
          height: "338px",
        }}
      >
        <div
          style={{
            width: "288px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontFamily={"IRANSANS"} fontSize={14}>
            وضعیت محلول
          </Typography>
          <div
            style={{
              width: "100%",
              height: "310px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <FeedingStatusBar />
            <FeedingPlans />
          </div>
        </div>
        <div
          style={{
            width: "378px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={14}
          >
            مخزن ساخت محلول
          </Typography>
          <FeedingMixer />
        </div>
      </div>
      <div style={{ marginTop: "14px" }}>
        <DailyChart />
      </div>
    </Container>
  );
};
export default Feeding;
