import React from "react";
import { Box, Typography } from "@mui/material";
import IrrigationCard from "../card/IrrigationCard";

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

const makeChartData = (offset) =>
  Array.from({ length: 18 }, (_, index) => ({
    time: new Date(now.getTime() - (17 - index) * 30 * 60 * 1000),
    filled_volume: 1800 + offset + Math.sin(index / 2) * 180 + index * 12,
  }));

const makeSchedules = (zoneOffset = 0) => [
  {
    id: 1 + zoneOffset,
    zone: 1 + zoneOffset,
    volume: 80,
    start_time: "06:00:00",
    end_time: "06:03:00",
    is_active: true,
    is_manual: false,
    start_status: 2,
    end_status: 2,
    volume_status: 78,
  },
  {
    id: 2 + zoneOffset,
    zone: 2 + zoneOffset,
    volume: 65,
    start_time: nextStartTime,
    end_time: nextEndTime,
    is_active: true,
    is_manual: false,
    start_status: 1,
    end_status: 1,
    volume_status: 0,
  },
  {
    id: 3 + zoneOffset,
    zone: 1 + zoneOffset,
    volume: 50,
    start_time: "08:10:00",
    end_time: "08:12:00",
    is_active: true,
    is_manual: true,
    start_status: 3,
    end_status: 3,
    volume_status: 50,
  },
];

const cards = [
  { id: 1, capacity: 2100, max: 4000, offset: 0, zones: [1, 2] },
  { id: 2, capacity: 2600, max: 4500, offset: 350, zones: [3, 4] },
  { id: 3, capacity: 1850, max: 3500, offset: -250, zones: [5, 6] },
];

const IrrigationManyCardsPreviewPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        pt: 2,
      }}
    >
      {cards.map((card) => (
        <Box
          key={card.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "scale(0.96)",
            transformOrigin: "center",
          }}
        >
          <Typography
            fontFamily="IRANSANS"
            fontSize={13}
            fontWeight="bold"
            color="#1565C0"
            sx={{ height: 22, mb: -1 }}
          >
            زون ۱ دارد آبیاری می‌شود
          </Typography>
          <IrrigationCard
            storageNumber={card.id}
            storageCapacity={card.capacity}
            maxStorageCapacity={card.max}
            float1
            float2={card.id !== 2}
            float3={card.id === 3}
            chartData={makeChartData(card.offset)}
            irrigationScheduleItems={makeSchedules(card.id)}
            zoneOptions={card.zones}
            onClickSettings={() => {}}
          />
        </Box>
      ))}
    </Box>
  );
};

export default IrrigationManyCardsPreviewPage;
