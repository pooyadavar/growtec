import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IrrigationCard from "../../card/IrrigationCard";

const STORAGE_DATA = [
  { id: 1, capacity: 1000, float1: true, float2: true, float3: false },
  { id: 2, capacity: 2000, float1: true, float2: false, float3: false },
  { id: 3, capacity: 3000, float1: false, float2: false, float3: false },
  { id: 4, capacity: 4000, float1: true, float2: true, float3: true },
  { id: 5, capacity: 5000, float1: false, float2: true, float3: false },
  { id: 6, capacity: 6000, float1: true, float2: false, float3: true },
];

const IrrigationManyStorage = ({ onStorageClick }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        {STORAGE_DATA.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              flexShrink: 0, 
              scrollSnapAlign: "start",
            }}
          >
            <IrrigationCard
              storageNumber={item.id}
              storageCapacity={item.capacity}
              float1={item.float1}
              float2={item.float2}
              float3={item.float3}
              onClick={() => onStorageClick && onStorageClick(item.id)}
            />
          </Box>
        ))}
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
