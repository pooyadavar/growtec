import React, { useState, useMemo, useRef } from "react";
import {
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box,
  Button,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import assets from "../../assets";
import { useQuery } from "@tanstack/react-query";
import { getErrorCodes } from "../../api/dashboardApi";
import { toPersianDigits } from "../../utils/persianDigits";

const ErrorComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // === منطق اسکرول عمودی با درگ (Drag to Scroll) ===
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startY = useRef(0);
  const scrollTopState = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    // محاسبه موقعیت Y موس نسبت به کانتینر
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollTopState.current = scrollRef.current.scrollTop;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5; // ضریب سرعت اسکرول
    scrollRef.current.scrollTop = scrollTopState.current - walk;
  };
  // =================================================

  const errorDescriptions = {
    1: "پایین بودن پ هاش بعد از ساخت",
    2: "بالا بودن پ ها",
    3: "پایین تر بودن ای سی",
    4: "بالا تر بودن ای سی",
    5: "تداخل ساخت محلول",
    6: "طولانی شدن زمان پر کن",
    7: "تزریق بیشتر از حد مجاز استوک",
    8: "تزریق بیش از حد مجاز اسید",
    9: "تعدادبالا تزریق استوک",
    10: "تعداد بالا تزریق اسید",
    11: "کوتاه بودن زمان میکس",
    12: "تداخل ساخت محلول و تیتراسیون",
    14: "فروت سویچ‌غیر عادی",
    15: "کالیبره نشدن دوزینگ پمپ",
    16: "انجام نشدن تیتراسیون",
    17: "خالی شدن مخزن حین ابیاری",
  };

  const {
    data: errorLogs,
    isLoading: isErrorLogsLoading,
    isError: isErrorLogsError,
    error: errorLogsError,
  } = useQuery({
    queryKey: ["errorCodes"],
    queryFn: getErrorCodes,
    refetchInterval: 5000,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      return data.map((log) => ({
        code: log.log_data.code,
        description: errorDescriptions[log.log_data.code] || "خطای ناشناخته",
        time: new Date(log.log_date_time).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      }));
    },
  });

  const errorsToDisplay = errorLogs || [];

  const groupedErrors = useMemo(() => {
    if (!errorsToDisplay || errorsToDisplay.length === 0) return [];

    const grouped = [];
    let current = null;

    for (const error of errorsToDisplay) {
      if (current && current.code === error.code) {
        current.lastTime = error.time;
        current.count++;
      } else {
        if (current) grouped.push(current);
        current = {
          code: error.code,
          description: error.description,
          firstTime: error.time,
          lastTime: error.time,
          count: 1,
        };
      }
    }
    if (current) grouped.push(current);
    return grouped;
  }, [errorsToDisplay]);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxHeight: "80vh",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  if (isErrorLogsLoading) {
    return (
      <Container
        sx={{
          width: "200px",
          height: "320px",
          backgroundColor: "#ffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        }}
      >
        <CircularProgress size={30} />
      </Container>
    );
  }

  if (isErrorLogsError) {
    return (
      <Container
        sx={{
          width: "200px",
          height: "320px",
          backgroundColor: "#ffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
          p: 2,
        }}
      >
        <Alert
          severity="error"
          sx={{ fontSize: "0.8rem", textAlign: "center" }}
        >
          خطا در بارگیری خطاها: {errorLogsError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container
        disableGutters
        sx={{
          width: "200px",
          height: "320px",
          backgroundColor: "#ffff",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
          overflow: "hidden",
          // جلوگیری از سلکت شدن متن در کل کانتینر
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <Box
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          sx={{
            display: "flex",
            width: "90%",
            gap: 2,
            justifyContent: "center",
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "0 4px",
            cursor: "grab", // نشانگر موس برای قابلیت کشیدن
            "&:active": {
              cursor: "grabbing", // نشانگر موس وقتی کلیک نگه داشته شده
            },
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <div
            className="errorMessage"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "5px",
              pointerEvents: "none", // جلوگیری از تداخل المان‌های داخلی با اسکرول
            }}
          >
            <div
              style={{
                width: "64px",
                height: "24px",
                backgroundColor: "#FFCB82",
                border: "0.5px solid #9F9F9F",
                borderRadius: "5px",
                margin: "0 0 1rem 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
                pointerEvents: "auto",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                کد خطا
              </Typography>
            </div>

            {groupedErrors.length > 0 ? (
              groupedErrors.map((log, index) => (
                <Typography
                  key={index}
                  fontFamily="IRANSANS"
                  sx={{ marginTop: "4px", fontSize: "12px" }}
                >
                  {toPersianDigits(log.code)}
                </Typography>
              ))
            ) : (
              <Typography
                fontFamily="IRANSANS"
                sx={{ marginTop: "4px", fontSize: "12px", color: "#555" }}
              >
                خطایی یافت نشد.
              </Typography>
            )}
          </div>

          <img 
             src={assets.svg.line} 
             alt="" 
             style={{ pointerEvents: "none" }} // جلوگیری از درگ شدن خود عکس
          />

          <div
            className="errorTime"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "5px",
              pointerEvents: "none", // جلوگیری از تداخل
            }}
          >
            <div
              style={{
                width: "64px",
                height: "24px",
                backgroundColor: "#FFCB82",
                border: "0.5px solid #9F9F9F",
                borderRadius: "5px",
                margin: "0 0 1rem 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
                pointerEvents: "auto",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                زمان
              </Typography>
            </div>

            {groupedErrors.length > 0 ? (
              groupedErrors.map((log, index) => (
                <Typography
                  key={index}
                  fontFamily="IRANSANS"
                  sx={{ marginTop: "4px", fontSize: "9px" }}
                >
                  {log.count > 1
                    ? ` (${toPersianDigits(log.count)}) ${toPersianDigits(log.lastTime)} - ${toPersianDigits(log.firstTime)} `
                    : toPersianDigits(log.firstTime)}
                </Typography>
              ))
            ) : (
              <Typography
                fontFamily="IRANSANS"
                sx={{ marginTop: "4px", fontSize: "12px", color: "#555" }}
              >
                زمانی یافت نشد.
              </Typography>
            )}
          </div>
        </Box>

        <Box
          sx={{
            p: 1,
            width: "93%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: "#FFCB82",
              color: "#000",
              fontFamily: "IRANSANS",
              fontSize: "12px",
              width: "90%",
              "&:hover": {
                backgroundColor: "#ffb74d",
              },
            }}
          >
            نمایش جزئیات
          </Button>
        </Box>
      </Container>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="error-modal-title"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              id="error-modal-title"
              variant="h6"
              fontFamily="IRANSANS"
            >
              لیست کامل خطاها
            </Typography>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Header Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #ccc",
              pb: 1,
              mb: 1,
              backgroundColor: "#f5f5f5",
              p: 1,
              borderRadius: "5px",
            }}
          >
            <Typography
              fontFamily="IRANSANS"
              width="10%"
              textAlign="center"
              fontWeight="bold"
            >
              کد
            </Typography>
            <Typography
              fontFamily="IRANSANS"
              width="60%"
              textAlign="center"
              fontWeight="bold"
            >
              توضیحات
            </Typography>
            <Typography
              fontFamily="IRANSANS"
              width="30%"
              textAlign="center"
              fontWeight="bold"
            >
              زمان
            </Typography>
          </Box>

          <Box sx={{ overflowY: "auto", flexGrow: 1, pr: 1 }}>
            {groupedErrors.length > 0 ? (
              groupedErrors.map((log, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    py: 1,
                  }}
                >
                  <Typography
                    fontFamily="IRANSANS"
                    width="10%"
                    textAlign="center"
                  >
                    {toPersianDigits(log.code)}
                  </Typography>

                  <Typography
                    fontFamily="IRANSANS"
                    width="60%"
                    textAlign="center"
                  >
                    {log.description}
                  </Typography>

                  <Typography
                    fontFamily="IRANSANS"
                    width="30%"
                    textAlign="center"
                    fontSize="12px"
                  >
                    {log.count > 1
                      ? ` (${toPersianDigits(log.count)}) ${toPersianDigits(log.lastTime)} - ${toPersianDigits(log.firstTime)} `
                      : toPersianDigits(log.firstTime)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography fontFamily="IRANSANS" textAlign="center">
                هیچ خطایی ثبت نشده است.
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ErrorComponent;