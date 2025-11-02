import React from "react";
// import { useState, useEffect } from "react"; // <- حذف شد
import { 
  Container, 
  Typography, 
  Divider, 
  Box, // <- اضافه شد
  CircularProgress // <- اضافه شد
} from "@mui/material";
import assets from "../../assets";
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
    error,
  } = useQuery({
    queryKey: ["outsideCliment"],
    queryFn: getOutsideCliment,

  });

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    const str = String(num || 0);
    let res = "";
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  if (isLoading || !outsideData) {
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


  if (isError) {
    return (
      <Container
        sx={{
          ...containerStyles,
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <Typography fontFamily={"IRANSANS"} color="error">
          خطا: {error.message}
        </Typography>
      </Container>
    );
  }

  const { temperature: temp, light, wind } = outsideData;

  return (
    <Container sx={containerStyles}>
      <div
        style={{
          marginBottom: "1rem",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "start",
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
            {temp.toFixed(2)} C
          </Typography>
        </div>
        <img src={assets.svg.temp} alt="" />
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
            {light.toFixed(2)} lux
          </Typography>
        </div>
        <img src={assets.svg.light} alt="" />
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
            {wind.toFixed(2)} km/h
          </Typography>
        </div>
        <img src={assets.svg.wind} alt="" />
      </div>
    </Container>
  );
};

export default Around;