import React, { useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { toPersianDigits } from "../../utils/persianDigits";
import BuildDetailsModal from "./BuildDetailsModal";
import StatusModal from "./StatusModal";
import MixTankProcessStatus from "../common/MixTankProcessStatus";
import {
  buildMixTankStockRows,
  formatMixTankInteger,
  formatStockCellValue,
  getStockRowCol1Value,
  getStockRowCol2Value,
} from "../../utils/mixTankStockReport";

const ReadonlyValueBox = ({ value, mode }) => (
  <Box
    sx={{
      width: 40,
      minHeight: 32,
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      border: "1px solid #c4c4c4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
    }}
  >
    <Typography
      fontFamily="IRANSANS"
      fontSize="10px"
      textAlign="center"
      sx={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {formatStockCellValue(value, mode)}
    </Typography>
  </Box>
);

const PhEcControlCard = ({ contents, mixTankData, dosingPumpCount }) => {
  const selectedStockType = "total";
  const stockRows = React.useMemo(
    () => buildMixTankStockRows(mixTankData, dosingPumpCount),
    [mixTankData, dosingPumpCount],
  );

  const [openBuildDetailsModal, setOpenBuildDetailsModal] =
    React.useState(false);
  const handleOpenBuildDetailsModal = () => setOpenBuildDetailsModal(true);
  const handleCloseBuildDetailsModal = () => setOpenBuildDetailsModal(false);

  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const handleOpenStatusModal = () => setOpenStatusModal(true);
  const handleCloseStatusModal = () => setOpenStatusModal(false);

  // === منطق اسکرول عمودی با درگ (Drag to Scroll) ===
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopState = useRef(0);

  // رویدادهای دسکتاپ (موس)
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

  const statusDetailsData = [
    { parameter: "پمپ A", status: "روشن" },
    { parameter: "پمپ B", status: "خاموش" },
    { parameter: "شیر C", status: "باز" },
    { parameter: "سنسور pH", status: "فعال" },
    { parameter: "سنسور EC", status: "خطا" },
  ];

  let fillPercentage = 0;
  if (contents?.max_volume > 0) {
    fillPercentage = (contents.filled_volume / contents.max_volume) * 100;
  }
  fillPercentage = Math.max(0, Math.min(100, fillPercentage));

  const buildDetailsData = [
    { time: "10:30", type: "pH", volume: "50L", tank: "A", status: "success" },
    { time: "11:00", type: "EC", volume: "20L", tank: "B", status: "failed" },
    { time: "11:15", type: "pH", volume: "30L", tank: "A", status: "success" },
    { time: "12:00", type: "EC", volume: "40L", tank: "C", status: "success" },
    { time: "12:30", type: "pH", volume: "10L", tank: "B", status: "success" },
    { time: "13:00", type: "EC", volume: "25L", tank: "A", status: "failed" },
    { time: "13:45", type: "pH", volume: "60L", tank: "C", status: "success" },
    { time: "14:00", type: "EC", volume: "15L", tank: "B", status: "success" },
    { time: "10:30", type: "pH", volume: "50L", tank: "A", status: "success" },
    { time: "11:00", type: "EC", volume: "20L", tank: "B", status: "failed" },
    { time: "11:15", type: "pH", volume: "30L", tank: "A", status: "success" },
    { time: "12:00", type: "EC", volume: "40L", tank: "C", status: "success" },
    { time: "12:30", type: "pH", volume: "10L", tank: "B", status: "success" },
    { time: "13:00", type: "EC", volume: "25L", tank: "A", status: "failed" },
    { time: "13:45", type: "pH", volume: "60L", tank: "C", status: "success" },
    { time: "14:00", type: "EC", volume: "15L", tank: "B", status: "success" },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        width: "360px",
        height: "320px",
        backgroundColor: "#ffff",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        borderRadius: "10px",
        px: 1,
        pr: 1.5,
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
          gap: 1,
          transform: "scaleY(1.12)",
        }}
      >
        <Stack alignItems="center" spacing={0.25} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              border: "0.5px solid gray",
              p: 1,
              flex: 1,
              minHeight: 0,
              borderRadius: "15px",
              width: "40px",
              position: "relative",
            }}
          >
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
          {/* لایه آب (پُر) */}
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
          {/* لایه فلوترها (رو) */}
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
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.top_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.middle_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.buttom_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
          </Box>
          </Stack>
          <Typography
            fontFamily="IRANSANS"
            sx={{
              scale:"1.6",
              fontSize: "9px",
              color: "#555",
              textAlign: "start",
              lineHeight: 0,
              pt: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            {formatMixTankInteger(contents?.filled_volume ?? 0)} لیتر
          </Typography>
        </Stack>

        {/* --- Middle Section --- */}
        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            border: "0.5px solid gray",
            borderRadius: "15px",
            userSelect: "none",
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
              fontWeight: "medium",
              mb: 1,
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            استوک های ریخته شده
          </Typography>
          <Stack
            direction="row"
            gap={1}
            justifyContent={"space-between"}
            sx={{ mb: 1 }}
          >
            {["استوک", "مجموع", "زمان"].map((label) => (
              <Typography
                key={label}
                fontFamily="IRANSANS"
                sx={{
                  width: label === "استوک" ? 30 : 40,
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
            onSelectStart={(e) => e.preventDefault()}
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
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {stockRows.map((row) => {
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
                    userSelect: "none",
                    WebkitUserSelect: "none",
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
                    <ReadonlyValueBox
                      value={showCol1}
                      mode={selectedStockType}
                    />
                    <ReadonlyValueBox
                      value={showCol2}
                      mode={selectedStockType}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Stack>

        {/* --- Left Section --- */}
        <Stack
          spacing={1}
          alignItems="space-between"
          justifyContent="space-between"
          sx={{
            flexGrow: 1,
            maxWidth: "140px",
            height: "100%",
            borderRadius: "15px",
          }}
        >
          <MixTankProcessStatus mixTankData={mixTankData} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                "&:hover": {
                  backgroundColor: "#6CCDB0",
                  boxShadow: "none",
                },
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
                "&:hover": {
                  backgroundColor: "#fde0b5ff",
                  boxShadow: "none",
                },
                mt: 0,
                display: "flex",
                justifyContent: "center",
                pr: 1,
                pl: 1,
              }}
            >
              <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "12px" }}>
                وضعیت محلول{" "}
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

export default PhEcControlCard;
