import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import InfoIcon from "@mui/icons-material/InfoOutlined";
// مسیرهای ایمپورت را طبق پروژه خودتان چک کنید
import assets from "../../assets";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";
import BuildDetailsModal from "../dashboard/BuildDetailsModal";
import IconTextButton from "../../card/IconTextButton";
import StatusModal from "../dashboard/StatusModal";

// استایل دکمه‌های تاگل
const CustomToggleButton = styled(Button)(({ theme, selected }) => ({
  minWidth: "unset",
  padding: "4px 6px",
  borderRadius: "8px",
  backgroundColor: selected ? "#FFEBCC" : "transparent",
  color: selected ? "#E65100" : theme.palette.text.secondary,
  border: selected ? "1px solid #FFCC80" : "1px solid #e0e0e0",
  fontSize: "0.8rem",
  fontWeight: "bold",
  fontFamily: "IRANSANS",
  "&:hover": {
    backgroundColor: selected ? "#FFEBCC" : "#f5f5f5",
  },
}));

const PhEcControlCardMixer = ({
  contents,
  statusText,
  ecTargetValue,
  onEcTargetChange,
  reportData,
  ecValue,
  phValue,
  ecRange,
  phRange,
}) => {
  const [selectedStockType, setSelectedStockType] = React.useState("total");

  // ✅ اصلاح شده: بررسی آرایه بودن داده‌ها برای جلوگیری از خطای .map
  const column1Data =
    Array.isArray(reportData) && Array.isArray(reportData[0])
      ? reportData[0]
      : [];
  const column2Data =
    Array.isArray(reportData) && Array.isArray(reportData[1])
      ? reportData[1]
      : [];

  const [openBuildDetailsModal, setOpenBuildDetailsModal] =
    React.useState(false);
  const handleOpenBuildDetailsModal = () => setOpenBuildDetailsModal(true);
  const handleCloseBuildDetailsModal = () => setOpenBuildDetailsModal(false);

  // محاسبه درصد پُر بودن مخزن
  let fillPercentage = 0;
  if (contents?.max_volume > 0) {
    fillPercentage = (contents.filled_volume / contents.max_volume) * 100;
  }
  fillPercentage = Math.max(0, Math.min(100, fillPercentage));

  const statusDetailsData = [
    { parameter: "پمپ A", status: "روشن" },
    { parameter: "پمپ B", status: "خاموش" },
    { parameter: "شیر C", status: "باز" },
    { parameter: "سنسور pH", status: "فعال" },
    { parameter: "سنسور EC", status: "خطا" },
  ];

  // داده‌های نمونه برای مودال جزئیات
  const buildDetailsData = [
    { time: "10:30", type: "pH", volume: "50L", tank: "A", status: "success" },
    { time: "11:00", type: "EC", volume: "20L", tank: "B", status: "failed" },
    { time: "11:15", type: "pH", volume: "30L", tank: "A", status: "success" },
    { time: "12:00", type: "EC", volume: "40L", tank: "C", status: "success" },
    { time: "12:30", type: "pH", volume: "10L", tank: "B", status: "success" },
    { time: "13:00", type: "EC", volume: "25L", tank: "A", status: "failed" },
    { time: "13:45", type: "pH", volume: "60L", tank: "C", status: "success" },
    { time: "14:00", type: "EC", volume: "15L", tank: "B", status: "success" },
  ];

  const getVerticalStatusImage = (range) => {
    if (!range) {
      return assets.svg.vertical_barstatus_khonsa;
    }
    const { higher_than_low, higher_than_high } = range;

    if (higher_than_high) {
      return assets.svg.vertical_barstatus_baz;
    }
    if (!higher_than_low) {
      return assets.svg.vertical_barstatus_acid;
    }
    return assets.svg.vertical_barstatus_khonsa;
  };

  const [openStatusModal, setOpenStatusModal] = React.useState(false);

  const handleOpenStatusModal = () => {
    setOpenStatusModal(true);
  };
  const handleCloseStatusModal = () => setOpenStatusModal(false);

  const phStatusBarImage = getVerticalStatusImage(phRange);
  const ecStatusBarImage = getVerticalStatusImage(ecRange);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        width: "560px",
        height: "320px",
        backgroundColor: "#ffff",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 3,
        }}
      >
        {/* بخش نمایشگرهای گیج (Gauge) */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            height: "100%",
            borderRadius: "15px",
            width: "150px",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", height: "100%" }} gap={1}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                border: "0.5px solid gray",
                px: 0.5,
                borderRadius: "15px",
                py: 1,
              }}
            >
              <img
                src={phStatusBarImage}
                alt="vertical_barstatus_ph"
                style={{ height: "100%" }}
              />
              <Typography fontFamily={"IRANSANS"} fontSize={13}>
                pH :{" "}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={toPersianDigits(phValue ?? "")}
                InputProps={{ readOnly: true }}
                sx={{
                  width: 50,
                  backgroundColor: "#f0f0f0",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& input": {
                    fontFamily: "IRANSANS", // اضافه شد
                    textAlign: "center",
                    padding: "8px",
                    height: "unset",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                border: "0.5px solid gray",
                px: 0.5,
                borderRadius: "15px",
                py: 1,
              }}
            >
              <img
                src={ecStatusBarImage}
                alt="vertical_barstatus_ec"
                style={{ height: "100%" }}
              />
              <Typography fontFamily={"IRANSANS"} fontSize={13}>
                EC :{" "}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={toPersianDigits(ecValue ?? "")}
                InputProps={{ readOnly: true }}
                sx={{
                  width: 50,
                  backgroundColor: "#f0f0f0",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& input": {
                    fontFamily: "IRANSANS", // اضافه شد
                    textAlign: "center",
                    padding: "8px",
                    height: "unset",
                  },
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* ستون نمایشگر سطح آب */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            border: "0.5px solid gray",
            height: "100%",
            borderRadius: "15px",
            width: "40px",
            position: "relative",
          }}
        >
          {/* لایه پس‌زمینه */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#e0dedeff",
              zIndex: 0,
              borderRadius: "15px",
            }}
          />
          {/* لایه آب */}
          <Box
            sx={{
              position: "absolute",
              left: -10,
              right: 0,
              bottom: 0,
              height: `${fillPercentage}%`,
              backgroundColor: "#3e7dca",
              transition: "height 0.4s ease",
              zIndex: 1,
              borderRadius: "0 0 15px 15px",
            }}
          />
          {/* لایه فلوترها */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {[
              contents?.top_float_switch,
              contents?.middle_float_switch,
              contents?.buttom_float_switch,
            ].map((isActive, i) => (
              <Box
                key={i}
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#00BBFF" : "white",
                  position: "relative",
                  left: "8px",
                  border: "0.5px solid gray",
                }}
              ></Box>
            ))}
          </Box>
        </Stack>

        {/* بخش میانی (Middle Section) */}
        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            border: "0.5px solid gray",
            borderRadius: "15px",
            pt: 1,
          }}
          pl={1}
          pr={0.5}
          height="97%"
        >
          <Typography
            fontFamily={"IRANSANS"}
            variant="body1"
            sx={{
              textAlign: "center",
              fontWeight: "medium",
              mb: 1,
              fontSize: "12px",
            }}
          >
            استوک های ریخته شده
          </Typography>
          <Stack
            direction="row"
            gap={0}
            justifyContent={"space-between"}
            sx={{ mb: 1 }}
          >
            {["stock", "total", "time"].map((type) => (
              <CustomToggleButton
                key={type}
                selected={selectedStockType === type}
                onClick={() => setSelectedStockType(type)}
                size="small"
              >
                {type === "stock"
                  ? "استوک"
                  : type === "total"
                    ? "مجموع"
                    : "زمان"}
              </CustomToggleButton>
            ))}
          </Stack>
          <Box
            sx={{
              maxHeight: 220,
              overflowY: "scroll",
              pr: 1,
              pl: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              textAlign: "center",
            }}
          >
            {column1Data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    fontFamily="IRANSANS" // اضافه شد
                    sx={{ width: "30px", textAlign: "center" }}
                  >
                    {toPersianDigits(index + 1)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={toPersianDigits(item)}
                    InputProps={{ readOnly: true }}
                    sx={{
                      width: 37,
                      backgroundColor: "#f0f0f0",
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& input": {
                        fontFamily: "IRANSANS", // اضافه شد
                        textAlign: "center",
                        padding: "8px",
                        height: "unset",
                        fontSize: "0.75rem",
                      },
                    }}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    value={toPersianDigits(
                      column2Data[index] !== undefined
                        ? column2Data[index]
                        : "",
                    )}
                    InputProps={{ readOnly: true }}
                    sx={{
                      width: 37,
                      backgroundColor: "#f0f0f0",
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& input": {
                        fontFamily: "IRANSANS", // اضافه شد
                        textAlign: "center",
                        padding: "8px",
                        height: "unset",
                        fontSize: "0.75rem",
                      },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>

        {/* بخش سمت چپ (Left Section) */}
        <Stack
          spacing={1}
          alignItems="center"
          sx={{
            flexGrow: 1,
            maxWidth: "140px",
            height: "100%",
            borderRadius: "15px",
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              border: "0.5px solid gray",
              mt: 2,
              p: 0.5,
              borderRadius: "15px",
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: "50%",
                width: 80,
                height: 80,
                p: 0,
              }}
            >
              <img
                src={assets.svg.phlogo}
                alt="pH icon"
                style={{ width: 80, height: 80 }}
              />
            </IconButton>
            <Typography
              variant="body2"
              fontFamily={"IRANSANS"}
              sx={{ mt: 1, color: "#555", mb: 1 }}
            >
              وضعیت سیستم:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#D1E7DD",
                borderRadius: "10px",
                padding: "4px 8px",
                textAlign: "center",
                border: "0.5px solid gray",
              }}
            >
              <Typography
                variant="caption"
                fontFamily={"IRANSANS"}
                sx={{ color: "#0F5132", fontWeight: "800", fontSize: "9px" }}
              >
                {statusText || "نامشخص"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize="12px"
              sx={{ fontWeight: "700" }}
            >
              EC هدف
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={toPersianDigits(ecTargetValue || "")}
              onChange={(e) =>
                onEcTargetChange?.({
                  ...e,
                  target: {
                    ...e.target,
                    value: toEnglishDigits(e.target.value),
                  },
                })
              }
              sx={{
                width: 60,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                },
                "& input": {
                  fontFamily: "IRANSANS", // اضافه شد
                  textAlign: "center",
                  padding: "8px",
                  height: "unset",
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<InfoIcon sx={{ ml: "8px" }} />}
            onClick={handleOpenStatusModal}
            sx={{
              backgroundColor: "#A7D9B4",
              color: "#403f3fff",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 0",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#6CCDB0", boxShadow: "none" },
              mt: 2,
              display: "flex",
              justifyContent: "center",
              pr: 1,
              pl: 1,
            }}
          >
            <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "12px" }}>
              جزئیات ساخت
            </Typography>
          </Button>

          <Button
            variant="contained"
            startIcon={<InfoIcon sx={{ ml: "8px" }} />}
            onClick={handleOpenBuildDetailsModal}
            sx={{
              backgroundColor: "#ffebcc",
              color: "#403f3fff",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 0",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#fde0b5ff", boxShadow: "none" },
              mt: 0,
              display: "flex",
              justifyContent: "center",
              pr: 1,
              pl: 1,
            }}
          >
            <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "12px" }}>
              وضعیت محلول
            </Typography>
          </Button>
        </Stack>
      </Box>

      <BuildDetailsModal
        open={openBuildDetailsModal}
        onClose={handleCloseBuildDetailsModal}
        buildDetails={buildDetailsData}
      />

      <StatusModal
        open={openStatusModal}
        onClose={handleCloseStatusModal}
        title="جزئیات وضعیت ساخت"
        details={statusDetailsData}
      />
    </Paper>
  );
};

export default PhEcControlCardMixer;
