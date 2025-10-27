import React, { useState, useEffect } from "react";
import { Slider, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import assets from "../../assets";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const StatusBar = () => {
  const apiDomain = "http://192.168.3.47:8000";

  const [ec, setEc] = useState(0);
  const [ph, setPh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoints
        const api = `${apiDomain}/api/v1/info/soluble-status/`;
        const response = await axios.get(api);
      } catch (err) {
        setError(err.message || "Something went wrong"); // Set error message
        console.error("Error fetching data:", err); // Log the error for debugging
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };
    fetchData();
  }, [apiDomain]);

  const [value, setValue] = useState(50);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const useStyle = makeStyles(() => ({
    barContainer: {},
  }));

  const classes = useStyle();
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "350px",
        height: "100px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        backgroundColor: "#ffff",
      }}
    >
      <div
        className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "300px",
          height: "30px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> EC : {convert(ec)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <img
            style={{
              position: "relative",
              top: "6px",
              right: `${ph}px`,
              scale: "1.2",
              zIndex: "1",
            }}
            src={assets.svg.mark}
            alt="mark"
          />
          <img
            style={{ width: "166px", height: "16px" }}
            src={assets.svg.phBar}
            alt="bar"
          />
        </div>
      </div>
      <div
        className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "300px",
          height: "30px",
          border: "0.5px solid #9F9F9F",
          marginTop: "10px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> pH : {convert(ph)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <img
            style={{
              position: "relative",
              top: "6px",
              right: `${ph}px`,
              scale: "1.2",
              zIndex: "1",
            }}
            src={assets.svg.mark}
            alt="mark"
          />
          <img
            style={{ width: "166px", height: "16px" }}
            src={assets.svg.ecBar}
            alt="bar"
          />
        </div>
      </div>
    </Container>
  );
};

export default StatusBar;
