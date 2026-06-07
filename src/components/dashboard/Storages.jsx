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
  const startX = React.useRef(0);
  const scrollLeftState = React.useRef(0);

  const handleMouseDown = (e) => {
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    // فقط اگر روی ۳۵ پیکسل بالایی (سربرگ) کلیک شد، اسکرول متوقف میشه تا کلیک روی مودال عمل کنه
    if (clickY < 35) {
      isDown.current = false;
      return;
    }

    // در بقیه قسمت‌ها اسکرول با درگ فعال میشه
    isDown.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftState.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState.current - walk;
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
        touchAction: "none",

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
            <Box sx={{ position: "relative" }}>
              <StorageCard
                maxCapacity={card.max_volume}
                zone={card.id}
                capacity={card.filled_volume}
                float1={card.buttom_float_switch}
                float2={card.middle_float_switch}
                float3={card.top_float_switch}
              />

              {/* سپر نامرئی با محاسبه پیکسلی به جای درصد */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => e.stopPropagation()} // جلوگیری از باگ درگ روی لایه
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "calc(100% - 35px)", // فقط ۳۵ پیکسل بالا رو برای کلیک کردن هدر باز می‌ذاره
                  zIndex: 10,
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          </StyledScrollItem>
        ))}
      </Box>
    </Container>
  );
};

export default Storages;
