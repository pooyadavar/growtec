import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import IconTextButton from "../../card/IconTextButton"; // فرض می‌کنیم در همین پوشه است
const iconSettings = "https://placehold.co/24x24/333/white?text=Setting";
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
      <Box sx={{ width: "120%", marginTop: "24px" ,justifyContent:"center" , display:"flex"}}>
        <IconTextButton
          text="تنظیمات ساخت محلول"
          icon={iconSettings}
          iconPosition="right"
          bgColor="#F7C98C" // رنگ شبیه به عکس
          textColor="#333"
          borderColor="#F7C98C"
          onClick={() => {
            /* منطق باز کردن تنظیمات */
          }}
        />
      </Box>
    </Paper>
  );
};

export default FeedingStatusBar;

