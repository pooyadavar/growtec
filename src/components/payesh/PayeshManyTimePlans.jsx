import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  IconButton,
  CircularProgress,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TimePlansCards from "../../card/TimePlansCards";
import { useQuery } from "@tanstack/react-query";
import {
  getOperatorSchedule,
  parseOperatorSchedules,
  parseOperatorLogs,
  sortOperators,
} from "../../api/climateApi";
import { getClimateOperatorLogs } from "../../api/logsApi";
import { queryKeys } from "../../api/queryKeys";

const PayeshManyTimePlans = ({ onCardClick, zone }) => {
  const resolvedZone = zone || 1;
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: schedules = {}, isLoading: schedulesLoading } = useQuery({
    queryKey: queryKeys.operatorSchedules(resolvedZone),
    queryFn: async () => {
      const response = await getOperatorSchedule({ zone: resolvedZone });
      return parseOperatorSchedules(response);
    },
    refetchInterval: 60_000,
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: queryKeys.operatorLogs(resolvedZone),
    queryFn: async () => {
      const response = await getClimateOperatorLogs(resolvedZone);
      return parseOperatorLogs(response);
    },
    refetchInterval: 10_000,
  });

  const loading = schedulesLoading || logsLoading;

  const { logOperators, chartsData, scheduleOperators } = useMemo(() => {
    const logs = logsData || [];
    const scheduleOps = sortOperators(Object.keys(schedules));

    if (logs.length === 0) {
      return { logOperators: [], chartsData: {}, scheduleOperators: scheduleOps };
    }

    const latestLog = logs[logs.length - 1];
    if (!latestLog?.log_data) {
      return { logOperators: [], chartsData: {}, scheduleOperators: scheduleOps };
    }

    const operators = sortOperators(
      Object.keys(latestLog.log_data).filter((key) => key !== "zone"),
    );
    const newChartsData = {};

    operators.forEach((op) => {
      newChartsData[op] = logs.map((log) => {
        let timePart = "00:00";
        if (log.log_date_time) {
          const parts = log.log_date_time.split(" ");
          timePart = parts.length > 1 ? parts[1].substring(0, 8) : log.log_date_time;
        }
        return {
          time: timePart,
          value: Boolean(log.log_data[op]) ? 1 : 0,
        };
      });
    });

    return {
      logOperators: operators,
      chartsData: newChartsData,
      scheduleOperators: scheduleOps,
    };
  }, [logsData, schedules]);

  const cardsData = useMemo(() => {
    return sortOperators(
      Array.from(new Set([...logOperators, ...scheduleOperators])),
    );
  }, [logOperators, scheduleOperators]);

  const handleScrollEvents = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 10;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScrollEvents);
      window.addEventListener("resize", handleScrollEvents);
      handleScrollEvents();
      return () => {
        el.removeEventListener("scroll", handleScrollEvents);
        window.removeEventListener("resize", handleScrollEvents);
      };
    }
  }, [handleScrollEvents, cardsData]);

  const slide = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 323;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading && cardsData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <IconButton
        onClick={() => slide("right")}
        disabled={!canScrollRight}
        sx={{
          width: "30px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          zIndex: 10,
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          width: "970px",
          height: "auto",
          display: "flex",
          flexDirection: "row",
          direction: "rtl",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          padding: "0",
          transform: "scale(0.95)",
        }}
      >
        {cardsData.length > 0 ? (
          cardsData.map((operatorKey) => (
            <Box
              key={operatorKey}
              sx={{
                flexShrink: 0,
                scrollSnapAlign: "start",
                marginX: "10px",
              }}
            >
              <TimePlansCards
                fan={operatorKey}
                data={chartsData[operatorKey] || []}
                status={chartsData[operatorKey]?.slice(-1)[0]?.value === 1}
                zone={resolvedZone}
                schedules={schedules[operatorKey] || []}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography>داده‌ای برای این زون یافت نشد</Typography>
          </Box>
        )}
      </Box>

      <IconButton
        onClick={() => slide("left")}
        disabled={!canScrollLeft}
        sx={{
          width: "30px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          zIndex: 10,
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>
    </Container>
  );
};

export default PayeshManyTimePlans;
