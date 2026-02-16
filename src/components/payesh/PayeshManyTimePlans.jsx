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
import apiClient from "../../api/apiClient";
import { getOperatorSchedule } from "../../api/climateApi";

const PayeshManyTimePlans = ({ onCardClick, zone }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const [logOperators, setLogOperators] = useState([]);
  const [scheduleOperators, setScheduleOperators] = useState([]);
  const [chartsData, setChartsData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState({});

  const cardsData = useMemo(() => {
    return Array.from(new Set([...logOperators, ...scheduleOperators]));
  }, [logOperators, scheduleOperators]);

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await getOperatorSchedule({ zone: zone || 1 });
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response && response.results && Array.isArray(response.results)) {
        data = response.results;
      } else if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      }

      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.operator]) grouped[item.operator] = [];
        grouped[item.operator].push(item);
      });
      setSchedules(grouped);
      setScheduleOperators(Object.keys(grouped));
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, [zone]);

  const fetchData = useCallback(async () => {
    try {
      const requestBody = { zone: zone || 1 };
      const response = await apiClient.post('/log/climate/operators/', requestBody);

      let logs = [];
      if (Array.isArray(response)) {
        logs = response;
      } else if (response && response.results && Array.isArray(response.results)) {
        logs = response.results;
      }

      logs.sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time));

      if (logs.length > 0) {
        const latestLog = logs[logs.length - 1];
        
        if (latestLog && latestLog.log_data) {
            const operators = Object.keys(latestLog.log_data).filter(key => key !== 'zone');
            setLogOperators(operators);

            const newChartsData = {};
            operators.forEach(op => {
                newChartsData[op] = logs.map(log => {
                    let timePart = '00:00';
                    if (log.log_date_time) {
                        const parts = log.log_date_time.split(' ');
                        timePart = parts.length > 1 ? parts[1].substring(0, 8) : log.log_date_time;
                    }
                    
                    return {
                        time: timePart,
                        value: Boolean(log.log_data[op]) ? 1 : 0
                    };
                });
            });
            
            setChartsData(newChartsData);
        }
      } else {
        setLogOperators([]);
      }
    } catch (error) {
      console.error("Error fetching operator logs:", error);
    } finally {
      setLoading(false);
    }
  }, [zone]);

  useEffect(() => {
    fetchData();
    fetchSchedules();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData, fetchSchedules]);

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
          height: "auto", // Changed from 600px
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          padding: "0", // Changed from "20px 0"
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
                zone={zone || 1}
                schedules={schedules[operatorKey] || []}
                onRefresh={fetchSchedules}
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
