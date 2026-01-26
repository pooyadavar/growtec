import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

// آیکون‌های مورد نیاز
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import CalculateIcon from "@mui/icons-material/CalculateOutlined";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";

// ایمپورت کامپوننت اختصاصی خودت (مسیر رو چک کن)
import IconTextButton from "../../card/IconTextButton";

// ثابت‌های طراحی برای حفظ یکپارچگی
const COLORS = {
  amber: "#FFCB82",
  green: "#86CCB2",
  red: "#F44336",
  bgGrey: "#F0F0F0",
  white: "#FFFFFF",
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    backgroundColor: COLORS.white,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    "& fieldset": { border: "none" },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 10px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

const selectStyles = {
  borderRadius: "20px",
  backgroundColor: COLORS.white,
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": {
    padding: "8px 10px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

const CustomLabel = ({ children }) => (
  <Box
    sx={{
      backgroundColor: COLORS.amber,
      borderRadius: "15px 15px 0 0",
      padding: "4px 20px",
      width: "fit-content",
      margin: "0 auto 0px auto",
      position: "relative",
      zIndex: 2,
      minWidth: "130px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "0.95rem",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </Box>
);

export default function IrrigationCalculatorPage({ onClose }) {
  const [rows] = useState(
    Array(8).fill({ zone: 1, start: "00:00:00", end: "00:00:00" })
  );

  return (
    <Box
      sx={{
        pt: 2, 
        px: 2,
        pb: 4, // Added more padding to the bottom
        bgcolor: COLORS.bgGrey,
        height: "100%",
        overflowY: "auto",
        direction: "rtl",
      }}
    >
      {/* هدر دکمه ضربدر */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <IconButton onClick={onClose} sx={{ color: "#000" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2} sx={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* === بخش تنظیمات (سمت راست در RTL) === */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Box>
            <CustomLabel>نام برنامه</CustomLabel>
            <TextField fullWidth sx={inputStyles} />
          </Box>
          <Box>
            <CustomLabel>اولین آبیاری</CustomLabel>
            <TextField fullWidth sx={inputStyles} defaultValue="00:00:00" />
          </Box>

          <Box>
            <CustomLabel>تعداد آبیاری</CustomLabel>
            <Select fullWidth defaultValue={1} sx={selectStyles}>
              <MenuItem value={1}>۱</MenuItem>
              <MenuItem value={2}>۲</MenuItem>
            </Select>
          </Box>

          <Box>
            <CustomLabel>فاصله بین دو آبیاری</CustomLabel>
            <TextField fullWidth sx={inputStyles} defaultValue="00:00:00" />
          </Box>
          <Box>
            <CustomLabel>مدت زمان آبیاری</CustomLabel>
            <TextField fullWidth sx={inputStyles} defaultValue="00:00:00" />
          </Box>
          <Box>
            <CustomLabel>فاصله بین دو زون</CustomLabel>
            <TextField fullWidth sx={inputStyles} defaultValue="00:00:00" />
          </Box>

          <IconTextButton
            text="ساخت برنامه"
            icon={<SwapCallsIcon sx={{ transform: "rotate(90deg)" }} />}
            bgColor={COLORS.green}
            textColor="#000"
            width="98%" 
            sx={{
              mt: 1,
              borderRadius: "15px",
              py: 1, 
              "&:hover": { filter: "brightness(0.95)" },
              "& .MuiTypography-root": { fontSize: "1rem", fontWeight: "bold" },
              "& .MuiPaper-root": { padding: "8px 10px" },
            }}
          />

          <Box sx={{ display: "flex", gap: 3, mt: "auto" }}>
            <IconTextButton
              text="بستن"
              icon={<CloseIcon />}
              bgColor={COLORS.red}
              textColor="#fff"
              onClick={onClose}
              sx={{
                flex: 1,
                borderRadius: "15px",
                py: 0.5,
                "& .MuiTypography-root": { fontSize: "0.9rem" },
                "& .MuiPaper-root": { padding: "6px 8px" },
              }}
            />

            <IconTextButton
              text="ذخیره"
              icon={<SaveIcon />}
              bgColor={COLORS.amber}
              textColor="#000"
              sx={{
                flex: 1,
                borderRadius: "15px",
                py: 0.5,
                "& .MuiTypography-root": { fontSize: "0.9rem" },
                "& .MuiPaper-root": { padding: "6px 8px" },
              }}
            />
          </Box>
        </Grid>
        {/* === اسکرول‌بار میانی === */}{" "}
        {/* <Grid
          item
          sx={{
            width: "30px",
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "12px",
              bgcolor: "#D9D9D9",
              borderRadius: "10px",
              height: "100%",
              position: "relative",
              boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100px",
                bgcolor: "#AFAFAF",
                borderRadius: "10px",
                position: "absolute",
                top: "40px",
              }}
            />
          </Box>
        </Grid> */}
        {/* === بخش ماشین حساب و جدول (سمت چپ در RTL) === */}
        <Grid item xs={12} md={7.5}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* هدر طلایی */}
            <Box
              sx={{
                bgcolor: COLORS.amber,
                borderRadius: "20px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <CalculateIcon sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ماشین حساب آبیاری
              </Typography>
            </Box>

            {/* تیتر ستون‌ها */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                mb: 1,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{ width: "10%", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                حذف
              </Typography>
              <Typography
                sx={{ width: "25%", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                پایان آبیاری
              </Typography>
              <Typography
                sx={{ width: "25%", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                شروع آبیاری
              </Typography>
              <Typography
                sx={{ width: "15%", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                زون
              </Typography>
              <Typography
                sx={{ width: "20%", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                ترتیب
              </Typography>
            </Box>

            {/* لیست سطرها با قابلیت اسکرول */}
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {rows.map((row, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
                >
                  <Box
                    sx={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {idx === 0 ? (
                      <Box
                        sx={{
                          p: 0.5,
                          border: `2px solid ${COLORS.red}`,
                          borderRadius: "8px",
                          color: COLORS.red,
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          border: "1px solid #CCC",
                          borderRadius: "8px",
                          bgcolor: "#FFF",
                        }}
                      />
                    )}
                  </Box>
                  <TextField
                    sx={{ ...inputStyles, width: "25%" }}
                    defaultValue={row.end}
                  />
                  <TextField
                    sx={{ ...inputStyles, width: "25%" }}
                    defaultValue={row.start}
                  />
                  <TextField
                    sx={{ ...inputStyles, width: "15%" }}
                    defaultValue={row.zone}
                  />
                  <Select
                    sx={{ ...selectStyles, width: "20%" }}
                    defaultValue=""
                  ></Select>
                </Box>
              ))}
            </Box>

            <Box sx={{display:"flex" , justifyContent:"center"}}>
              {/* دکمه حذف کل */}
              <IconTextButton
                text="حذف کل جدول"
                icon={<CloseIcon />}
                bgColor="#FFF"
                textColor={COLORS.red}
                width="250px"
                sx={{
                  mt: 2,
                  borderRadius: "15px",
                  py: 1, 
                  "& .MuiTypography-root": { fontSize: "1rem" },
                  "& .MuiPaper-root": { padding: "8px 10px" },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
