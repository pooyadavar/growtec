import React from "react";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import assets from "../../assets";
import { makeStyles } from "@mui/styles";
import { toPersianDigits } from "../../utils/persianDigits";


const StatusBar = ({
  ecValue = 0,
  phValue = 0,
  ecRange,
  phRange,
}) => {
  const useStyle = makeStyles(() => ({
    barContainer: {},
  }));

  const classes = useStyle();

  /**
   * @param {object} range 
   */
  const getStatusImage = (range) => {
    if (!range) {
      return assets.svg.goodStatusDashboard;
    }

    const { higher_than_low, higher_than_high } = range;

    if (higher_than_high) {
      return assets.svg.highStatusDashboard;
    }
    
    if (!higher_than_low) {
      return assets.svg.lowStatusDashboard;
    }

    return assets.svg.goodStatusDashboard;
  };

  const phStatusImage = getStatusImage(phRange);
  const ecStatusImage = getStatusImage(ecRange);

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
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* --- بخش EC --- */}
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
          alignItems: "center", 
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> EC : {toPersianDigits(ecValue)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <img
            style={{ width: "166px", height: "16px" }}
            src={ecStatusImage} 
            alt="ec status bar"
          />
        </div>
      </div>

      {/* --- بخش pH --- */}
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
          alignItems: "center",
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> pH : {toPersianDigits(phValue)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <img
            style={{ width: "166px", height: "16px" }}
            src={phStatusImage} 
            alt="ph status bar"
          />
        </div>
      </div>
    </Container>
  );
};

export default StatusBar;