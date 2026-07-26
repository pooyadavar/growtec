import React from "react";
// import { useState, useEffect } from "react"; // <- حذف شد
import { 
  Container, 
  Typography, 
  Divider, 
  CircularProgress // <- اضافه شد
} from "@mui/material";
import svgTempAsset from "../../assets/svg/temp.svg";
import svgLightAsset from "../../assets/svg/light.svg";
import svgWindAsset from "../../assets/svg/Wind.svg";
import { toPersianDigits } from "../../utils/persianDigits";
// import axios from "axios"; // <- حذف شد

// --- ۱. ایمپورت‌های React Query ---
import { useQuery } from "@tanstack/react-query";
import { getOutsideCliment } from "../../api/dashboardApi"; // (مسیر را چک کنید)

// استایل کانتینر را برای استفاده در لودینگ/خطا بیرون می‌کشیم
const containerStyles = {
  backgroundColor: "#ffff",
  direction: "ltr",
  width: "200px",
  height: "210px",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  borderRadius: "10px",
  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
  padding: "0",
};

const Around = () => {

  const {
    data: outsideData,
    isLoading,
    isError,
    isRefetchError,
    error,
  } = useQuery({
        queryKey: ["outsideCliment"],
        queryFn: getOutsideCliment,
        refetchInterval: 5000,
      });

  const fetchFailed = (isError || isRefetchError) && !outsideData;
  const initialLoading = isLoading && !outsideData;

  if (initialLoading) {
    return (
      <Container
        sx={{
          ...containerStyles,
          alignItems: "center", 
        }}
      >
        <CircularProgress size={24} />
      </Container>
    );
  }

  if (fetchFailed || !outsideData) {
    return (
      <Container
        sx={{
          ...containerStyles,
          alignItems: "center",
          textAlign: "center",
          px: 1,
        }}
      >
        <Typography fontFamily={"IRANSANS"} color="error" fontSize={12}>
          {fetchFailed
            ? `خطا: ${error?.message || "خطا در دریافت اطلاعات"}`
            : "داده‌ای موجود نیست"}
        </Typography>
      </Container>
    );
  }

  const temp = Math.round(Number(outsideData.temperature ?? 0));
  const light = Math.round(Number(outsideData.light ?? 0));
  const wind = Math.round(Number(outsideData.wind ?? 0));

  return (
    <Container sx={containerStyles}>
      <div
        style={{
          marginBottom: "1rem",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "start",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              paddingRight: "1rem",
              fontFamily: "IRANSANS",
              paddingLeft: "0.5rem",
            }}
          >
            دما:
          </Typography>
          <Typography fontFamily={"IRANSANS"} fontWeight={"bold"}>
            {toPersianDigits(temp)} C
          </Typography>
        </div>
        <img src={svgTempAsset} alt="" />
      </div>
      <Divider
        sx={{ width: "100%", marginBottom: "1rem", backgroundColor: "#9F9F9F" }}
      />

      <div
        style={{
          margin: "1rem 0 1rem 0",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "start",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            fontFamily={"IRANSANS"}
            sx={{ paddingRight: "1rem", paddingLeft: "0.5rem" }}
          >
            نور:
          </Typography>
          <Typography fontFamily={"IRANSANS"} fontWeight={"bold"}>
            {toPersianDigits(light)} lux
          </Typography>
        </div>
        <img src={svgLightAsset} alt="" />
      </div>
      <Divider
        sx={{ width: "100%", marginBottom: "1rem", backgroundColor: "#9F9F9F" }}
      />

      <div
        style={{
          margin: "1rem 0 0 0",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "start",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            fontFamily={"IRANSANS"}
            sx={{ paddingRight: "1rem", paddingLeft: "0.5rem" }}
          >
            باد:
          </Typography>
          <Typography fontFamily={"IRANSANS"} fontWeight={"bold"}>
            {toPersianDigits(wind)} km/h
          </Typography>
        </div>
        <img src={svgWindAsset} alt="" />
      </div>
    </Container>
  );
};

export default Around;
