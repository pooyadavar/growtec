import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TimePlansCards from "../../card/TimePlansCards"; 

const PayeshManyTimePlans = ({ onCardClick }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Mock data for now
  const cards = [1, 2, 3, 4]; 

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
      const scrollAmount = 323; 
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
          width: "970px", 
          height: "680px",
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          padding: 0,
          transform: "scale(0.9)",
          transformOrigin: "center",
          marginTop: "-50px", 
          marginBottom: "-50px", 
        }}
      >
        {cards.map((id) => (
          <Box 
            key={id} 
            sx={{ 
              flexShrink: 0, 
              scrollSnapAlign: "start",
              marginX: "15px" // Added gap
            }}
            onClick={() => onCardClick && onCardClick(id)}
          >
            <TimePlansCards 
              fan={id} 
              float1={id % 2 === 0} 
              float2={id % 3 === 0} 
              float3={true} 
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

export default PayeshManyTimePlans;