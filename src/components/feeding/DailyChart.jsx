import React, { useEffect, useState, useMemo } from "react";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import assets from "../../assets";
import IconTextButton from "../../card/IconTextButton";
import apiClient from "../../api/apiClient";

const SlidingWindowChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // استایل باکس‌های جداگانه (همان استایل کد اول شما)
  const chartBoxStyle = {
    width: "100%",
    height: "80px", // کمی ارتفاع را بیشتر کردم تا نمودار خفه نشود
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "0.5px solid #9F9F9F",
    boxShadow: "rgba(15, 28, 36, 0.05) 0px 6px 15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    px: 1.5,
    overflow: "hidden", // جلوگیری از بیرون زدگی
    pt: 1,
  };

  // تابع کمکی برای اضافه کردن دیتا به آرایه لغزان
  const appendPoint = (point) => {
    setData((prev) => {
      // اگر زمان تکراری است، آپدیت کن
      if (prev.length && prev[prev.length - 1].fullTime === point.fullTime) {
        const next = [...prev];
        next[next.length - 1] = point;
        return next;
      }
      // اضافه کردن نقطه جدید
      const next = [...prev, point];
      // نگهداری فقط ۲۰ نقطه آخر (برای اینکه نمودار شلوغ نشود)
      if (next.length > 20) {
        next.shift();
      }
      return next;
    });
  };

  const fetchLatest = async () => {
    try {
      setError(null);
      const response = await apiClient.post("/log/soluble/mix-tank-status/", {
        limit: 2,
      });
      const array = Array.isArray(response) ? response : response.results || [];
      if (!array.length) return;

      const latest = array[array.length - 1];
      const rawTime = latest.log_date_time || new Date().toISOString();

      // فرمت کردن زمان به ساعت و دقیقه (خیلی مهم برای نمایش در محور افقی)
      const timeObj = new Date(rawTime);
      const timeStr = timeObj.toLocaleTimeString("en-GB", { hour12: false }); // "14:30:05"

      const point = {
        fullTime: rawTime,
        time: timeStr,
        ec: latest.log_data?.ec ?? latest.log_data?.ec_ph?.ec ?? null,
        pc: latest.log_data?.pc ?? latest.log_data?.ec_ph?.ph ?? null,
        temp:
          latest.log_data?.temperature ??
          latest.log_data?.ec_ph?.temperature ??
          null,
      };
      appendPoint(point);
    } catch (err) {
      setError(err.message || "خطا در دریافت داده نمودار");
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 2000);
    return () => clearInterval(interval);
  }, []);

  // تابع ساخت آپشن‌های نمودار به صورت پویا
  const getChartOptions = (key, title, color, shape) => {
    // فیلتر کردن دیتای معتبر برای این کلید خاص
    const validData = data.filter((d) => typeof d[key] === "number");

    // محاسبه Min/Max برای زوم کردن روی تغییرات
    let min = 0;
    let max = 10;

    if (validData.length > 0) {
      const values = validData.map((d) => d[key]);
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      // اضافه کردن کمی فاصله (Padding) به بالا و پایین اعداد
      const buffer = (dataMax - dataMin) * 0.2 || 1;
      min = dataMin - buffer;
      max = dataMax + buffer;
    }

    return {
      data: validData,
      // تنظیمات حیاتی برای نمایش در ارتفاع کم
      padding: {
        top: 5,
        right: 15,
        bottom: 5,
        left: 5,
      },
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
          // مخفی کردن خط و لیبل محور پایین برای تمیزی (چون فضا کم است)
          // اگر می‌خواهید زمان دیده شود، fontSize را 8 بگذارید
          label: { fontSize: 8, color: "#666" },
          line: { width: 1, color: "#ccc" },
          gridStyle: [{ stroke: undefined }], // حذف خطوط عمودی گرید
        },
        {
          type: "number",
          position: "left",
          min: min,
          max: max,
          label: { fontSize: 9, color: "#333" },
          tick: { count: 3 }, // فقط ۳ عدد در محور عمودی نشان بده که شلوغ نشود
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        },
      ],
      legend: { enabled: false }, // حذف راهنما چون عنوان داریم
      background: { visible: false }, // شفافیت پس زمینه
    };
  };

  return (
    <Container
      sx={{
        width: "950px",
        height: "370px", // ارتفاع کلی کانتینر را بیشتر کردیم تا ۳ تا باکس جا شود
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
            sx={{ marginLeft: "auto", fontSize: "14px" , mt:"-20px" }}
          />
        </Box>
      </Box>

      {/* {error && (
        <Alert severity="error" sx={{ width: "90%", mb: 1 }}>
          {error}
        </Alert>
      )} */}

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

        {/* Container for the 3 charts */}
        <Box
          sx={{
            width: "860px",
            display: "flex",
            flexDirection: "column",
            gap: "10px", 
            mt:"-8px",
            mr:"-20px",
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
    </Container>
  );
};

export default SlidingWindowChart;
