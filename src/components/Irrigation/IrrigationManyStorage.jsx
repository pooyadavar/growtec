import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IrrigationCard from "../../card/IrrigationCard";
import apiClient from "../../api/apiClient";

const IrrigationManyStorage = ({ onStorageClick }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [tanksData, setTanksData] = useState({});

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
  }, [handleScrollEvents]);

  const fetchData = async () => {
    try {
      const response = await apiClient.post("/log/irrigation/irrigation-tanks-status/");
      // The API response is expected to be an array of logs
      const data = Array.isArray(response) ? response : [];

      // Sort by date to process history correctly
      const sortedData = [...data].sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time));

      const grouped = {};
      sortedData.forEach((log) => {
        const num = log.log_data.number;
        if (!grouped[num]) {
          grouped[num] = {
            current: null,
            history: [],
          };
        }
        grouped[num].history.push({
          time: new Date(log.log_date_time),
          filled_volume: log.log_data.contents.filled_volume,
        });
        // The last one processed will be the latest due to sorting
        grouped[num].current = log.log_data.contents;
      });

      setTanksData(grouped);
    } catch (error) {
      console.error("Error fetching irrigation tanks status:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const slide = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 323; // Card width (293) + Gap (30)
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // We want to display exactly 4 tanks as per requirement
  const tankIds = [1, 2, 3, 4];

  return (
    <Container
      disableGutters 
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "0px",
         
        gap: 0, 
      }}
    >
      <IconButton
        onClick={() => slide("right")}
        disabled={!canScrollRight}
        sx={{
          width: "20px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollRight ? 1 : 0.5,
          zIndex: 10,
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          width: "970px", // Adjusted width to precisely fit 3 cards with gap at unscaled size
          height: "680px",
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          padding: 0,
          transform: "scale(0.9)", // Changed scale to 0.9
          transformOrigin: "center",
          marginTop: "-50px", // Adjusted margin compensation
          marginBottom: "-50px", // Adjusted margin compensation
        }}
      >
        {tankIds.map((id) => {
          const tank = tanksData[id];
          const current = tank ? tank.current : {};
          const history = tank ? tank.history : [];
          
          return (
            <Box 
              key={id} 
              sx={{ 
                flexShrink: 0, 
                scrollSnapAlign: "start",
              }}
            >
              <IrrigationCard
                storageNumber={id}
                storageCapacity={current?.filled_volume || 0}
                maxStorageCapacity={current?.max_volume || 0} // New prop
                float1={current?.buttom_float_switch || false}
                float2={current?.middle_float_switch || false}
                float3={current?.top_float_switch || false}
                chartData={history}
                onClick={() => onStorageClick && onStorageClick(id)}
              />
            </Box>
          );
        })}
      </Box>

      <IconButton
        onClick={() => slide("left")}
        disabled={!canScrollLeft}
        sx={{
          width: "20px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollLeft ? 1 : 0.5,
          zIndex: 10,
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>
    </Container>
  );
};

export default IrrigationManyStorage;
