import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { AgCharts } from "ag-charts-react";
import assets from "../../assets";
import IconTextButton from "../../card/IconTextButton";
import apiClient from "../../api/apiClient";

// --- کامپوننت مودال کالیبراسیون (طراحی جدید) ---
const CalibrationModalContent = ({
  open,
  onClose,
  calibrateTab,
  setCalibrateTab,
  calibrateValues,
  setCalibrateValues,
}) => {
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
        {/* هدر: تب‌ها و دکمه بستن */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 0,
          }}
        >
          {/* دکمه بستن */}
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
          {/* تب‌ها */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => setCalibrateTab("ec")}
              sx={{
                bgcolor: calibrateTab === "ec" ? "#FFFFFF" : "#FFCB82",
                color: "#000",
                borderRadius: "10px 10px 0 0",
                px: 3,
                py: 0.5,
                minWidth: "unset",
                fontWeight: "bold",
                boxShadow: "0px -2px 5px rgba(0,0,0,0.05)",
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
                minWidth: "unset",
                fontWeight: "bold",
                boxShadow: "0px -2px 5px rgba(0,0,0,0.05)",
                "&:hover": {
                  bgcolor: calibrateTab === "ph" ? "#FFFFFF" : "#FFCB82",
                },
              }}
            >
              pH
            </Button>
          </Box>
        </Box>

        {/* کانتینر اصلی سفید */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "0px 15px 15px 15px",
            p: 3,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* باکس نمودار/وضعیت */}
          <Box
            sx={{
              width: "100%",
              height: "120px",
              border: "3px solid #66bb6a", // کادر سبز
              borderRadius: "10px",
              mb: 4,
              bgcolor: "#fff",
            }}
          />

          {/* بخش ورودی‌ها */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: "row-reverse", // راست به چپ
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    "& fieldset": { border: "1px solid #ccc" },
                  },
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                }}
              />

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    boxShadow: "none",
                    minWidth: "80px",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  تایید
                </Button>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#81c784",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <CheckIcon />
                </Box>
              </Box>
            </Box>

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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    "& fieldset": { border: "1px solid #ccc" },
                  },
                  "& input": { textAlign: "center", fontFamily: "IRANSANS" },
                }}
              />

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FFCB82",
                    color: "#000",
                    fontFamily: "IRANSANS",
                    borderRadius: "10px",
                    boxShadow: "none",
                    minWidth: "80px",
                    "&:hover": { bgcolor: "#ffb74d" },
                  }}
                >
                  تایید
                </Button>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#81c784",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <CheckIcon />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

// --- کامپوننت اصلی نمودار ---
const SlidingWindowChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [calibrateTab, setCalibrateTab] = useState("ec");
  const [calibrateValues, setCalibrateValues] = useState({
    ecLow: "54",
    ecHigh: "1500",
    phLow: "",
    phHigh: "",
  });

  const chartBoxStyle = {
    width: "100%",
    height: "80px",
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

  const fetchLatest = async () => {
    try {
      setError(null);
      const response = await apiClient.post("/log/soluble/mix-tank-status/", {
        limit: 50,
      });
      const array = Array.isArray(response) ? response : response.results || [];
      if (!array.length) return;

      setData((prev) => {
        const lastPointTime =
          prev.length > 0 ? prev[prev.length - 1].fullTime : null;

        const newPoints = array
          .filter((item) => {
            if (!item.log_date_time) return false;
            if (!lastPointTime) return true;
            return new Date(item.log_date_time) > new Date(lastPointTime);
          })
          .map((latest) => {
            const rawTime = latest.log_date_time;
            const timeObj = new Date(rawTime);
            const timeStr = timeObj.toLocaleTimeString("en-GB", {
              hour12: false,
            });

            return {
              fullTime: rawTime,
              time: timeStr,
              ec: latest.log_data?.ec ?? latest.log_data?.ec_ph?.ec ?? null,
              pc: latest.log_data?.pc ?? latest.log_data?.ec_ph?.ph ?? null,
              temp:
                latest.log_data?.temperature ??
                latest.log_data?.ec_ph?.temperature ??
                null,
            };
          });

        if (newPoints.length === 0) return prev;
        const combinedData = [...prev, ...newPoints];
        return combinedData.slice(-20);
      });
    } catch (err) {
      setError(err.message || "خطا در دریافت داده نمودار");
    }
  };

  const intervalRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    fetchLatest();
    intervalRef.current = setInterval(fetchLatest, 15000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const getChartOptions = (key, title, color, shape) => {
    const validData = data.filter((d) => typeof d[key] === "number");
    let min = 0;
    let max = 10;

    if (validData.length > 0) {
      const values = validData.map((d) => d[key]);
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      const buffer = (dataMax - dataMin) * 0.2 || 1;
      min = dataMin - buffer;
      max = dataMax + buffer;
    }

    return {
      data: validData,
      padding: { top: 5, right: 15, bottom: 5, left: 5 },
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: key,
          yName: title,
          stroke: color,
          strokeWidth: 2.5,
          marker: {
            enabled: true,
            shape: shape,
            size: 5,
            fill: color,
            stroke: "#fff",
            strokeWidth: 1,
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: { fontSize: 8, color: "#666" },
          line: { width: 1, color: "#ccc" },
          gridStyle: [{ stroke: undefined }],
        },
        {
          type: "number",
          position: "left",
          min: min,
          max: max,
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
          <Typography fontFamily={"IRANSANS"}>
            نمودار وضعیت مخزن (EC / PC / Temp)
          </Typography>
        </Box>
        <Box>
          <IconTextButton
            icon={assets.svg.calibrationsvg}
            text={"کالیبراسیون سنسور"}
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
          gap: 4,
        }}
      >
        <Button
          sx={{
            color: "#8A8A8A",
            minWidth: "20px",
            width: "20px",
            height: "30px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            visibility: "visible",
            p: 0,
          }}
        >
          <img src={assets.svg.right} alt="right" style={{ width: "8px" }} />
        </Button>

        <Box
          sx={{
            width: "860px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            mt: "-8px",
            mr: "-20px",
          }}
        >
          {/* EC Chart */}
          <Box sx={chartBoxStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
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
                options={getChartOptions("ec", "EC", "#0077FF", "circle")}
                style={{ height: "80%" }}
              />
            </Box>
          </Box>

          {/* PC Chart */}
          <Box sx={chartBoxStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
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
                options={getChartOptions("pc", "PC", "#FF5E57", "square")}
                style={{ height: "80%" }}
              />
            </Box>
          </Box>

          {/* Temp Chart */}
          <Box sx={chartBoxStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
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
              <AgCharts
                options={getChartOptions("temp", "Temp", "#2ECC71", "triangle")}
                style={{ height: "80%" }}
              />
            </Box>
          </Box>
        </Box>

        <Button
          sx={{
            color: "#8A8A8A",
            minWidth: "20px",
            width: "20px",
            height: "30px",
            borderRadius: "5px",
            backgroundColor: "#E3E3E3",
            border: "0.5px solid #9F9F9F",
            visibility: "visible",
            p: 0,
          }}
        >
          <img src={assets.svg.left} alt="left" style={{ width: "8px" }} />
        </Button>
      </Box>

      {/* مودال کالیبراسیون */}
      <CalibrationModalContent
        open={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
        calibrateTab={calibrateTab}
        setCalibrateTab={setCalibrateTab}
        calibrateValues={calibrateValues}
        setCalibrateValues={setCalibrateValues}
      />
    </Container>
  );
};

export default SlidingWindowChart;
