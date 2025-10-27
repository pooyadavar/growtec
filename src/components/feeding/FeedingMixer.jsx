import { Container, Typography, Box } from "@mui/material";
import { useState } from "react";
import assets from "../../assets";


const FeedingMixer = () => {
  const [storage, setStorage] = useState(20);
  const innerStorage = (s) => {
    setStorage(s);
  };
  let liter = 100;
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  const image = `url(${assets.img.mixerBGImage})`;
  let bgLiter = 221 - 2.21 * liter;
  return (
    <Container
      sx={{
        width: "378px",
        height: "310px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        bgcolor: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={assets.svg.mixer} alt="" style={{ marginBottom: "1rem" }} />
      <div
        style={{
          width: "160px",
          height: "221px",
          backgroundColor: "#E8E8E8",
          border: "solid 0.5px #9F9F9F",
          borderRadius: "10px",
          position: "fixed",
          top: "169px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: image,
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: `${bgLiter}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "85%",
            justifyContent: "space-around",
            position: "relative",
            right: "-68px",
            top: "-10px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "0.5px solid #9F9F9F",
              backgroundColor: liter >= 90 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "0.5px solid #9F9F9F",
              backgroundColor: liter >= 60 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "0.5px solid #9F9F9F",
              backgroundColor: liter >= 30 ? "#00FF85" : "white",
            }}
          ></div>
        </div>
        <img
          src={assets.svg.mixerTick}
          alt=""
          style={{ position: "relative", top: "85px", right: "-8px" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Box
          sx={{
            width: "50px",
            height: "20px",
            border: "solid 0.5px #9F9F9F",
            borderRadius: "5px",
          }}
        >
          <Typography
            color="initial"
            sx={{ textAlign: "center", fontSize: "12px" }}
            fontFamily={"IRANSANS"}
          >
            {convert(storage)}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "16px", marginLeft: "0.5rem" }}>
          L
        </Typography>
      </div>
    </Container>
  );
};

export default FeedingMixer;
