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
      minWidth: 152, // --- عرض کارت‌ها بیشتر شد ---
      borderRadius: "8px",
      pl:5
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
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />{" "}
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۱
      </Typography>
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
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />

      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۲
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۳
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۴
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۵
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۶
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۷
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۸
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۹
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <TextField size="small" variant="outlined" sx={{ width: "100px" }} />
      <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
        ۱۰
      </Typography>
    </Box>
  </Paper>
);

// --- کامپوننت اصلی صفحه ---
const FeedingHistoryPage = () => {
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
    <Container maxWidth="lg" sx={{ mt: 1, mb: 0 }}>
      {/* --- هدر (سربرگ) --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          borderColor: "divider",
          direction: "ltr",
          pb: 0, 
          mb: 2,
        }}
      >
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
            {/* بخش پایین: ستون‌های برنامه‌ها */}
            <Box
              sx={{
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                gap: "20px", 
                p: 1.5, 
                pb: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              {/* --- ۱۳. فقط ۴ کارت رندر می‌شود --- */}
              <PlanColumn number="دفعات تزریق استوک" />
              <PlanColumn number="حجن ساخت محلول" />
              <PlanColumn number="ایندکس ph" />
              <PlanColumn number="ایندکس ec" />
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedingHistoryPage;
