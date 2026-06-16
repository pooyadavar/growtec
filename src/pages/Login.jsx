import { Container, Typography, Button, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import assets from "../assets";
import { useAuth } from "../context/AuthContext";

const inputSx = {
  width: "407px",
  "& .MuiOutlinedInput-root": {
    height: "65px",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    fontFamily: "IRANSANS",
    fontSize: "16px",
    color: "rgb(17, 87, 62)",
    "& input": {
      textAlign: "center",
      padding: 0,
    },
    "& fieldset": {
      border: "0.5px solid #9F9F9F",
    },
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      toast.success("ورود با موفقیت انجام شد.");
      navigate("/Home", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        "نام کاربری یا رمز عبور اشتباه است.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100vh - 8rem)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Container
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "934px",
            minHeight: "600px",
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
              minHeight: "500px",
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <img
                src={assets.svg.lock}
                alt=""
                style={{ width: "148px", height: "148px" }}
              />
              <Typography
                color="#FFFFFF"
                fontSize={50}
                fontFamily={"IRANSANS"}
                textAlign={"center"}
              >
                لطفا وارد شوید
              </Typography>
            </Box>
            <Box
              sx={{
                width: "407px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                name="username"
                autoComplete="username"
                placeholder="نام کاربری ..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                sx={inputSx}
              />
              <TextField
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="رمز عبور ..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                sx={inputSx}
              />
            </Box>
            <Button
              type="submit"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#6CCDB0",
                width: "246px",
                height: "56px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                paddingX: "40px",
                "&:hover": {
                  backgroundColor: "#5bb89d",
                },
              }}
            >
              <img src={assets.svg.lock2} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={25} color="#000000">
                {isSubmitting ? "در حال ورود..." : "ورود"}
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
    </Box>
  );
};

export default Login;
