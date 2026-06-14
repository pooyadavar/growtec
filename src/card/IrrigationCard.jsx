import * as React from "react";
import { Typography, Box, Paper, Divider, Button } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import assets from "../assets/index";
import IconTextButton from "./IconTextButton";
import TankCalibrationModal from "../components/common/TankCalibrationModal";
import { uiIrrigationTankToApi, apiIrrigationTankToUi } from "../utils/tankMapping";
import { toPersianDigits } from "../utils/persianDigits";

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
  irrigationScheduleItems = [],
}) => {
  // استیت مودال کالیبراسیون
  const [isModalAOpen, setIsModalAOpen] = React.useState(false);
  const apiTankNumber = uiIrrigationTankToApi(storageNumber);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const getDisplayStatus = (startStatus, endStatus) => {
    if (startStatus === 3 && endStatus === 3) {
      return "tick";
    }
    if (startStatus === 4 || endStatus === 4) {
      return "cross";
    }
    return "blank";
  };

  const chartOptions = React.useMemo(() => {
    const validValues = chartData
      .map((d) => d.filled_volume)
      .filter((v) => typeof v === "number");

    let min = 0;
    if (validValues.length > 0) {
      const dataMin = Math.min(...validValues);
      const buffer = dataMin * 0.2 || 1;
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
                title: toPersianDigits(timeString),
                content: `Volume: ${toPersianDigits(datum[yKey])}`,
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
          label: {
            enabled: true,
            fontSize: 9,
            color: "#333",
            formatter: ({ value }) => toPersianDigits(value),
          },
          tick: { count: 3, enabled: true },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
          crosshair: { enabled: false },
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  }, [chartData, maxStorageCapacity]);

  const fillPercentage = Math.max(
    0,
    Math.min(100, (storageCapacity / (maxStorageCapacity || 100)) * 100),
  );

  const handleCloseModalA = (e) => {
    if (e) e.stopPropagation();
    setIsModalAOpen(false);
  };

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
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1.5,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        p: 2,
        transform: "scale(0.9)",
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
          flexShrink: 0,
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
              مخزن {toPersianDigits(storageNumber)}
            </Typography>
          </Box>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"}
            flexGrow={1}
            alignContent={"center"}
          >
            {toPersianDigits(storageCapacity)}
          </Typography>
        </Box>
        <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
          لیتر
        </Typography>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
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
          flexShrink: 0,
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

      <Box sx={{ flexShrink: 0 }}>
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
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {irrigationScheduleItems.length > 0 ? (
            irrigationScheduleItems.map((item, index) => {
              const displayStatus = getDisplayStatus(
                item.start_status,
                item.end_status,
              );

              return (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      width: "280px",
                      height: "60px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      scale: "0.9",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        color="initial"
                        fontFamily={"IRANSANS"}
                        fontSize={14}
                      >
                        زمان شروع
                      </Typography>
                      <Box
                        sx={{
                          width: "65px",
                          height: "35px",
                          border: "0.5px solid #9F9F9F",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontFamily: "IRANSANS",
                        }}
                      >
                        {toPersianDigits(formatTime(item.start_time))}
                      </Box>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color="initial"
                        fontFamily={"IRANSANS"}
                        fontSize={14}
                      >
                        زمان پایان
                      </Typography>
                      <Box
                        sx={{
                          width: "65px",
                          height: "35px",
                          border: "0.5px solid #9F9F9F",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontFamily: "IRANSANS",
                        }}
                      >
                        {toPersianDigits(formatTime(item.end_time))}
                      </Box>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color="initial"
                        fontFamily={"IRANSANS"}
                        fontSize={14}
                      >
                        زون
                      </Typography>
                      <Box
                        sx={{
                          width: "35px",
                          height: "35px",
                          border: "0.5px solid #9F9F9F",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontFamily: "IRANSANS",
                        }}
                      >
                        {toPersianDigits(apiIrrigationTankToUi(item.zone))}
                      </Box>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color="initial"
                        fontFamily={"IRANSANS"}
                        fontSize={14}
                      >
                        حجم
                      </Typography>
                      <Box
                        sx={{
                          width: "35px",
                          height: "35px",
                          border: "0.5px solid #9F9F9F",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontFamily: "IRANSANS",
                        }}
                      >
                        {toPersianDigits(item.volume)}
                      </Box>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        color="initial"
                        fontFamily={"IRANSANS"}
                        fontSize={14}
                      >
                        وضعیت
                      </Typography>
                      <Box
                        sx={{
                          width: "35px",
                          height: "35px",
                          border:
                            displayStatus === "tick"
                              ? "1px solid #4CAF50"
                              : displayStatus === "cross"
                                ? "1px solid #F44336"
                                : "0.5px solid #9F9F9F",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            displayStatus === "tick"
                              ? "#E8F5E9"
                              : displayStatus === "cross"
                                ? "#FFEBEE"
                                : "transparent",
                        }}
                      >
                        {displayStatus === "tick" && (
                          <img
                            src={assets.svg.tike}
                            alt="Success"
                            style={{ width: "16px", height: "16px" }}
                          />
                        )}
                        {displayStatus === "cross" && (
                          <img
                            src={assets.svg.cross}
                            alt="Error"
                            style={{ width: "16px", height: "16px" }}
                          />
                        )}
                      </Box>
                    </div>
                  </Box>
                  {index < irrigationScheduleItems.length - 1 && (
                    <Divider
                      sx={{ width: "100%", backgroundColor: "#9F9F9F" }}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                fontFamily="IRANSANS"
                fontSize={14}
                color="text.secondary"
              >
                برنامه‌ای موجود نیست
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            mt: "auto",
            pt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalAOpen(true);
            }}
            sx={{
              flex: 1,
              height: "55px",
              backgroundColor: "#6CCDB0",
              color: "#000",
              fontFamily: "IRANSANS",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#5bbd9e", boxShadow: "none" },
            }}
          >
            کالیبره مخزن
          </Button>

          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              if (onClickSettings) onClickSettings(e);
            }}
            sx={{
              flex: 1,
              height: "55px",
              backgroundColor: "#FFCB82",
              color: "#000",
              fontFamily: "IRANSANS",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "8px",
              boxShadow: "none",
              display: "flex",
              gap: 1,
              "&:hover": { backgroundColor: "#eeb569", boxShadow: "none" },
            }}
          >
            <img
              src={assets.svg.setting2}
              alt="settings"
              style={{ width: "18px", height: "18px" }}
            />
            تنظیمات
          </Button>
        </Box>
      </Box>

      <TankCalibrationModal
        open={isModalAOpen}
        onClose={handleCloseModalA}
        displayNumber={storageNumber}
        apiTankNumber={apiTankNumber}
        float1={float1}
        float2={float2}
        float3={float3}
        fallbackVolume={storageCapacity}
        fallbackMaxVolume={maxStorageCapacity}
      />
    </Paper>
  );
};

export default IrrigationCard;
