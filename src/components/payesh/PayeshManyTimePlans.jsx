import React, { useState, useEffect, useRef, useCallback } from "react";
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

const PayeshManyTimePlans = ({ onCardClick, zone }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const [cardsData, setCardsData] = useState([]);
  const [chartsData, setChartsData] = useState({}); 
  const [loading, setLoading] = useState(true);

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

      // ۱. مرتب‌سازی زمانی (بسیار مهم برای رسم صحیح نمودار)
      logs.sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time));

      if (logs.length > 0) {
        const latestLog = logs[logs.length - 1];
        
        if (latestLog && latestLog.log_data) {
            const operators = Object.keys(latestLog.log_data).filter(key => key !== 'zone');
            setCardsData(operators);

            const newChartsData = {};
            operators.forEach(op => {
                newChartsData[op] = logs.map(log => {
                    // استخراج ساعت و دقیقه و ثانیه برای محور افقی
                    let timePart = '00:00';
                    if (log.log_date_time) {
                        const parts = log.log_date_time.split(' ');
                        timePart = parts.length > 1 ? parts[1].substring(0, 8) : log.log_date_time;
                    }
                    
                    return {
                        time: timePart,
                        // ۲. اصلاح تبدیل وضعیت به ۰ و ۱ (حمایت از تمام فرمت‌های Boolean)
                        value: Boolean(log.log_data[op]) ? 1 : 0
                    };
                });
            });
            
            setChartsData(newChartsData);
        }
      } else {
        setCardsData([]);
      }
    } catch (error) {
      console.error("Error fetching operator logs:", error);
    } finally {
      setLoading(false);
    }
  }, [zone]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

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

  if (loading) {
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
          height: "600px",
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          padding: "20px 0",
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
                cursor: "pointer"
              }}
              onClick={() => onCardClick && onCardClick(operatorKey)}
            >
              {/* ۳. ارسال دیتای نمودار به کامپوننت فرزند */}
              <TimePlansCards 
                fan={operatorKey} 
                data={chartsData[operatorKey] || []} 
                status={chartsData[operatorKey]?.slice(-1)[0]?.value === 1} // وضعیت لحظه‌ای
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