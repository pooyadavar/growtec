import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Container,
  CircularProgress, // Added for loading state
  Alert, // Added for error state
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFoodstuffHistory } from "../api/solubleApi";
import { toPersianDigits } from "../utils/persianDigits";

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
      {toPersianDigits(number)}
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
          value={toPersianDigits(values[index] || "")}
          InputProps={{
            readOnly: true,
          }}
        />
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>
          {toPersianDigits(index + 1)}
        </Typography>
      </Box>
    ))}
  </Paper>
);


const FeedingHistoryPage = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();

  const {
    data: historyData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["foodstuffHistory"],
    queryFn: () => getFoodstuffHistory(10), // Fetching with limit 10
    refetchInterval: 15000, // Refetch every 15 seconds to keep history relatively up-to-date
    select: (response) => {
      const data = Array.isArray(response) ? response : response.results || [];
      return data.slice(0, 10); // Ensure only 10 items are taken
    },
  });

  const handleBackClick = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate(-1);
  };

  if (isLoading && !historyData.length) {
    return (
      <Container
        sx={{
          mt: 1,
          mb: 0,
          px: isModal ? "0 !important" : undefined,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (isError && !historyData.length) {
    return (
      <Container
        sx={{
          mt: 1,
          mb: 0,
          px: isModal ? "0 !important" : undefined,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <Alert severity="error">خطا در بارگیری تاریخچه: {error?.message || "خطای ناشناخته"}</Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={isModal ? false : "lg"}
      sx={{
        mt: 1,
        mb: 0,
        px: isModal ? "0 !important" : undefined,
      }}
    >
      {!isModal && (
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
      )}

      <Paper
        elevation={3}
        sx={{
          height: "auto",
          maxHeight: "calc(100vh - 32px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "40px",
        }}
      >
        {/* --- محتوای صفحه --- */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: { xs: 1, md: 1 },
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
              number="حجم ساخت محلول"
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
