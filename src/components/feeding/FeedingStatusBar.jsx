import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import IconTextButton from "../../card/IconTextButton"; // فرض می‌کنیم در همین پوشه است
import { useNavigate } from "react-router-dom";
import assets from "../../assets";
const scheduleData = [
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "A", volume: "۵۰", status: "فعال" },
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "B", volume: "۳۰", status: "غیرفعال" },
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "A", volume: "۲۰", status: "فعال" },
  // می‌توانید ردیف‌های بیشتری اضافه کنید
];

/**
 * کامپوننت نمایش جدول زمان‌بندی ساخت محلول
 */
const FeedingStatusBar = () => {
  const navigate = useNavigate(); // ۲. تعریف هوک

  // ۳. تعریف تابع هندلر
  const handleSettingsClick = () => {
    navigate("/feeding-settings"); // به این آدرس می‌رود
  };
  
  // تابعی برای رندر کردن یک ردیف از جدول
  const renderScheduleRow = (row, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 0",
        borderBottom: index < scheduleData.length - 1 ? "1px solid #E0E0E0" : "none",
      }}
    >
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.time}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.zone}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.type}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.volume}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.status}</Typography>
      </Box>
    </Box>
  );

  // استایل‌ها برای خوانایی بهتر
  const headerStyle = {
    fontFamily: "IRANSANS",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#555",
    textAlign: "center",
    flex: 1,
  };

  const cellStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = {
    fontFamily: "IRANSANS",
    fontSize: "12px",
    color: "#333",
    backgroundColor: "#F5F5F5",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "3px",
    width: "38px", 
    textAlign: "center",
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 240, // عرض تقریبی بر اساس عکس
        height: "auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        // boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        padding: "16px",
        pb:5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* بخش جدول زمان‌بندی */}
      <Box
        sx={{
          width: "100%",
          maxHeight: "200px", // ارتفاع برای فعال شدن اسکرول
          overflowY: "auto",
          paddingRight: "8px", // فضایی برای اسکرول‌بار
        }}
      >
        {/* هدر جدول (از راست به چپ) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 0 8px 0",
            borderBottom: "2px solid #E0E0E0",
          }}
        >
          <Typography sx={headerStyle}>زمان</Typography>
          <Typography sx={headerStyle}>زون</Typography>
          <Typography sx={headerStyle}>نوع</Typography>
          <Typography sx={headerStyle}>حجم</Typography>
          <Typography sx={headerStyle}>وضعیت</Typography>
        </Box>

        {/* ردیف‌های جدول */}
        <Stack spacing={1} sx={{ width: "100%", marginTop: "8px" }}>
          {scheduleData.map(renderScheduleRow)}
        </Stack>
      </Box>

      {/* دکمه تنظیمات */}
<Box sx={{ width: "105%", marginTop: "15px", justifyContent: "right", display: "flex" }}>
        <IconTextButton
          text="تنظیمات ساخت محلول"
          icon={assets.svg.setting2}
          iconPosition="left"
          bgColor="#F7C98C"
          textColor="#333"
          borderColor="#F7C98C"
          // ۴. اصلاح onClick
          onClick={handleSettingsClick}
        />
      </Box>
    </Paper>
  );
};

export default FeedingStatusBar;

