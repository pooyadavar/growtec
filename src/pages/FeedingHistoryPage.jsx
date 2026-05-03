import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

// --- کامپوننت کمکی برای ستون‌های برنامه (عریض‌تر و فشرده‌تر) ---
const PlanColumn = ({ number, values = [] }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.5, // پدینگ داخلی
      display: "flex",
      flexDirection: "column",
      gap: 1.2, // فاصله عمودی بین ردیف‌ها
      minWidth: 152, // --- عرض کارت‌ها بیشتر شد ---
      borderRadius: "8px",
      pl: 5,
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
    {[...Array(10)].map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px" }}
          value={values[index] || ""}
          InputProps={{
            readOnly: true,
          }}
        />
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
          {index + 1}
        </Typography>
      </Box>
    ))}
  </Paper>
);

// --- کامپوننت اصلی صفحه ---
const FeedingHistoryPage = ({ onClose, isModal = false }) => {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.post(
          "/log/soluble/foodstuff-preparation-program-schedule/",
          { limit: 10 }
        );
        const data = Array.isArray(response) ? response : response.results || [];
        // Take the last 10 items if more are returned, or just the data if less.
        // Assuming the API returns them in chronological order, we might want the *latest* 10.
        // Usually "limit: 10" on a log endpoint returns the *latest* 10.
        // Let's assume the API returns the latest ones directly or we just take the first 10 of the response.
        // If we need to map 1-10 as "most recent first" or "oldest first", it depends on user intent.
        // Usually a history list is "latest at top" (1) or "oldest at top".
        // Given the UI has 1..10, let's map index 0 to 1.
        setHistoryData(data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBackClick = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate(-1);
  };

  return (
    <Container
      maxWidth={isModal ? false : "lg"}
      sx={{
        mt: 1,
        mb: 0,
        px: isModal ? "0 !important" : undefined,
      }}
    >
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
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: { xs: 1, md: 2 },
            direction: "rtl",
          }}
        >
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
            <PlanColumn
              number="دفعات تزریق استوک"
              values={historyData.map((item) => item.log_data?.reported_stock_injection_count)}
            />
            <PlanColumn
              number="حجن ساخت محلول"
              values={historyData.map((item) => item.log_data?.reported_volume)}
            />
            <PlanColumn
              number="ایندکس ph"
              values={historyData.map((item) => item.log_data?.reported_ph)}
            />
            <PlanColumn
              number="ایندکس ec"
              values={historyData.map((item) => item.log_data?.reported_ec)}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedingHistoryPage;
