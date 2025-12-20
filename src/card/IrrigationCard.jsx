import * as React from "react";
import {
  Typography,
  Box,
  Paper, // Changed from Container to Paper
  Divider,
} from "@mui/material";
import { AgCharts } from "ag-charts-react";
import assets from "../assets/index"; // مسیر `src/card` به `src/assets`
import IconTextButton from "./IconTextButton"; // ایمپورت دکمه از فایل هم‌جوار

const IrrigationCard = ({
  storageNumber,
  storageCapacity,
  maxStorageCapacity, // Accept new prop
  float1,
  float2,
  float3,
  chartData = [], // Default to empty array
  onClick,
}) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = String(num || 0); // اطمینان از اینکه ورودی رشته است
    for (let c of str) {
      // فقط اعداد را تبدیل کن
      if (!isNaN(parseInt(c, 10))) {
        res += numbers.charAt(c);
      } else {
        res += c; // کاراکترهای دیگر (مانند "/") را حفظ کن
      }
    }
    return res;
  };

  const chartOptions = React.useMemo(() => {
    // Calculate min for y-axis dynamically
    const validValues = chartData
      .map((d) => d.filled_volume)
      .filter((v) => typeof v === "number");

    let min = 0;
    if (validValues.length > 0) {
      const dataMin = Math.min(...validValues);
      const buffer = (dataMin) * 0.2 || 1; // Buffer only for min to not clip data
      min = Math.max(0, dataMin - buffer); // Ensure min doesn't go below 0 for volume
    }

    return {
    data: chartData,
    padding: { top: 5, right: 15, bottom: 5, left: 5 },
    series: [
      {
        type: "line",
        xKey: "time",
        yKey: "filled_volume",
        stroke: "#0077FF",
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
                content: `Volume: ${datum[yKey]}`,
              };
            },
        }
      },
    ],
    axes: [
      {
        type: "time",
        position: "bottom",
        nice: true,
        label: { enabled: false }, // Keep X-axis labels hidden due to small space
        line: { enabled: false, width: 1, color: "#ccc" },
        tick: {
            enabled: true,
            color: "transparent",
            width: 1,
            size: 6,
          },
        gridStyle: [
            {
              stroke: "#000000",
              lineDash: [0],
              opacity: 0.3,
              width: 1,
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
        min, // Apply dynamic min
        max: maxStorageCapacity || 100, // Use maxStorageCapacity directly
        label: { enabled: true, fontSize: 9, color: "#333" }, // Enable Y-axis labels
        tick: { count: 3, enabled: true }, // Enable Y-axis ticks
        gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        crosshair: { enabled: false },
      },
    ],
    legend: { enabled: false },
    background: { visible: false },
    };
  }, [chartData, maxStorageCapacity]);

  return (
    <Paper // Changed from Container to Paper
      onClick={onClick}
      sx={{
        width: "293px",
        height: "640px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        p:2,
        transform:"scale(0.9)",
        "&:hover": onClick ? { transform: "scale(1.02)" } : {},
      }}
    >
      <Box
        className="irrigation-card-title"
        sx={{
          width: "220px",
          height: "37px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "180px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // اضافه شد برای تراز عمودی
          }}
        >
          <Box
            sx={{
              width: "102px",
              height: "37px",
              borderRadius: "10px", // اصلاح شد (قبلاً 10px 0 0 10px بود)
              borderRight: "0.5px solid #9F9F9F", // کادر جداکننده
              backgroundColor: "#FFCB82",
              display: "flex", // اضافه شد
              alignItems: "center", // اضافه شد
              justifyContent: "center", // اضافه شد
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              textAlign={"center"}
            >
              مخزن {convert(storageNumber)}
            </Typography>
          </Box>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"} // وسط‌چین شد
            flexGrow={1} // فضای باقی‌مانده را پر می‌کند
            alignContent={"center"}
          >
            {convert(storageCapacity)}
          </Typography>
        </Box>
        <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
          لیتر
        </Typography>
      </Box>
      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          نمودار سطح مخزن در طول روز
        </Typography>
      </Box>
      <Box
        sx={{
          width: "259px",
          height: "113px",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-around",
          marginRight: "10px",
        }}
      >
        <Box
          sx={{
            width: "237px",
            height: "113px",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            overflow: "hidden", // Ensure chart doesn't overflow
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
           <AgCharts
             options={chartOptions}
             style={{ width: "90%", height: "85%" }}
           />
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-around",
            position: "relative",
            right: "-19px",
          }}
        >
          {/* ... فلوترها بدون تغییر ... */}
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float3 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float2 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float1 ? "#00FF85" : "white",
            }}
          ></div>
        </div>
      </Box>
      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
        >
          جدول آبیاری
        </Typography>
      </Box>
      <Box
        className="irrigation-card-table"
        sx={{
          width: "280px",
          height: "283px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* ... جدول خالی (بدون تغییر) ... */}
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              حجم
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>
        <Divider
          sx={{
            width: "100%",
            backgroundColor: "#9F9F9F",
          }}
        />
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* ... ردیف دوم ... */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              حجم
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>
        <Divider
          sx={{
            width: "100%",
            backgroundColor: "#9F9F9F",
          }}
        />
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* ... ردیف سوم ... */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              حجم
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>
        
        {/* --- دکمه تعویض شده --- */}
        <Box sx={{ width: "246px", marginLeft:"17px" , display: "flex", justifyContent: "center" , mb:1 }}>
          <IconTextButton
            text="تغییر تنظیمات"
            icon={assets.svg.setting2} // استفاده از asset
            iconPosition="left" // آیکون در سمت چپ بود
            bgColor="#FFCB82"
            textColor="#000000"
            width="246px"
            height="30px"
            borderColor="#FFCB82" // کادر همرنگ پس‌زمینه
            sx={{
              justifyContent: "center", // بازنویسی برای وسط‌چین کردن
              gap: 2, // ایجاد فاصله بین آیکون و متن
              // بازنویسی فونت برای مطابقت با دکمه اصلی
              '& .MuiTypography-root': {
                fontSize: '18px',
                marginLeft: '20px' // شبیه‌سازی marginLeft={5} اصلی
              }
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default IrrigationCard;