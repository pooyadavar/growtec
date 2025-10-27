import React from "react";
import { Typography, Container } from "@mui/material";
import assets from "../../assets";


const ErrorComponent = () => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  // Errors List
  const errors = [];
  errors.push("Hello", "World");

  // Errors time List
  const errorsTime = [];
  errorsTime.push("21:42", "20:35");

  return (
    <Container
      sx={{
        width: "200px",
        height: "320px",
        backgroundColor: "#ffff",
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
      }}
    >
      <div
        className="errorMessage"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "24px",
            backgroundColor: "#FFCB82",
            border: "0.5px solid #9F9F9F",
            borderRadius: "5px",
            margin: "1rem 0 1rem 0",
          }}
        >
          <Typography
            sx={{
              fontFamily: "IRANSANS",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            کد خطا
          </Typography>
        </div>
        {/* map to errors list and show them */}
        {errors.map((error) => (
          <Typography
            fontFamily="IRANSANS"
            sx={{ marginTop: "8px", fontSize: "14px" }}
          >
            {error}
          </Typography>
        ))}
      </div>
      <img src={assets.svg.line} alt="" />
      <div
        className="errorTime"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "24px",
            backgroundColor: "#FFCB82",
            border: "0.5px solid #9F9F9F",
            borderRadius: "5px",
            margin: "1rem 0 1rem 0",
          }}
        >
          <Typography
            sx={{
              fontFamily: "IRANSANS",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            زمان
          </Typography>
        </div>
        {/* map to errors time list and show them */}
        {errorsTime.map((time) => (
          <Typography
            fontFamily="IRANSANS"
            sx={{ marginTop: "8px", fontSize: "14px" }}
          >
            {time}
          </Typography>
        ))}
      </div>
    </Container>
  );
};

export default ErrorComponent;
