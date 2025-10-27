import React from "react";
import { useState, useEffect } from "react";
import { Container, Typography, Divider } from "@mui/material";
import assets from "../../assets";
import axios from "axios";

const Around = () => {
  const apiDomain = "http://192.168.3.47:8000";
  const [temp, setTemp] = useState(0);
  const [light, setLight] = useState(0);
  const [wind, setWind] = useState(0.0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Replace with your API endpoints
  //       const api1 = `${apiDomain}/api/v1/info/outside-climent/`;

  //       const response1 = await axios.get(api1);

  //       // Set data in state
  //       setTemp(response1.data.temperature);
  //       setLight(response1.data.light);
  //       setWind(response1.data.wind);
  //       // console.log(response1.data.wind);
  //       set;
  //     } catch (err) {
  //       setError(err.message || "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  return (
    <Container
      sx={{
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
      }}
    >
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
