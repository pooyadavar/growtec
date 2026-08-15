import React from "react";
import { Box, Typography } from "@mui/material";
import IrrigationOneCard from "../card/IrrigationOneCard";
import IconTextButton from "../card/IconTextButton";
import svgWatericonAsset from "../assets/svg/watericon.svg";

const now = new Date();

const formatTime = (date) =>
  date.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const nextStartTime = formatTime(new Date(now.getTime() + 20 * 60 * 1000));
const nextEndTime = formatTime(new Date(now.getTime() + 25 * 60 * 1000));

const mockChartData = Array.from({ length: 24 }, (_, index) => ({
  time: new Date(now.getTime() - (23 - index) * 30 * 60 * 1000),
  filled_volume: 2800 + Math.sin(index / 2) * 300 + index * 18,
}));

const mockSchedules = [
  {
    id: 1,
    zone: 1,
    volume: 120,
    start_time: "06:00:00",
    end_time: "06:04:00",
    is_active: true,
    is_manual: false,
    start_status: 2,
    end_status: 2,
    has_error: true,
  },
  {
    id: 2,
    zone: 2,
    volume: 90,
    start_time: nextStartTime,
    end_time: nextEndTime,
    is_active: true,
    is_manual: false,
  },
  {
    id: 3,
    zone: 3,
    volume: 75,
    start_time: "08:10:00",
    end_time: "08:13:00",
    is_active: false,
    is_manual: false,
  },
  {
    id: 4,
    zone: 1,
    volume: 60,
    start_time: "09:15:00",
    end_time: "09:17:00",
    is_active: true,
    is_manual: true,
  },
];

const IrrigationOneCardPreviewPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1,
        pt: 4,
      }}
    >
      <Typography
        fontFamily="IRANSANS"
        fontSize={13}
        fontWeight="bold"
        color="#1565C0"
        sx={{ height: 22, mb: -2 }}
      >
        زون ۱ دارد آبیاری می‌شود
      </Typography>
      <IrrigationOneCard
        storageNumber={1}
        storageCapacity={3250}
        maxStorageCapacity={5000}
        float1
        float2
        float3={false}
        chartData={mockChartData}
        irrigationScheduleItems={mockSchedules}
        zoneOptions={[1, 2, 3]}
        onClickSettings={() => {}}
      />
      <Box
        sx={{
          mt: 0,
          mb: 2,
          width: "100%",
          maxWidth: 970,
          display: "flex",
          justifyContent: "center",
          ml: 5,
          position: "relative",
          top: "-25px",
        }}
      >
        <IconTextButton
          text="آبیاری دستی"
          icon={svgWatericonAsset}
          height="35px"
          bgColor="#3fb07a"
          borderColor="#02ad5b"
          iconPosition="left"
          onClick={() => {}}
          width="200px"
          textColor="#fff"
        />
      </Box>
    </Box>
  );
};

export default IrrigationOneCardPreviewPage;
