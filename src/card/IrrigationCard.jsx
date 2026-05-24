import * as React from "react";
import { Typography, Box, Paper, Divider, Button, Modal } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import { useMutation, useQuery } from "@tanstack/react-query"; // اضافه شد
import assets from "../assets/index";
import IconTextButton from "./IconTextButton";
import apiClient from "../api/apiClient" // اضافه شد (مسیر را در صورت نیاز چک کنید)
import { getIrrigationTanksStatus } from "../api/dashboardApi"; // اضافه شد
import toast from "react-hot-toast"; // اضافه شد

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
  // استیت‌های مودال
  const [isModalAOpen, setIsModalAOpen] = React.useState(false);

  // استیت کنترل مراحل کالیبراسیون (۱ = حد پایین، ۲ = حد بالا)
  const [calibStep, setCalibStep] = React.useState(1);

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
                title: timeString,
                content: `Volume: ${datum[yKey]}`,
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

  const fillPercentage = Math.max(
    0,
    Math.min(100, (storageCapacity / (maxStorageCapacity || 100)) * 100),
  );

  // --- API دریافت داده‌های زنده مخازن ---
  const { data: realTimeTanksData } = useQuery({
    queryKey: ["irrigationTanksStatus_calib"],
    queryFn: getIrrigationTanksStatus,
    refetchInterval: 5000,
    enabled: isModalAOpen, // فقط زمان باز بودن مودال فچ شود
  });

  const tankRealTimeData = realTimeTanksData ? realTimeTanksData[storageNumber]?.contents : null;
  const realTimeVolume = tankRealTimeData?.filled_volume ?? storageCapacity;
  const realTimeMax = tankRealTimeData?.max_volume ?? maxStorageCapacity;
  
  // محاسبه درصدی با داده‌های لایو
  const realTimeFillPercentage = Math.max(
    0,
    Math.min(100, (realTimeVolume / (realTimeMax || 100)) * 100),
  );

  // محاسبه سطح بر اساس متغیرهای احتمالی (در صورت نبود متغیر صریح، از درصد استفاده می‌کنیم)
  const realTimeLevel = tankRealTimeData?.level ?? tankRealTimeData?.water_level ?? `${realTimeFillPercentage.toFixed(0)} %`;

  // --- API کالیبراسیون مخزن (سنسور فشار) ---
  const { mutate: calibrateTankMutation } = useMutation({
    mutationFn: async (data) => {
      return await apiClient.post(
        "/calibration/calibration-pressure-sensor/",
        data,
      );
    },
    onSuccess: (data, variables) => {
      if (variables.status === "empty") {
        toast.success(
          "حجم پایین مخزن ثبت شد. لطفاً مخزن را پر کرده و مرحله بعد را انجام دهید.",
        );
        setCalibStep(2); // تغییر استیت به مرحله ۲
      } else if (variables.status === "full") {
        toast.success("کالیبراسیون مخزن با موفقیت انجام شد.");
        setIsModalAOpen(false); // بستن مودال در پایان کار
        setCalibStep(1); // ریست کردن مرحله
      }
    },
    onError: (error) => {
      console.error("Calibration Error:", error);
      toast.error("خطا در کالیبراسیون مخزن");
    },
  });

  const handleCalibrateStep1 = (e) => {
    e.stopPropagation();
    calibrateTankMutation({
      tank: "irrigation",
      tank_number: Number(storageNumber),
      status: "empty",
    });
  };

  const handleCalibrateStep2 = (e) => {
    e.stopPropagation();
    calibrateTankMutation({
      tank: "irrigation",
      tank_number: Number(storageNumber),
      status: "full",
    });
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

      {/* ===================== پیاده‌سازی مودال A ===================== */}
      <Modal
        disableAutoFocus
        open={isModalAOpen}
        onClose={(e) => {
          if (e) e.stopPropagation();
          setIsModalAOpen(false);
          setCalibStep(1); // ریست کردن مرحله هنگام بستن
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            width: "550px",
            height: "auto",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* هدر مودال A */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={18} fontWeight="bold">
              کالیبراسیون سطح مخزن {convert(storageNumber)}
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalAOpen(false);
                setCalibStep(1);
              }}
              style={{ cursor: "pointer", width: "20px", height: "20px" }}
            />
          </Box>

          {/* نمایش حجم و سطح لحظه‌ای */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              mt: 1,
              mb: 1,
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={16}>
              حجم مخزن: <strong style={{ color: "#004323" }}>{convert(realTimeVolume)}</strong> لیتر
            </Typography>
            <Typography fontFamily={"IRANSANS"} fontSize={16}>
              سطح مخزن: <strong style={{ color: "#004323" }}>{convert(realTimeLevel)}</strong>
            </Typography>
          </Box>

          {/* گرافیک سطح مخزن */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: "280px",
                height: "140px",
                borderRadius: "10px",
                border: "2px solid #9F9F9F",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: `${realTimeFillPercentage}%`,
                  backgroundColor: "#2196F3",
                  borderRadius: realTimeFillPercentage > 95 ? "8px" : "0 0 8px 8px",
                  transition: "height 0.5s ease-in-out",
                  opacity: 0.8,
                }}
              />
              <Typography
                fontFamily={"IRANSANS"}
                sx={{
                  position: "absolute",
                  top: "10px",
                  fontSize: "16px",
                  zIndex: 2,
                  color: realTimeFillPercentage > 80 ? "#fff" : "#333",
                }}
              >
                مخزن
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-around",
                  position: "absolute",
                  right: "-26px",
                  top: "-10px",
                  py: 1.5,
                  zIndex: 3,
                }}
              >
                <Box
                  sx={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1px solid #9F9F9F",
                    backgroundColor: float3 ? "#00FF85" : "white",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                />
                <Box
                  sx={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1px solid #9F9F9F",
                    backgroundColor: float2 ? "#00FF85" : "white",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                />
                <Box
                  sx={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1px solid #9F9F9F",
                    backgroundColor: float1 ? "#00FF85" : "white",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* دکمه‌های عملیات کالیبراسیون با منطق استپ ۱ و ۲ */}
          <Box sx={{ display: "flex", width: "80%", gap: 2, mt: 1 }}>
            <Button
              variant="contained"
              disabled={calibStep !== 2} // فقط در مرحله ۲ فعال است
              onClick={handleCalibrateStep2}
              sx={{
                flex: 1,
                height: "40px",
                fontSize: "15px",
                color: calibStep === 2 ? "#004323" : "#9E9E9E",
                backgroundColor: calibStep === 2 ? "#B8FFDD" : "#E0E0E0",
                borderRadius: "10px",
                border:
                  calibStep === 2
                    ? "0.5px solid #004323"
                    : "0.5px solid transparent",
                fontFamily: "IRANSANS",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: calibStep === 2 ? "#a0eed0" : "#E0E0E0",
                  boxShadow: "none",
                },
              }}
            >
              تایید حجم بالای مخزن
            </Button>
            <Button
              variant="contained"
              disabled={calibStep !== 1} // فقط در مرحله ۱ فعال است
              onClick={handleCalibrateStep1}
              sx={{
                flex: 1,
                height: "40px",
                fontSize: "15px",
                color: calibStep === 1 ? "#004323" : "#9E9E9E",
                backgroundColor: calibStep === 1 ? "#B8FFDD" : "#E0E0E0",
                borderRadius: "10px",
                border:
                  calibStep === 1
                    ? "0.5px solid #004323"
                    : "0.5px solid transparent",
                fontFamily: "IRANSANS",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: calibStep === 1 ? "#a0eed0" : "#E0E0E0",
                  boxShadow: "none",
                },
              }}
            >
              تایید حجم پایین مخزن
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default IrrigationCard;
