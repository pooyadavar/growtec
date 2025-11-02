import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

// --- کامپوننت کمکی برای ستون‌های برنامه (عریض‌تر و فشرده‌تر) ---
const PlanColumn = ({ number }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5, // پدینگ داخلی
      display: "flex",
      flexDirection: "column",
      gap: 1.2, // فاصله عمودی بین ردیف‌ها
      minWidth: 220, // --- عرض کارت‌ها بیشتر شد ---
      borderRadius: "8px",
    }}
  >
    <Typography
      fontFamily="IRANSANS"
      fontWeight="bold"
      textAlign="center"
      mb={1}
      fontSize="1rem"
    >
      {number}
    </Typography>

    {/* ردیف‌های داخل ستون */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم A
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />{" "}
      {/* عرض فیلد بیشتر شد */}
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم B
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم C
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم D
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم E
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        حجم F
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        EC مطلوب
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        خطای مجاز
      </Typography>
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
    </Box>
  </Paper>
);

// --- کامپوننت اصلی صفحه ---
const FeedingSettingsPage = () => {
  const [tabValue, setTabValue] = useState(2);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log("Saving settings...");
  };

  return (
    // --- ۱. کاهش مارجین‌های عمودی کانتینر ---
    <Container maxWidth="lg" sx={{ mt: 1, mb: 0 }}>
      {/* --- هدر (سربرگ) --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          direction: "ltr",
          pb: 0, // --- ۳. کاهش پدینگ پایین هدر ---
        }}
      >
        {/* دکمه بستن X (فشرده‌تر) */}
        <IconButton
          onClick={handleBackClick}
          title="بستن"
          size="small" // --- ۶. استفاده از سایز کوچک ---
          sx={{
            color: "#FFF",
            backgroundColor: "red",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#D32F2F" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        {/* تب‌ها (فشرده‌تر) */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            direction: "rtl",
            minHeight: "40px",
            "& .MuiTabs-indicator": {
              display: "none", // حذف خط زیر تب
            },
          }}
        >
          {["EC", "pH", "مخزن و دوزینگ پمپ"].map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                mr: "5px",
                fontFamily: "IRANSANS",
                fontSize: "0.9rem",
                fontWeight: "bold",
                px: 2,
                py: 0.8,
                minHeight: "40px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                border:
                  tabValue === index
                    ? "2px solid #d9a45f" // تب فعال — بردر ضخیم‌تر و پررنگ‌تر
                    : "1px solid #ddd", // تب غیرفعال — بردر نازک
                backgroundColor: tabValue === index ? "#f5f5f5" : "#f5b982",

                color: "#000",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f5d3a8",
                },
                "&.Mui-selected": {
                  backgroundColor: "#f5f5f5",
                  color: "#000",
                  border: "0.5px solid gray",
                },
                textTransform: "none",
                boxShadow:
                  tabValue === index ? "0px 2px 4px rgba(0,0,0,0.1)" : "none",
              }}
            />
          ))}
        </Tabs>

        {/* دکمه ذخیره (فشرده‌تر) */}
        <Button
          variant="contained"
          size="small" // --- ۴. استفاده از سایز کوچک ---
          startIcon={<SaveIcon />}
          sx={{
            fontFamily: "IRANSANS",
            backgroundColor: "#F7C98C",
            color: "#333",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#f5b982" },
          }}
          onClick={handleSave}
        >
          ذخیره
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          // width: "100%",
          height: "auto", // ارتفاع اتوماتیک
          maxHeight: "calc(100vh - 32px)", // ارتفاع حداکثر به اندازه صفحه (با کمی فاصله)
           // --- ۲. کاهش پدینگ کلی ---
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden", // اسکرول اصلی در داخل محتوا خواهد بود
        }}
      >
        {/* --- محتوای صفحه --- */}
        {tabValue === 2 && (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto", // --- ۷. اسکرول عمودی فقط برای این بخش ---
              p: { xs: 1, md: 2 }, // --- ۸. کاهش پدینگ محتوا ---
              direction: "rtl",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {" "}
              {/* --- ۱۰. کاهش مارجین پایین --- */}
              {/* فیلدها */}
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن A
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن B
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن C
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن D
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن E
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  غلظت مخزن F
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  EC فعلی
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Typography
                  variant="body2"
                  fontFamily="IRANSANS"
                  sx={{ mb: 0.5, fontSize: "0.85rem" }}
                >
                  ضریب تصحیح EC
                </Typography>
                <TextField fullWidth size="small" variant="outlined" />
              </Grid>
            </Grid>

            {/* بخش پایین: ستون‌های برنامه‌ها */}
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                gap: 2, // --- ۱۱. کاهش فاصله بین کارت‌ها ---
                p: 1.5, // --- ۱۲. کاهش پدینگ ---
                pb: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              {/* --- ۱۳. فقط ۴ کارت رندر می‌شود --- */}
              <PlanColumn number="۱" />
              <PlanColumn number="۲" />
              <PlanColumn number="۳" />
              <PlanColumn number="۴" />
            </Box>
          </Box>
        )}

        {/* محتوای تب‌های دیگر */}
        {tabValue === 0 && (
          <Box sx={{ p: 2, direction: "rtl", overflowY: "auto" }}>
            <Typography fontFamily="IRANSANS">
              محتوای تنظیمات EC در اینجا قرار می‌گیرد.
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ p: 2, direction: "rtl", overflowY: "auto" }}>
            <Typography fontFamily="IRANSANS">
              محتوای تنظیمات pH در اینجا قرار می‌گیرد.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedingSettingsPage;
