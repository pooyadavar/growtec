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
import {
  calibrationEc,
  calibrationPh,
  getSolubleEcPhTemperature,
} from "../../api/solubleApi";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";

const SENSORS = [
  { id: 1, name: "سنسور شماره ۱" },
  { id: 2, name: "سنسور شماره ۲" },
  { id: 3, name: "سنسور شماره ۳" },
  { id: 4, name: "سنسور شماره ۴" },
  { id: 5, name: "سنسور شماره ۵" },
];

const numbers = `۰۱۲۳۴۵۶۷۸۹`;
const convert = (num) => {
  if (num === null || num === undefined || num === "") return "";
  let res = "";
  const str = num.toString();
  for (let c of str) {
    if (c >= "0" && c <= "9") {
      res += numbers.charAt(c);
    } else {
      res += c;
    }
  }
  return res;
};

const toEnglishNumber = (str) => {
  if (!str) return "";
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i);
  }
  return result;
};

// --- کامپوننت مودال کالیبراسیون سنسورهای EC و pH ---
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
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    if (open) {
      setEcStep(1);
      setPhStep(1);
      setRealTimeData([]);
    }
  }, [open, calibrateTab]);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const response = await getSolubleEcPhTemperature();
        const sensorData = response[String(sensorId)];

        if (sensorData) {
          const now = new Date();
          const value = calibrateTab === "ec" ? sensorData.ec : sensorData.ph;

          setRealTimeData((prev) => {
            const newData = [...prev, { time: now, value: Number(value) || 0 }];
            if (newData.length > 50) newData.shift();
            return newData;
          });
        }
      } catch (error) {
        console.error("Error fetching real-time calibration data:", error);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [open, sensorId, calibrateTab]);

  const chartOptions = {
    data: realTimeData,
    padding: { top: 10, right: 20, bottom: 10, left: 10 },
    series: [
      {
        type: "line",
        xKey: "time",
        yKey: "value",
        stroke: calibrateTab === "ec" ? "#0077FF" : "#FF5E57",
        strokeWidth: 2,
        marker: { enabled: true, size: 4 },
        tooltip: {
          renderer: ({ datum, xKey, yKey }) => {
            return {
              title: datum[xKey].toLocaleTimeString(),
              content: convert(datum[yKey]),
            };
          },
        },
      },
    ],
    axes: [
      {
        type: "time",
        position: "bottom",
        label: { format: "%H:%M:%S", fontSize: 10 },
        tick: { count: 5 },
      },
      {
        type: "number",
        position: "left",
        label: {
          fontSize: 10,
          formatter: (params) => convert(params.value.toFixed(1)),
        },
      },
    ],
    legend: { enabled: false },
    background: { visible: false },
  };

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
      toast.error("خطا در مرحله اول کالیبراسیون");
    }
  };

  const handleEcLowConfirm = async () => {
    try {
      await calibrationEc({ step: 2, ec_number: sensorId });
      toast.success("کالیبراسیون حد پایین انجام شد");
      setEcStep(3);
    } catch (error) {
      toast.error("خطا در کالیبراسیون حد پایین");
    }
  };

  const handleEcHighConfirm = async () => {
    try {
      await calibrationEc({ step: 3, ec_number: sensorId });
      await calibrationEc({ step: 4, ec_number: sensorId });
      toast.success("کالیبراسیون EC با موفقیت به پایان رسید");
      setEcStep(1);
      onClose();
    } catch (error) {
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
      toast.error("خطا در مرحله اول کالیبراسیون pH");
    }
  };

  const handlePhLowConfirm = async () => {
    try {
      await calibrationPh({ step: 2, ph_number: sensorId });
      toast.success("کالیبراسیون حد پایین pH انجام شد");
      setPhStep(3);
    } catch (error) {
      toast.error("خطا در کالیبراسیون حد پایین pH");
    }
  };

  const handlePhHighConfirm = async () => {
    try {
      await calibrationPh({ step: 3, ph_number: sensorId });
      await calibrationPh({ step: 4, ph_number: sensorId });
      toast.success("کالیبراسیون pH با موفقیت به پایان رسید");
      setPhStep(1);
      onClose();
    } catch (error) {
      toast.error("خطا در تکمیل کالیبراسیون pH");
    }
  };

  const isStep1Active = calibrateTab === "ec" ? ecStep === 1 : phStep === 1;
  const isStep2Active = calibrateTab === "ec" ? ecStep === 2 : phStep === 2;
  const isStep3Active = calibrateTab === "ec" ? ecStep === 3 : phStep === 3;

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

        <Box sx={{ display: "flex", justifyContent: "left", gap: 1, mb: 0 }}>
          <Button
            onClick={() => setCalibrateTab("ec")}
            disabled={ecStep !== 1 || phStep !== 1}
            sx={{
              bgcolor: calibrateTab === "ec" ? "#FFFFFF" : "#FFCB82",
              color: "#000",
              borderRadius: "10px 10px 0 0",
              px: 3,
              py: 0.5,
              fontWeight: "bold",
            }}
          >
            EC
          </Button>
          <Button
            onClick={() => setCalibrateTab("ph")}
            disabled={ecStep !== 1 || phStep !== 1}
            sx={{
              bgcolor: calibrateTab === "ph" ? "#FFFFFF" : "#FFCB82",
              color: "#000",
              borderRadius: "10px 10px 0 0",
              px: 3,
              py: 0.5,
              fontWeight: "bold",
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
              height: "150px",
              border: "3px solid #66bb6a",
              borderRadius: "10px",
              mb: 4,
              bgcolor: "#fff",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {realTimeData.length > 0 ? (
              <AgCharts
                options={chartOptions}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={12} color="#999">
                  در حال دریافت داده...
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: "row-reverse",
              position: "relative",
            }}
          >
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
                disabled={!isStep1Active}
                value={convert(
                  calibrateTab === "ec"
                    ? calibrateValues.ecHigh
                    : calibrateValues.phHigh,
                )}
                onChange={(e) =>
                  setCalibrateValues((prev) => ({
                    ...prev,
                    [calibrateTab === "ec" ? "ecHigh" : "phHigh"]:
                      toEnglishNumber(e.target.value),
                  }))
                }
                sx={{
                  width: "100%",
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
              {isStep3Active && (
                <Button
                  variant="contained"
                  onClick={
                    calibrateTab === "ec"
                      ? handleEcHighConfirm
                      : handlePhHighConfirm
                  }
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  تایید حد بالا
                </Button>
              )}
            </Box>

            {isStep1Active && (
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
                  onClick={
                    calibrateTab === "ec"
                      ? handleEcCalibrationStep1
                      : handlePhCalibrationStep1
                  }
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#fff",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    px: 3,
                    width: "150px",
                  }}
                >
                  شروع کالیبراسیون
                </Button>
              </Box>
            )}

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
                disabled={!isStep1Active}
                value={convert(
                  calibrateTab === "ec"
                    ? calibrateValues.ecLow
                    : calibrateValues.phLow,
                )}
                onChange={(e) =>
                  setCalibrateValues((prev) => ({
                    ...prev,
                    [calibrateTab === "ec" ? "ecLow" : "phLow"]:
                      toEnglishNumber(e.target.value),
                  }))
                }
                sx={{
                  width: "100%",
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
              {isStep2Active && (
                <Button
                  variant="contained"
                  onClick={
                    calibrateTab === "ec"
                      ? handleEcLowConfirm
                      : handlePhLowConfirm
                  }
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  تایید حد پایین
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// --- آیتم تکی نمودار سه‌گانه ---
const SensorChartItem = ({ sensor, isActive, onTimeUpdate, isModalOpen }) => {
  const [data, setData] = useState([]);

  const fetchLatest = useCallback(async () => {
    try {
      const response = await apiClient.post("/log/soluble/ec-ph-temperature/", {
        sensor_number: sensor.id,
        limit: 1000,
      });
      const array = Array.isArray(response) ? response : response.results || [];
      if (!array.length) return;

      const sortedArray = [...array]
        .sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time))
        .filter((item) => item.log_data.sensot_number === sensor.id);

      const newPoints = sortedArray.map((latest) => {
        const rawTime = latest.log_date_time;
        return {
          dateObj: new Date(rawTime),
          time: rawTime.split(" ")[1],
          ec: Number(latest.log_data.ec) || 0,
          pc: Number(latest.log_data.ph) || 0,
          temp: Number(latest.log_data.temperature) || 0,
        };
      });

      setData(newPoints);
      if (isActive && newPoints.length > 0) {
        onTimeUpdate(newPoints[newPoints.length - 1].time);
      }
    } catch (err) {
      console.error(err);
    }
  }, [sensor.id, isActive, onTimeUpdate]);

  useEffect(() => {
    fetchLatest();
    let interval = null;
    if (isActive && !isModalOpen) {
      interval = setInterval(fetchLatest, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, fetchLatest, isModalOpen]);

  const getChartOptions = (key, title, color, showXAxis) => {
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

    return {
      data: data,
      padding: { top: 5, right: 15, bottom: 5, left: 5 },
      series: [
        {
          type: "line",
          xKey: "dateObj",
          yKey: key,
          stroke: color,
          strokeWidth: 2,
          marker: { enabled: false },
        },
      ],
      axes: [
        {
          type: "time",
          position: "bottom",
          nice: true,
          label: {
            enabled: showXAxis,
            fontSize: 10,
            color: "#666",
            format: "%H:%M",
          },
          line: { enabled: showXAxis, width: 1, color: "#ccc" },
          tick: { enabled: true, color: showXAxis ? "#666" : "transparent" },
          gridStyle: [
            { stroke: "#000000", lineDash: [0], opacity: 0.15, width: 1 },
          ],
          crosshair: { enabled: true, stroke: "#999999" },
        },
        {
          type: "number",
          position: "left",
          min,
          max,
          label: {
            fontSize: 9,
            color: "#333",
            formatter: (p) => convert(p.value.toFixed(1)),
          },
          tick: { count: 3 },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  };

  const chartBoxStyle = {
    width: "98%",
    height: "100px",
    bgcolor: "#fff",
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
        <AgCharts
          options={getChartOptions("ec", "EC", "#0077FF", false)}
          style={{ height: "80%" }}
        />
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
            pH
          </Typography>
        </Box>
        <AgCharts
          options={getChartOptions("pc", "PC", "#FF5E57", false)}
          style={{ height: "80%" }}
        />
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
        <AgCharts
          options={getChartOptions("temp", "Temp", "#2ECC71", true)}
          style={{ height: "80%" }}
        />
      </Box>
    </Box>
  );
};

// --- کامپوننت اصلی با کنترل اسکرول Declarative و فیکس باگ RTL ---
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

  // مدیریت ایندکس سنسور فعال
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState("---");

  // با تغییر activeIndex، باکس اسکرول را به شکل دستی جابه‌جا می‌کنیم تا باگ کانتینرهای RTL برطرف شود
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const targetScrollLeft = activeIndex * el.clientWidth;
      el.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const slideNext = () => {
    if (activeIndex < SENSORS.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const slidePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const currentSensor = SENSORS[activeIndex] || SENSORS[0];

  return (
    <Container
      sx={{
        width: "925px",
        height: "365px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 5px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
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
          width: "100%",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: "2rem" }}>
          <Typography fontFamily={"IRANSANS"} fontWeight="bold" fontSize={12}>
            نمودار وضعیت مخزن - {currentSensor.name}
          </Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={12} color="#666">
            -- آخرین داده:{" "}
            <span style={{ direction: "ltr", display: "inline-block" }}>
              {convert(lastUpdateTime)}
            </span>
          </Typography>
        </Box>
        <Box sx={{ scale: "0.85" }}>
          <IconTextButton
            icon={assets.svg.calibrationsvg}
            text={`کالیبراسیون ${currentSensor.name}`}
            bgColor="#6CCDB0"
            textColor="black"
            height="12px"
            iconPosition="left"
            sx={{ marginLeft: "auto", fontSize: "12px", mt: "-20px" }}
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
        {/* دکمه اسلاید بعدی (راست) */}
        <IconButton
          onClick={slideNext}
          disabled={activeIndex === SENSORS.length - 1}
          sx={{
            width: "30px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            opacity: activeIndex === SENSORS.length - 1 ? 0.5 : 1,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
        </IconButton>

        {/* کانتینر چارت‌ها با غیرفعال کردن شنونده اسکرول نیتیو مزاحم */}
        <Box
          ref={scrollRef}
          sx={{
            width: "860px",
            height: "280px",
            display: "flex",
            overflowX: "hidden", // مسدود کردن اسکرول دستی و فیکس باگ
            direction: "ltr",
          }}
        >
          {SENSORS.map((sensor, index) => (
            <Box
              key={sensor.id}
              sx={{
                minWidth: "100%",
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SensorChartItem
                sensor={sensor}
                isActive={index === activeIndex}
                onTimeUpdate={(t) => setLastUpdateTime(t)}
                isModalOpen={isCalibrateOpen}
              />
            </Box>
          ))}
        </Box>

        {/* دکمه اسلاید قبلی (چپ) */}
        <IconButton
          onClick={slidePrev}
          disabled={activeIndex === 0}
          sx={{
            width: "30px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            opacity: activeIndex === 0 ? 0.5 : 1,
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
