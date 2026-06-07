import * as React from "react";
import { Container, Box, Typography } from "@mui/material";
import StorageCard from "../../card/StorageCard";
import styled from "styled-components";

// آیتم‌های تکی
const StyledScrollItem = styled(Box)({
  transition: "transform 0.3s ease",
  flexShrink: 0,
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
});

const Storages = ({ storagesList = [] }) => {
  const scrollContainerRef = React.useRef(null);

  const isDown = React.useRef(false);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftState = React.useRef(0);

  // --- رویدادهای دسکتاپ (موس) ---
  const handleMouseDown = (e) => {
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftState.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }

    scrollContainerRef.current.scrollLeft = scrollLeftState.current - walk;
  };

  // --- رویدادهای موبایل و صفحات لمسی (Touch) ---
  const handleTouchStart = (e) => {
    isDragging.current = false;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX;
    if (Math.abs(x - startX.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  if (!storagesList || storagesList.length === 0) {
    return (
      <Container
        className="storage"
        sx={{
          width: "340px",
          height: "184px",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
          borderRadius: "10px",
        }}
      >
        <Typography fontFamily={"IRANSANS"} fontSize={12} color="textSecondary">
          مخزنی یافت نشد
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      ref={scrollContainerRef}
      className="storage"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={(e) => e.preventDefault()} // <--- جادوی اصلی برای جلوگیری از گیر کردن درگ روی کارت‌ها
      sx={{
        width: "340px",
        height: "184px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        direction: "ltr",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        borderRadius: "10px",
        p: "0 12px 14px 12px !important",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        overflowX: "auto",
        scrollPaddingLeft: "12px",
        userSelect: "none",
        touchAction: "pan-x", // <--- برای اینکه اسکرول با انگشت به روان‌ترین شکل کار کند
        
        "&::-webkit-scrollbar": {
          display: "block",
          height: "25px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#EBEBEB",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#6a6a6a",
          borderRadius: "8px",
          border: "4px solid #EBEBEB",
          "&:hover": {
            background: "#444444",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          pt: 2,
          width: "max-content",
        }}
      >
        {storagesList.map((card) => (
          <StyledScrollItem key={card.id}>
            <Box
              onClickCapture={(e) => {
                // اگر در حال درگ یا سوایپ بودیم، کلاً رویداد کلیک را باطل کن تا مودال الکی باز نشود
                if (isDragging.current) {
                  e.stopPropagation();
                  e.preventDefault();
                  return;
                }
              }}
              sx={{ position: "relative" }}
            >
              <StorageCard
                maxCapacity={card.max_volume}
                zone={card.id}
                capacity={card.filled_volume}
                float1={card.buttom_float_switch}
                float2={card.middle_float_switch}
                float3={card.top_float_switch}
              />
            </Box>
          </StyledScrollItem>
        ))}
      </Box>
    </Container>
  );
};

export default Storages;