import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AgCharts } from "ag-charts-react";
import assets from "../../assets";
import IconTextButton from "../../card/IconTextButton";
import apiClient from "../../api/apiClient";
import { calibrationEc, calibrationPh } from "../../api/solubleApi";
import toast from "react-hot-toast";

const SENSORS = [
  { id: 1, name: "سنسور شماره ۱" },
  { id: 2, name: "سنسور شماره ۲" },
  { id: 3, name: "سنسور شماره ۳" },
  { id: 4, name: "سنسور شماره ۴" },
  { id: 5, name: "سنسور شماره ۵" },
];

// --- کامپوننت مودال کالیبراسیون ---
const CalibrationModalContent = ({
  open,
  onClose,
  calibrateTab,
  setCalibrateTab,
  calibrateValues,
  setCalibrateValues,
  sensorName,
  sensorId,
}) => {
  const [ecStep, setEcStep] = useState(1);
  const [phStep, setPhStep] = useState(1);

  // Reset step when modal opens or tab changes
  useEffect(() => {
    if (open) {
      setEcStep(1);
      setPhStep(1);
    }
  }, [open, calibrateTab]);

  const handleEcCalibrationStep1 = async () => {
    if (!calibrateValues.ecLow || !calibrateValues.ecHigh) {
      toast.error("لطفا هر دو مقدار EC را وارد کنید");
      return;
    }

    try {
      const payload = {
        step: 1,
        ec_number: sensorId,
        buffer_ec_low: Number(calibrateValues.ecLow),
        buffer_ec_high: Number(calibrateValues.ecHigh),
      };
      await calibrationEc(payload);
      toast.success("مرحله اول کالیبراسیون EC با موفقیت انجام شد");
      setEcStep(2);
    } catch (error) {
      console.error("Calibration Step 1 Error:", error);
      toast.error("خطا در مرحله اول کالیبراسیون");
    }
  };

  const handleEcLowConfirm = async () => {
    try {
      const payload = {
        step: 2,
        ec_number: sensorId,
      };
      await calibrationEc(payload);
      toast.success("کالیبراسیون حد پایین (Step 2) انجام شد");
      setEcStep(3);
    } catch (error) {
      console.error("Calibration Step 2 Error:", error);
      toast.error("خطا در کالیبراسیون حد پایین");
    }
  };

const handleEcHighConfirm = async () => {
  try {
    // Step 3
    const payloadStep3 = {
      step: 3,
      ec_number: sensorId,
    };
    await calibrationEc(payloadStep3);
    toast.success("کالیبراسیون حد بالا (Step 3) انجام شد");

    // Step 4 (Finalization) - Triggered immediately after Step 3 success
    const payloadStep4 = {
      step: 4,
      ec_number: sensorId,
    };
    await calibrationEc(payloadStep4);
    toast.success("کالیبراسیون با موفقیت به پایان رسید (Step 4)");
    
    // Reset and Close Modal
    setEcStep(1); 
    onClose(); 

  } catch (error) {
    console.error("Calibration Step 3/4 Error:", error);
    toast.error("خطا در تکمیل کالیبراسیون");
  }
};

const handlePhCalibrationStep1 = async () => {
  if (!calibrateValues.phLow || !calibrateValues.phHigh) {
    toast.error("لطفا هر دو مقدار pH را وارد کنید");
    return;
  }

  try {
    const payload = {
      step: 1,
      ph_number: sensorId,
      buffer_ph_low: Number(calibrateValues.phLow),
      buffer_ph_high: Number(calibrateValues.phHigh),
    };
    await calibrationPh(payload);
    toast.success("مرحله اول کالیبراسیون pH با موفقیت انجام شد");
    setPhStep(2);
  } catch (error) {
    console.error("Calibration pH Step 1 Error:", error);
    toast.error("خطا در مرحله اول کالیبراسیون pH");
  }
};

const handlePhLowConfirm = async () => {
  try {
    const payload = {
      step: 2,
      ph_number: sensorId,
    };
    await calibrationPh(payload);
    toast.success("کالیبراسیون حد پایین pH (Step 2) انجام شد");
    setPhStep(3);
  } catch (error) {
    console.error("Calibration pH Step 2 Error:", error);
    toast.error("خطا در کالیبراسیون حد پایین pH");
  }
};

const handlePhHighConfirm = async () => {
  try {
    // Step 3
    const payloadStep3 = {
      step: 3,
      ph_number: sensorId,
    };
    await calibrationPh(payloadStep3);
    toast.success("کالیبراسیون حد بالا pH (Step 3) انجام شد");

    // Step 4 (Finalization)
    const payloadStep4 = {
      step: 4,
      ph_number: sensorId,
    };
    await calibrationPh(payloadStep4);
    toast.success("کالیبراسیون pH با موفقیت به پایان رسید (Step 4)");
    
    setPhStep(1); 
    onClose(); 

  } catch (error) {
    console.error("Calibration pH Step 3/4 Error:", error);
    toast.error("خطا در تکمیل کالیبراسیون pH");
  }
};


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550,
          bgcolor: "#f5f5f5",
          borderRadius: "10px",
          boxShadow: 24,
          p: 3,
          outline: "none",
          fontFamily: "IRANSANS",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography fontFamily="IRANSANS" fontWeight="bold" fontSize={16}>
            کالیبراسیون: {sensorName}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              bgcolor: "#e57373",
              borderRadius: "4px",
              padding: "2px",
              "&:hover": { bgcolor: "#ef5350" },
            }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex" , justifyContent:"left", gap: 1, mb: 0 }}>
          <Button
            onClick={() => setCalibrateTab("ec")}
            sx={{
              bgcolor: calibrateTab === "ec" ? "#FFFFFF" : "#FFCB82",
              color: "#000",
              borderRadius: "10px 10px 0 0",
              px: 3,
              py: 0.5,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: calibrateTab === "ec" ? "#FFFFFF" : "#FFCB82",
              },
            }}
          >
            EC
          </Button>
          <Button
            onClick={() => setCalibrateTab("ph")}
            sx={{
              bgcolor: calibrateTab === "ph" ? "#FFFFFF" : "#FFCB82",
              color: "#000",
              borderRadius: "10px 10px 0 0",
              px: 3,
              py: 0.5,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: calibrateTab === "ph" ? "#FFFFFF" : "#FFCB82",
              },
            }}
          >
            pH
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "0px 15px 15px 15px",
            p: 3,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "120px",
              border: "3px solid #66bb6a",
              borderRadius: "10px",
              mb: 4,
              bgcolor: "#fff",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: "row-reverse",
              position: "relative",
            }}
          >
            {/* ستون سمت راست (بالا) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                width: "40%",
              }}
            >
              <Typography fontFamily="IRANSANS" color="#555">
                {calibrateTab === "ec" ? "EC بالا" : "pH بالا"}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={
                  calibrateTab === "ec"
                    ? calibrateValues.ecHigh
                    : calibrateValues.phHigh
                }
                onChange={(e) =>
                  setCalibrateValues((prev) => ({
                    ...prev,
                    [calibrateTab === "ec" ? "ecHigh" : "phHigh"]:
                      e.target.value,
                  }))
                }
                sx={{
                  width: "100%",
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
              {/* دکمه تایید تکی برای pH یا برای EC مرحله ۲ */}
              {((calibrateTab === "ec" && (ecStep === 2 || ecStep === 3)) ||
                (calibrateTab === "ph" && (phStep === 2 || phStep === 3))) && (
                <Button
                  variant="contained"
                  disabled={
                    (calibrateTab === "ec" && ecStep === 2) ||
                    (calibrateTab === "ph" && phStep === 2)
                  }
                  onClick={
                    calibrateTab === "ec" ? handleEcHighConfirm : handlePhHighConfirm
                  }
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#ffb74d" },
                    "&:disabled": { bgcolor: "#ccc", color: "#666" },
                  }}
                >
                  تایید
                </Button>
              )}
            </Box>

            {/* دکمه وسط برای EC یا pH - فقط در مرحله ۱ */}
            {((calibrateTab === "ec" && ecStep === 1) || (calibrateTab === "ph" && phStep === 1)) && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  alignSelf: "flex-end",
                  mt: 12,
                }}
              >
                <Button
                  variant="contained"
                  onClick={calibrateTab === "ec" ? handleEcCalibrationStep1 : handlePhCalibrationStep1}
                  disabled={
                    calibrateTab === "ec"
                      ? (!calibrateValues.ecLow || !calibrateValues.ecHigh)
                      : (!calibrateValues.phLow || !calibrateValues.phHigh)
                  }
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#fff",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    px: 3,
                    "&:hover": { bgcolor: "#45a049" },
                    "&:disabled": { bgcolor: "#ccc" },
                    width: "150px",
                  }}
                >
                  شروع کالیبراسیون
                </Button>
              </Box>
            )}

            {/* ستون سمت چپ (پایین) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                width: "40%",
              }}
            >
              <Typography fontFamily="IRANSANS" color="#555">
                {calibrateTab === "ec" ? "EC پایین" : "pH پایین"}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={
                  calibrateTab === "ec"
                    ? calibrateValues.ecLow
                    : calibrateValues.phLow
                }
                onChange={(e) =>
                  setCalibrateValues((prev) => ({
                    ...prev,
                    [calibrateTab === "ec" ? "ecLow" : "phLow"]: e.target.value,
                  }))
                }
                sx={{
                  width: "100%",
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
              {/* دکمه تایید تکی برای pH یا برای EC مرحله ۲ */}
              {((calibrateTab === "ec" && ecStep === 2) ||
                (calibrateTab === "ph" && phStep === 2)) && (
                <Button
                  variant="contained"
                  onClick={
                    calibrateTab === "ec" ? handleEcLowConfirm : handlePhLowConfirm
                  }
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  تایید
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// --- آیتم تکی نمودار ---
const SensorChartItem = ({ sensor, isActive, onTimeUpdate }) => {
  const [data, setData] = useState([]);

  // تنظیمات استایل باکس نمودار
  const chartBoxStyle = {
    width: "98%",
    height: "100px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "0.5px solid #9F9F9F",
    boxShadow: "rgba(15, 28, 36, 0.05) 0px 6px 15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    px: 1.5,
    overflow: "hidden",
    pt: 1,
  };

  const fetchLatest = useCallback(async () => {
    try {
      const response = await apiClient.post("/log/soluble/ec-ph-temperature/", {
        sensor_number: sensor.id,
        limit: 1000,
      });

      const array = Array.isArray(response) ? response : response.results || [];
      if (!array.length) return;

      setData((prev) => {
        const sortedArray = [...array].sort(
          (a, b) => new Date(a.log_date_time) - new Date(b.log_date_time)
        );

        const newPoints = sortedArray
          .filter((item) => {
            if (item.log_data.sensot_number !== sensor.id) return false;
            if (!item.log_date_time) return false;
            // if (!lastPointTime) return true; // Removed filtering by time
            // return new Date(item.log_date_time) > new Date(lastPointTime); // Removed filtering by time
            return true;
          })
          .map((latest) => {
            const rawTime = latest.log_date_time;
            const timeObj = new Date(rawTime);
            return {
              fullTime: rawTime,
              dateObj: timeObj,
              time: rawTime.split(" ")[1],
              ec: latest.log_data.ec,
              pc: latest.log_data.ph,
              temp: latest.log_data.temperature,
            };
          });

        // if (newPoints.length === 0) return prev; // Removed early return
        // const combinedData = [...prev, ...newPoints]; // Replaced with full replacement
        const combinedData = newPoints; // Replace previous data with new fetched data completely

        if (isActive && combinedData.length > 0) {
          onTimeUpdate(combinedData[combinedData.length - 1].time);
        }

        return combinedData;
      });
    } catch (err) {
      console.error(`Fetch Error Sensor ${sensor.id}:`, err);
    }
  }, [sensor.id, isActive, onTimeUpdate]);

  useEffect(() => {
    fetchLatest();
    let interval = null;
    if (isActive) {
      interval = setInterval(fetchLatest, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, fetchLatest]);

  const getChartOptions = (key, title, color, shape, showXAxis) => {
    // 1. محاسبه مقادیر معتبر فقط برای پیدا کردن Min/Max محور Y
    const validValues = data
      .map((d) => d[key])
      .filter((v) => typeof v === "number");

    let min = 0,
      max = 10;
    if (validValues.length > 0) {
      const dataMin = Math.min(...validValues);
      const dataMax = Math.max(...validValues);
      const buffer = (dataMax - dataMin) * 0.2 || 1;
      min = dataMin - buffer;
      max = dataMax + buffer;
    }

    // 2. تنظیمات چارت
    return {
      // نکته: کل دیتا را پاس می‌دهیم تا محور زمان در تمام چارت‌ها یکسان باشد
      data: data,
      padding: { top: 5, right: 15, bottom: 5, left: 5 },
      series: [
        {
          type: "line",
          xKey: "dateObj",
          yKey: key,
          yName: title,
          stroke: color,
          strokeWidth: 2,
          marker: { enabled: false },
          connectMissingValues: false,
          tooltip: {
            renderer: ({ datum, xKey, yKey }) => {
              if (datum[yKey] === undefined || datum[yKey] === null)
                return { content: "No Data" };
              const date = datum[xKey];
              const timeString = date
                ? date.toLocaleTimeString("en-GB", { hour12: false })
                : "";
              return {
                title: timeString,
                content: `${title}: ${datum[yKey]}`,
              };
            },
          },
        },
      ],
      axes: [
        {
          type: "time",
          position: "bottom",
          nice: true,
          // فقط اگر showXAxis true باشد، اعداد را نشان بده
          label: {
            enabled: showXAxis,
            fontSize: 10,
            color: "#666",
            format: "%H:%M",
            autoRotate: false,
            rotation: 0,
          },
          // خط افقی پایین نمودار
          line: { enabled: showXAxis, width: 1, color: "#ccc" },

          // *** تنظیمات مهم برای خطوط عمودی ***
          // 1. Tick باید همیشه enabled باشد تا گرید رسم شود
          // 2. اگر showXAxis=false باشد، رنگ Tick را transparent می‌کنیم تا دیده نشود
          tick: {
            enabled: true,
            color: showXAxis ? "#666" : "transparent",
            width: 1,
            size: 6, // اندازه تیک‌ها
          },

          // *** استایل خطوط عمودی (شبیه به عکس) ***
          gridStyle: [
            {
              stroke: "#000000", // رنگ مشکی (یا خاکستری خیلی تیره)
              lineDash: [0],     // [0] یعنی خط ممتد (بدون خط‌چین)
              opacity: 0.3,      // کمی شفافیت تا خیلی توی ذوق نزند
              width: 1,          // ضخامت خط
            },
          ],
          
          crosshair: {
            enabled: true,
            stroke: "#999999",
            strokeWidth: 1,
          },
        },
        {
          type: "number",
          position: "left",
          min,
          max,
          label: { fontSize: 9, color: "#333" },
          tick: { count: 3 },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  };

  return (
    <Box
      sx={{
        width: "96%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        px: "2px",
      }}
    >
      <Box sx={chartBoxStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            px: 1,
            mb: -1,
            zIndex: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#0077FF" }}
          >
            EC
          </Typography>
        </Box>
        <Box sx={{ height: "100%", width: "100%" }}>
          <AgCharts
            options={getChartOptions("ec", "EC", "#0077FF", "circle", false)}
            style={{ height: "80%" }}
          />
        </Box>
      </Box>
      <Box sx={chartBoxStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            px: 1,
            mb: -1,
            zIndex: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#FF5E57" }}
          >
            PC (pH)
          </Typography>
        </Box>
        <Box sx={{ height: "100%", width: "100%" }}>
          <AgCharts
            options={getChartOptions("pc", "PC", "#FF5E57", "square", false)}
            style={{ height: "80%" }}
          />
        </Box>
      </Box>
      <Box sx={chartBoxStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            px: 1,
            mb: -1,
            zIndex: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#2ECC71" }}
          >
            Temp
          </Typography>
        </Box>
        <Box sx={{ height: "100%", width: "100%" }}>
          {/* فقط اینجا showXAxis = true است */}
          <AgCharts
            options={getChartOptions("temp", "Temp", "#2ECC71", "triangle", true)}
            style={{ height: "80%" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// --- کامپوننت اصلی با اسلایدر Native ---
const SlidingWindowChart = () => {
  const scrollRef = useRef(null);

  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [calibrateTab, setCalibrateTab] = useState("ec");
  const [calibrateValues, setCalibrateValues] = useState({
    ecLow: "54",
    ecHigh: "1500",
    phLow: "",
    phHigh: "",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState("---");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScrollEvents = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 5;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);

      const index = Math.round(el.scrollLeft / el.clientWidth);
      if (index !== activeIndex && index >= 0 && index < SENSORS.length) {
        setActiveIndex(index);
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScrollEvents);
      window.addEventListener("resize", handleScrollEvents);

      setTimeout(handleScrollEvents, 100);

      return () => {
        el.removeEventListener("scroll", handleScrollEvents);
        window.removeEventListener("resize", handleScrollEvents);
      };
    }
  }, [handleScrollEvents]);

  const slide = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const width = el.clientWidth;
      el.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

  const handleTimeUpdate = useCallback((time) => {
    setLastUpdateTime(time);
  }, []);

  const currentSensor = SENSORS[activeIndex] || SENSORS[0];

  return (
    <Container
      sx={{
        width: "950px",
        height: "370px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        py: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "88%",
          mb: 1,
        }}
      >
        <Box>
          <Typography fontFamily={"IRANSANS"} fontWeight="bold">
            نمودار وضعیت مخزن - {currentSensor.name}
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={12}
            color="#666"
            mt={0.5}
          >
            آخرین داده:{" "}
            <span style={{ direction: "ltr", display: "inline-block" }}>
              {lastUpdateTime}
            </span>
          </Typography>
        </Box>
        <Box>
          <IconTextButton
            icon={assets.svg.calibrationsvg}
            text={`کالیبراسیون ${currentSensor.name}`}
            bgColor="#6CCDB0"
            textColor="black"
            height="15px"
            iconPosition="left"
            sx={{ marginLeft: "auto", fontSize: "14px", mt: "-20px" }}
            onClick={() => setIsCalibrateOpen(true)}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
          position: "relative",
          bottom: 9,
        }}
      >
        <IconButton
          onClick={() => slide("right")}
          disabled={!canScrollRight}
          sx={{
            width: "30px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            "&:hover": { backgroundColor: "#d0d0d0" },
            opacity: canScrollRight ? 1 : 0.5,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            width: "860px",
            height: "280px",
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            direction: "ltr",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {SENSORS.map((sensor, index) => (
            <Box
              key={sensor.id}
              sx={{
                minWidth: "100%",
                flexShrink: 0,
                scrollSnapAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SensorChartItem
                sensor={sensor}
                isActive={index === activeIndex}
                onTimeUpdate={handleTimeUpdate}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => slide("left")}
          disabled={!canScrollLeft}
          sx={{
            width: "30px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            "&:hover": { backgroundColor: "#d0d0d0" },
            opacity: canScrollLeft ? 1 : 0.5,
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
        </IconButton>
      </Box>

      <CalibrationModalContent
        open={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
        calibrateTab={calibrateTab}
        setCalibrateTab={setCalibrateTab}
        calibrateValues={calibrateValues}
        setCalibrateValues={setCalibrateValues}
        sensorName={currentSensor.name}
        sensorId={currentSensor.id}
      />
    </Container>
  );
};

export default SlidingWindowChart;