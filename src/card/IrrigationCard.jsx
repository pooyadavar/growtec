import * as React from "react";
import {
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { AgCharts } from "ag-charts-react";
import assets from "../assets/index";
import IconTextButton from "./IconTextButton";

const IrrigationCard = ({
  storageNumber,
  storageCapacity,
  maxStorageCapacity,
  float1,
  float2,
  float3,
  chartData = [],
  onClick,
  onClickSettings,
  irrigationScheduleItems = [], // New prop for schedule data
}) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = String(num || 0);
    for (let c of str) {
      if (!isNaN(parseInt(c, 10))) {
        res += numbers.charAt(c);
      } else {
        res += c;
      }
    }
    return res;
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    // Return the time string directly as it is already in HH:mm:ss format
    return isoString;
  };

  const chartOptions = React.useMemo(() => {
    const validValues = chartData
      .map((d) => d.filled_volume)
      .filter((v) => typeof v === "number");

    let min = 0;
    if (validValues.length > 0) {
      const dataMin = Math.min(...validValues);
      const buffer = (dataMin) * 0.2 || 1; 
      min = Math.max(0, dataMin - buffer);
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
        label: { enabled: false },
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
        min,
        max: maxStorageCapacity || 100,
        label: { enabled: true, fontSize: 9, color: "#333" },
        tick: { count: 3, enabled: true },
        gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        crosshair: { enabled: false },
      },
    ],
    legend: { enabled: false },
    background: { visible: false },
    };
  }, [chartData, maxStorageCapacity]);

  return (
    <Paper
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
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "102px",
              height: "37px",
              borderRadius: "10px",
              borderRight: "0.5px solid #9F9F9F",
              backgroundColor: "#FFCB82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
            textAlign={"center"}
            flexGrow={1}
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
            overflow: "hidden",
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
        <Box sx={{ flexGrow: 1, overflowY: "auto", display: 'flex', flexDirection: 'column', gap: 1 }}>
        {irrigationScheduleItems.length > 0 ? (
          irrigationScheduleItems.map((item, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  width: "280px",
                  height: "79",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontFamily: 'IRANSANS'
                    }}
                  >
                    {convert(formatTime(item.start_time))}
                  </Box>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontFamily: 'IRANSANS'
                    }}
                  >
                     {convert(formatTime(item.end_time))}
                  </Box>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontFamily: 'IRANSANS'
                    }}
                  >
                    {convert(item.zone)}
                  </Box>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontFamily: 'IRANSANS'
                    }}
                  >
                    {/* Assuming volume is large number from sample, might need handling if it's too long */}
                    {convert(item.volume)}
                  </Box>
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
                      border: item.is_active ? "1px solid #4CAF50" : "1px solid #F44336",
                      borderRadius: "10px",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: item.is_active ? "#E8F5E9" : "#FFEBEE",
                    }}
                  >
                     {item.is_active ? (
                        <img src={assets.svg.tike} alt="Active" style={{ width: '16px', height: '16px' }} />
                      ) : (
                        <img src={assets.svg.cross} alt="Inactive" style={{ width: '16px', height: '16px' }} />
                      )}
                  </Box>
                </div>
              </Box>
              {index < irrigationScheduleItems.length - 1 && (
                <Divider sx={{ width: "100%", backgroundColor: "#9F9F9F" }} />
              )}
            </React.Fragment>
          ))
        ) : (
             <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography fontFamily="IRANSANS" fontSize={14} color="text.secondary">
                   برنامه‌ای موجود نیست
                </Typography>
             </Box>
        )}
        </Box>
        
        {/* Settings Button */}
        <Box sx={{ width: "246px", marginLeft:"17px" , display: "flex", justifyContent: "center" , mb:1 }}>
          <IconTextButton
            text="تغییر تنظیمات"
            icon={assets.svg.setting2}
            iconPosition="left"
            bgColor="#FFCB82"
            textColor="#000000"
            width="246px"
            height="30px"
            borderColor="#FFCB82"
            onClick={onClickSettings}
            sx={{
              justifyContent: "center",
              gap: 2,
              '& .MuiTypography-root': {
                fontSize: '18px',
                marginLeft: '20px'
              }
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default IrrigationCard;