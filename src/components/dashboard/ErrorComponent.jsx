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
import ModalCloseButton from "../common/ModalCloseButton";
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

  if (isErrorLogsLoading && !errorLogs?.length) {
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

  if (isErrorLogsError && !errorLogs?.length) {
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
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "90%",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            flexShrink: 0,
            pt: 1,
            px: "4px",
          }}
        >
          <Box
            sx={{
              width: "64px",
              height: "24px",
              backgroundColor: "#FFCB82",
              border: "0.5px solid #9F9F9F",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          </Box>

          <Box
            component="img"
            src={assets.svg.line}
            alt=""
            sx={{ height: "24px", flexShrink: 0 }}
          />

          <Box
            sx={{
              width: "64px",
              height: "24px",
              backgroundColor: "#FFCB82",
              border: "0.5px solid #9F9F9F",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          </Box>
        </Box>

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
            alignSelf: "center",
            flex: "1 1 0",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "4px",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
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
          <Box
            className="errorMessage"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
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
          </Box>

          <Box
            component="img"
            src={assets.svg.line}
            alt=""
            sx={{ pointerEvents: "none", flexShrink: 0 }}
          />

          <Box
            className="errorTime"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
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
          </Box>
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

            <ModalCloseButton onClick={handleClose} />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ overflowY: "auto", flex: "1 1 0", minHeight: 0, pr: 1 }}>
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
                position: "sticky",
                top: 0,
                zIndex: 2,
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
