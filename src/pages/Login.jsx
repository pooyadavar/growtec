import { Container, Typography, Button, Box, TextField } from "@mui/material";
import React from "react";
import assets from "../assets";

const Login = () => {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "934px",
          height: "619px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ alignContent: "center" }}>
          <img src={assets.svg.loginLogo} alt="" />
        </Box>
        <Box
          sx={{
            width: "480px",
            height: "619px",
            borderRadius: "10px",
            backgroundColor: "#379E79",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            paddingY: "30px",
          }}
          className="login-fields"
        >
          <Box
            sx={{
              width: "435px",
              height: "223px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={assets.svg.lock}
              alt=""
              style={{ width: "148px", height: "148px" }}
            />
            <Typography
              color="#FFFFFF"
              fontSize={60}
              fontFamily={"IRANSANS"}
              textAlign={"center"}
            >
              لطفا وارد شوید
            </Typography>
          </Box>
          <Box
            sx={{
              width: "407px",
              height: "147px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="نام کاربری ..."
              style={{
                color: "rgb(17, 87, 62)",
                fontSize: "16px",
                width: "407px",
                height: "65px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
                textDecoration: "none",
                overflow: "hidden",
                textAlign: "center",
              }}
            />
            <input
              type="password"
              placeholder="رمز عبور ..."
              style={{
                color: "rgb(17, 87, 62)",
                fontSize: "16px",
                width: "407px",
                height: "65px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
                textDecoration: "none",
                overflow: "hidden",
                textAlign: "center",
              }}
            />
          </Box>
          <Button
            color="#FFFFFF"
            sx={{
              backgroundColor: "#6CCDB0",
              width: "246px",
              height: "56px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-around",
              paddingX: "40px",
            }}
          >
            <img src={assets.svg.lock2} alt="" />
            <Typography fontFamily={"IRANSANS"} fontSize={25} color="#000000">
              ورود
            </Typography>
          </Button>
          <Box>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={15}
              color="#FFFFFF"
              textAlign={"center"}
            >
              فراموشی رمز عبور
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={15}
              color="#FFFFFF"
              textAlign={"center"}
            >
              ثبت نام
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
