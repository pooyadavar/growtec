import { Container, Box, Typography, Button } from "@mui/material";
import assets from "../../assets";
const DailyChart = () => {
  return (
    <Container
      sx={{
        width: "976px",
        height: "370px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "80%",
        }}
      >
        <Typography fontFamily={"IRANSANS"}>نمودارهای روزانه</Typography>
        <Box
          sx={{
            textAlign: "center",
            width: "120px",
            height: "32px",
            bgcolor: "#FFCB82",
            borderRadius: "5px",
            border: "0.5px solid #9F9F9F",
          }}
        >
          <Typography></Typography>
        </Box>
      </div>
      <div
        style={{
          width: "100%",
          height: "274px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          sx={{
            color: "#8A8A8A",
            width: "20px",
            height: "30px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
          }}
        >
          <img src={assets.svg.right} alt="" />
        </Button>
        <div
          style={{
            width: "860px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              width: "860px",
              height: "82px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>EC</Typography>
          </div>
          <div
            style={{
              width: "860px",
              height: "82px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>pH</Typography>
          </div>
          <div
            style={{
              width: "860px",
              height: "82px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>Temp</Typography>
          </div>
        </div>
        <Button
          sx={{
            color: "#8A8A8A",
            width: "20px",
            height: "30px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
          }}
        >
          <img src={assets.svg.left} alt="" />
        </Button>
      </div>
    </Container>
  );
};

export default DailyChart;
