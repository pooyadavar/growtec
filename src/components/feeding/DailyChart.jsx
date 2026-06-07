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
import {
  getSolubleEcPhTemperatureLogs,
  parseSolubleEcPhLogs,
} from "../../api/logsApi";
import { queryKeys } from "../../api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  const [isStarted, setIsStarted] = useState(false);
  const [lowConfirmed, setLowConfirmed] = useState(false);
  const [highConfirmed, setHighConfirmed] = useState(false);

  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    if (open) {
      setIsStarted(false);
      setLowConfirmed(false);
      setHighConfirmed(false);
      setRealTimeData([]);
    }
  }, [open, calibrateTab, sensorId]);

  const { data: liveSensorData } = useQuery({
    queryKey: queryKeys.solubleEcPhTemperature(),
    queryFn: getSolubleEcPhTemperature,
    enabled: open,
    refetchInterval: open ? 1000 : false,
  });

  useEffect(() => {
    if (!open || !liveSensorData) return;
    const sensorData = liveSensorData[String(sensorId)];
    if (!sensorData) return;

    const now = new Date();
    const value = calibrateTab === "ec" ? sensorData.ec : sensorData.ph;
    setRealTimeData((prev) => {
      const newData = [...prev, { time: now, value: Number(value) || 0 }];
      if (newData.length > 50) newData.shift();
      return newData;
    });
  }, [open, sensorId, calibrateTab, liveSensorData]);

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

  const handleStartCalibration = async () => {
    const isEc = calibrateTab === "ec";
    const valLow = isEc ? calibrateValues.ecLow : calibrateValues.phLow;
    const valHigh = isEc ? calibrateValues.ecHigh : calibrateValues.phHigh;

    if (!valLow || !valHigh) {
      toast.error(`لطفا هر دو مقدار ${isEc ? "EC" : "pH"} را وارد کنید`);
      return;
    }

    try {
      const payload = isEc
        ? {
            step: 1,
            ec_number: sensorId,
            buffer_ec_low: Number(valLow),
            buffer_ec_high: Number(valHigh),
          }
        : {
            step: 1,
            ph_number: sensorId,
            buffer_ph_low: Number(valLow),
            buffer_ph_high: Number(valHigh),
          };

      if (isEc) {
        await calibrationEc(payload);
      } else {
        await calibrationPh(payload);
      }

      toast.success("مرحله اول کالیبراسیون با موفقیت انجام شد");
      setIsStarted(true);
    } catch (error) {
      toast.error("خطا در مرحله اول کالیبراسیون");
    }
  };

  const checkCompletion = async (newLowStatus, newHighStatus) => {
    if (newLowStatus && newHighStatus) {
      try {
        if (calibrateTab === "ec") {
          await calibrationEc({ step: 4, ec_number: sensorId });
        } else {
          await calibrationPh({ step: 4, ph_number: sensorId });
        }
        toast.success("کالیبراسیون به طور کامل با موفقیت به پایان رسید");
        onClose();
      } catch (error) {
        toast.error("خطا در تکمیل نهایی کالیبراسیون");
      }
    }
  };

  const handleLowConfirm = async () => {
    try {
      if (calibrateTab === "ec") {
        await calibrationEc({ step: 2, ec_number: sensorId });
      } else {
        await calibrationPh({ step: 2, ph_number: sensorId });
      }
      toast.success("حد پایین تایید شد");
      setLowConfirmed(true);
      checkCompletion(true, highConfirmed);
    } catch (error) {
      toast.error("خطا در تایید حد پایین");
    }
  };

  const handleHighConfirm = async () => {
    try {
      if (calibrateTab === "ec") {
        await calibrationEc({ step: 3, ec_number: sensorId });
      } else {
        await calibrationPh({ step: 3, ph_number: sensorId });
      }
      toast.success("حد بالا تایید شد");
      setHighConfirmed(true);
      checkCompletion(lowConfirmed, true);
    } catch (error) {
      toast.error("خطا در تایید حد بالا");
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

        <Box sx={{ display: "flex", justifyContent: "left", gap: 1, mb: 0 }}>
          <Button
            onClick={() => setCalibrateTab("ec")}
            disabled={isStarted}
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
            disabled={isStarted}
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
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "row-reverse",
              position: "relative",
            }}
          >
            {/* سمت راست: ورودی و دکمه حد بالا */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                width: "35%",
              }}
            >
              <Typography fontFamily="IRANSANS" color="#555">
                {calibrateTab === "ec" ? "EC بالا" : "pH بالا"}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                disabled={isStarted}
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
              {isStarted && (
                <Button
                  variant="contained"
                  onClick={handleHighConfirm}
                  disabled={highConfirmed}
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    width: "100%",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  {highConfirmed ? "تایید شد ✓" : "تایید حد بالا"}
                </Button>
              )}
            </Box>

            {/* وسط: دکمه استارت */}
            {!isStarted && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  alignSelf: "flex-end",
                  mt: "104px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleStartCalibration}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#fff",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    px: 2,
                  }}
                >
                  شروع کالیبراسیون
                </Button>
              </Box>
            )}

            {/* سمت چپ: ورودی و دکمه حد پایین */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                width: "35%",
              }}
            >
              <Typography fontFamily="IRANSANS" color="#555">
                {calibrateTab === "ec" ? "EC پایین" : "pH پایین"}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                disabled={isStarted}
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
              {isStarted && (
                <Button
                  variant="contained"
                  onClick={handleLowConfirm}
                  disabled={lowConfirmed}
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    width: "100%",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  {lowConfirmed ? "تایید شد ✓" : "تایید حد پایین"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// --- آیتم تکی نمودار سه‌گانه با لاجیک بهینه‌شده ---
const SensorChartItem = ({
  sensor,
  isActive,
  onTimeUpdate,
  isModalOpen,
}) => {
  const { data = [] } = useQuery({
    queryKey: queryKeys.solubleEcPhLog(sensor.id),
    queryFn: async () => {
      const response = await getSolubleEcPhTemperatureLogs(sensor.id);
      return parseSolubleEcPhLogs(response, sensor.id);
    },
    enabled: isActive && !isModalOpen,
    refetchInterval: isActive && !isModalOpen ? 5000 : false,
  });

  useEffect(() => {
    if (isActive && data.length > 0) {
      onTimeUpdate(data[data.length - 1].time);
    }
  }, [isActive, data, onTimeUpdate]);

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

// --- کامپوننت اصلی با رفع باگ لوپ رندر ---
const SlidingWindowChart = () => {
  const scrollRef = useRef(null);
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [calibrateTab, setCalibrateTab] = useState("ph");
  const [calibrateValues, setCalibrateValues] = useState({
    ecLow: "",
    ecHigh: "",
    phLow: "",
    phHigh: "",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState("---");

  // فیکس باگ اصلی: تابع آپدیت زمان رو با useCallback کش (Cache) کردیم که باعث رندر مجدد بچه‌ها نشه
  const handleTimeUpdate = useCallback((t) => {
    setLastUpdateTime(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const targetScrollLeft = activeIndex * el.clientWidth;
      el.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  const slideNext = () => {
    if (activeIndex < SENSORS.length - 1) setActiveIndex((prev) => prev + 1);
  };

  const slidePrev = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
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

        <Box
          ref={scrollRef}
          sx={{
            width: "860px",
            height: "280px",
            display: "flex",
            overflowX: "hidden",
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
                onTimeUpdate={handleTimeUpdate}
                isModalOpen={isCalibrateOpen}
              />
            </Box>
          ))}
        </Box>

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
