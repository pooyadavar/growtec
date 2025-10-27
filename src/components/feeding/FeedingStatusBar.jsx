import { Container, Typography } from "@mui/material";
import assets from "../../assets";
import { useState } from "react";

const FeedingStatusBar = () => {
  const [ec, setEc] = useState(0.0);
  let ph = 5;
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
        width: "254px",
        height: "200px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        // className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "220px",
          height: "32px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"} fontSize={13}>
          {" "}
          EC : {convert(ec)}
        </Typography>
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
            style={{ width: "166px", height: "16px", scale: "0.9" }}
            src={assets.svg.phBar}
            alt="bar"
          />
        </div>
      </div>
      <div
        // className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "230px",
          height: "32px",
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
        <Typography fontFamily={"IRANSANS"} fontSize={13}>
          {" "}
          pH : {convert(ph)}
        </Typography>
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
            style={{ width: "166px", height: "16px", scale: "0.9" }}
            src={assets.svg.ecBar}
            alt="bar"
          />
        </div>
      </div>
    </Container>
  );
};
export default FeedingStatusBar;
