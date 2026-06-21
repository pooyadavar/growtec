import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import assets from "../assets";
import { useAuth } from "../context/AuthContext";
import {
  showLoginErrorToast,
  showLoginSuccessToast,
} from "../utils/authToast";

const inputSx = {
  direction: "rtl",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: "56px",
    borderRadius: "12px",
    backgroundColor: "#F9FBF9",
    fontFamily: "IRANSANS",
    fontSize: "15px",
    color: "#11573E",
    transition: "all 0.2s ease-in-out",
    "& input": {
      textAlign: "right",
      paddingX: "16px",
    },
    "& fieldset": {
      border: "1px solid #E0E0E0",
    },
    "&:hover fieldset": {
      borderColor: "#379E79",
    },
    "&.Mui-focused fieldset": {
      borderWidth: "2px",
      borderColor: "#379E79",
    },
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      showLoginErrorToast("نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      showLoginSuccessToast();
      navigate("/Home", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        "نام کاربری یا رمز عبور اشتباه است.";
      showLoginErrorToast(message);
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
        alignItems: "center",
        minHeight: "calc(100vh - 15rem)",
        position: "relative",
        zIndex: 2,
        paddingY: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row-reverse" }, // واکنش‌گرا و راست‌به‌چپ منطقی
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.04)",
            padding: { xs: 2, md: 4 },
            maxWidth: "960px",
            margin: "0 auto",
            direction: "ltr",
          }}
        >
          {/* بخش تصویر برند کامپوننت */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <img
              src={assets.svg.loginLogo}
              alt="Logo"
              style={{
                width: "100%",
                maxHeight: "380px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* فرم ورود */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "20px",
              backgroundColor: "#379E79",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { xs: "32px 24px", sm: "40px" },
              boxShadow: "0px 12px 32px rgba(55, 158, 121, 0.25)",
            }}
          >
            {/* هدر فرم */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                marginBottom: 4,
              }}
            >
              <img
                src={assets.svg.lock}
                alt="Lock"
                style={{ width: "80px", height: "80px", marginBottom: "8px" }} // سایز قفل منطقی‌تر شد
              />
              <Typography
                color="#FFFFFF"
                fontSize={24} 
                fontWeight={700}
                fontFamily="IRANSANS"
                textAlign="center"
              >
                خوش آمدید
              </Typography>
              <Typography
                color="rgba(255, 255, 255, 0.8)"
                fontSize={14}
                fontFamily="IRANSANS"
                textAlign="center"
              >
                لطفا وارد حساب کاربری خود شوید
              </Typography>
            </Box>

            {/* فیلدهای ورودی */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginBottom: 4,
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="رمز عبور ..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#379E79" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* دکمه ارسال */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#379E79", // تضاد رنگی عالی برای خوانایی متن دکمه
                width: "100%",
                height: "52px",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#EAF6F1",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                },
              }}
            >

              <Typography fontFamily="IRANSANS" fontSize={16} fontWeight={600}>
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "ورود به سیستم"
                )}
              </Typography>
              {!isSubmitting && (
                <img src={assets.svg.lock2} alt="" style={{ width: "18px" }} />
              )}
            </Button>

            {/* لینک‌های کمکی پایین فرم */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: 3,
                paddingX: 1,
              }}
            >
              <Typography
                fontFamily="IRANSANS"
                fontSize={13}
                color="rgba(255, 255, 255, 0.9)"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {/* فراموشی رمز عبور */}
              </Typography>
              <Typography
                fontFamily="IRANSANS"
                fontSize={13}
                color="rgba(255, 255, 255, 0.9)"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {/* ثبت نام در سامانه */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
