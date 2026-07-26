import React, { useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { toPersianDigits } from "../../utils/persianDigits";
import BuildDetailsModal from "../dashboard/BuildDetailsModal";
import StatusModal from "../dashboard/StatusModal";
import MixTankProcessStatus from "../common/MixTankProcessStatus";
import { getRangeBarStatusImage } from "../../utils/mixTankStatus";
import {
  buildMixTankStockRows,
  formatMixTankInteger,
  formatStockCellValue,
  getStockRowCol1Value,
  getStockRowCol2Value,
} from "../../utils/mixTankStockReport";

const PhEcControlCardMixer = ({
  contents,
  mixTankData,
  ecValue,
  phValue,
  ecRange,
  phRange,
  dosingPumpCount,
}) => {
  const selectedStockType = "total";

  const stockRows = React.useMemo(
    () => buildMixTankStockRows(mixTankData, dosingPumpCount),
    [mixTankData, dosingPumpCount],
  );

  const [openBuildDetailsModal, setOpenBuildDetailsModal] =
    React.useState(false);
  const handleOpenBuildDetailsModal = () => setOpenBuildDetailsModal(true);
  const handleCloseBuildDetailsModal = () => setOpenBuildDetailsModal(false);

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopState = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    isDragging.current = false;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollTopState.current = scrollRef.current.scrollTop;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
  };
  const handleMouseUp = () => {
    isDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    if (Math.abs(walk) > 5) isDragging.current = true;
    scrollRef.current.scrollTop = scrollTopState.current - walk;
  };

  // رویدادهای موبایل (تاچ)
  const handleTouchStart = (e) => {
    isDragging.current = false;
    startY.current = e.touches[0].pageY;
  };
  const handleTouchMove = (e) => {
    const y = e.touches[0].pageY;
    if (Math.abs(y - startY.current) > 5) isDragging.current = true;
  };
  const handleTouchEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };
  // =================================================

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

  const phStatusBarImage = getRangeBarStatusImage(phRange, "vertical");
  const ecStatusBarImage = getRangeBarStatusImage(ecRange, "vertical");

  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const handleOpenStatusModal = () => setOpenStatusModal(true);
  const handleCloseStatusModal = () => setOpenStatusModal(false);

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
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
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
                value={formatMixTankInteger(phValue)}
                InputProps={{ readOnly: true }}
                sx={{
                  width: 50,
                  backgroundColor: "#f0f0f0",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& input": {
                    fontFamily: "IRANSANS",
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
                value={formatMixTankInteger(ecValue)}
                InputProps={{ readOnly: true }}
                sx={{
                  width: 50,
                  backgroundColor: "#f0f0f0",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& input": {
                    fontFamily: "IRANSANS",
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
        <Stack alignItems="center" spacing={0.25} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              border: "0.5px solid gray",
              flex: 1,
              minHeight: 0,
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
          <Typography
            fontFamily="IRANSANS"
            sx={{
              scale: "1.9",
              fontSize: "9px",
              color: "#555",
              textAlign: "center",
              lineHeight: 1.1,
              pt: 1,
              whiteSpace: "nowrap",
            }}
          >
            {formatMixTankInteger(contents?.filled_volume ?? 0)} لیتر
          </Typography>
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
            {["استوک", "مجموع", "زمان"].map((label) => (
              <Typography
                key={label}
                fontFamily="IRANSANS"
                sx={{
                  width: label === "استوک" ? 30 : 37,
                  color: "#E65100",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </Typography>
            ))}
          </Stack>
          <Box
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              maxHeight: 220,
              overflowY: "auto",
              pr: 1,
              pl: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              textAlign: "center",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              touchAction: "pan-y",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
            }}
          >
            {stockRows.map((row, index) => {
              const showCol1 = getStockRowCol1Value(
                row,
                selectedStockType,
                stockRows,
                mixTankData,
              );
              const showCol2 = getStockRowCol2Value(
                row,
                selectedStockType,
                stockRows,
                mixTankData,
              );

              return (
                <Box
                  key={row.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexShrink: 0,
                    pointerEvents: "none",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{
                        width: "30px",
                        textAlign: "center",
                        fontSize: "0.7rem",
                      }}
                    >
                      {row.label === "pH" ? "pH" : toPersianDigits(row.label)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formatStockCellValue(
                        showCol1,
                        selectedStockType,
                      )}
                      InputProps={{ readOnly: true }}
                      sx={{
                        width: 37,
                        backgroundColor: "#f0f0f0",
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                        "& input": {
                          fontFamily: "IRANSANS",
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
                      value={formatStockCellValue(
                        showCol2,
                        selectedStockType,
                      )}
                      InputProps={{ readOnly: true }}
                      sx={{
                        width: 37,
                        backgroundColor: "#f0f0f0",
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                        "& input": {
                          fontFamily: "IRANSANS",
                          textAlign: "center",
                          padding: "8px",
                          height: "unset",
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Stack>

        {/* بخش سمت چپ (Left Section) */}
        <Stack
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexGrow: 1,
            maxWidth: "140px",
            height: "100%",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <MixTankProcessStatus mixTankData={mixTankData} />
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
              <Typography
                fontFamily={"IRANSANS"}
                sx={{ fontSize: "12px", pointerEvents: "none" }}
              >
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
          </Box>
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
