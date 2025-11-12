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
const PlanColumnEc = ({ number }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5, // پدینگ داخلی
      display: "flex",
      flexDirection: "column",
      gap: 1.2, // فاصله عمودی بین ردیف‌ها
      minWidth: 185, // --- عرض کارت‌ها بیشتر شد ---
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

const PlanColumnPh = ({ number }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5, // پدینگ داخلی
      display: "flex",
      flexDirection: "column",
      gap: 1.2, // فاصله عمودی بین ردیف‌ها
      minWidth: 185, // --- عرض کارت‌ها بیشتر شد ---
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
        حجم
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
        ph مطلوب
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
        خطای مطلوب
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
          direction: "ltr",
          pb: 0, // --- ۳. کاهش پدینگ پایین هدر ---
        }}
      >
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
          {["مخزن و دوزینگ پمپ", "pH", "EC"].map((label, index) => (
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
                    ? "2px solid #d9a45f" 
                    : "1px solid #ddd", 
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
        {/* دکمه بستن X (فشرده‌تر) */}
        <IconButton
          onClick={handleBackClick}
          title="بستن"
          size="small"
          sx={{
            color: "#FFF",
            backgroundColor: "red",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#D32F2F" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Paper
        elevation={3}
        sx={{
          height: "auto", 
          maxHeight: "calc(100vh - 32px)", 
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden", 
        }}
      >
        {/* --- محتوای صفحه --- */}
        {tabValue === 2 && (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto", 
              p: { xs: 1, md: 2 },
              direction: "rtl",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
              {/* بخش سمت راست: دکمه ذخیره */}
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                {" "}
                {/* [تغییر] - دکمه به راست منتقل شد */}
                <Button
                  variant="contained"
                  // size="small" // [حذف شد] - سایز بزرگتر شبیه عکس
                  startIcon={<SaveIcon />}
                  sx={{
                    fontFamily: "IRANSANS",
                    backgroundColor: "#F7C98C",
                    color: "#333",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#f5b982" },
                    width: "120px",
                    height: "60px",
                    fontSize: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    padding: "10px",
                  }}
                  onClick={handleSave}
                >
                  ذخیره
                </Button>
              </Grid>
              {/* بخش سمت چپ: فیلدهای متنی (۲ ردیف ۴ تایی) */}
              <Grid item xs={12} md={9}>
                <Box>
                  {/* ردیف اول فیلدها */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن A
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن B
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن C
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن D
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                  </Grid>

                  {/* ردیف دوم فیلدها */}
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن E
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        غلظت مخزن F
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        EC فعلی
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="body2"
                        fontFamily="IRANSANS"
                        sx={{
                          mb: 0.5,
                          fontSize: "0.85rem",
                          textAlign: "right",
                        }}
                      >
                        ضریب تصحیح EC
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                  </Grid>
                </Box>
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
              <PlanColumnEc number="۱" />
              <PlanColumnEc number="۲" />
              <PlanColumnEc number="۳" />
              <PlanColumnEc number="۴" />
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
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto", // --- ۷. اسکرول عمودی فقط برای این بخش ---
              p: { xs: 1, md: 2 }, // --- ۸. کاهش پدینگ محتوا ---
              direction: "rtl",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" , justifyContent:"space-between"}}> 
              {/* بخش سمت راست: دکمه ذخیره */}
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    fontFamily: "IRANSANS",
                    backgroundColor: "#F7C98C", // رنگ زرد/نارنجی
                    color: "#333",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#f5b982" },
                    // استایل شبیه به دکمه‌ی قبلی
                    width: "120px",
                    height: "60px",
                    fontSize: "1rem",
                    display: "flex",
                    flexDirection: "row", // آیکون بالای متن
                    gap: "10px",
                    padding: "10px",
                  }}
                  // onClick={handleSavePh} // تابع ذخیره مربوط به این بخش
                >
                  ذخیره
                </Button>
              </Grid>
              {/* بخش سمت چپ: فیلدهای متنی */}
              <Grid item xs={12} md={9}>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }} 
                    >
                      ph فعلی
                    </Typography>
                    <TextField fullWidth size="small" variant="outlined" />
                  </Grid>
                </Grid>
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
              <PlanColumnPh number="۱" />
              <PlanColumnPh number="۲" />
              <PlanColumnPh number="۳" />
              <PlanColumnPh number="۴" />
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedingSettingsPage;
