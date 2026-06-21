import * as React from "react";
import { Typography, Box, Container, Divider, Modal, CircularProgress, Alert } from "@mui/material";
import IconTextButton from "../../card/IconTextButton"; // ایمپورت دکمه
import assets from "../../assets";
import { Scale } from "@mui/icons-material";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import { AgCharts } from "ag-charts-react";
import { useQuery } from "@tanstack/react-query";
import { getIrrigationTanksStatusLogs } from "../../api/irrigationApi";
import { toPersianDigits } from "../../utils/persianDigits";
import { styled } from "@mui/system";
import Calculator from "../tools/Calculator";
import ModalCloseButton from "../common/ModalCloseButton";

const DataCell = styled(Box)(({ theme, isStatus, hasBorder = false }) => ({
  height: "40px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  padding: "0 4px",
  ...(isStatus && {
    backgroundColor: "transparent",
    border: "none",
  }),
}));

const StatusBox = styled(Box)(({ theme, status }) => ({
  height: "40px",
  width: "100%",
  border: status === 3 ? "1px solid #4CAF50" : "1px solid #F44336",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: status === 3 ? "#E8F5E9" : "#FFEBEE",
}));

const IrrigationOneStorage = ({ storageNumber }) => {
  const { data: irrigationTankStatusLogs, isLoading, isError, error } = useQuery({
    queryKey: ["irrigationTanksStatusLogs", storageNumber],
    queryFn: getIrrigationTanksStatusLogs,
    enabled: !!storageNumber, // Only fetch if storageNumber is available
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 10000,
    cacheTime: 5 * 60 * 1000,
    select: (response) => {
      const allLogs = Array.isArray(response) ? response : [];

      // Filter for this specific storage number
      const tankLogs = allLogs.filter(
        (log) => log.log_data.number === storageNumber
      );

      // Sort by date
      const sortedLogs = [...tankLogs].sort(
        (a, b) => new Date(a.log_date_time) - new Date(b.log_date_time)
      );

      if (sortedLogs.length > 0) {
        const history = sortedLogs.map((log) => ({
          time: new Date(log.log_date_time),
          filled_volume: log.log_data.contents.filled_volume,
        }));
        // Latest log
        const current = sortedLogs[sortedLogs.length - 1].log_data.contents;

        return { current, history };
      }
      return { current: null, history: [] };
    },
  });

  const tankData = irrigationTankStatusLogs || { current: null, history: [] };

  const chartOptions = React.useMemo(() => {
    const chartData = tankData.history;
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
                content: toPersianDigits(`Volume: ${datum[yKey]}`),
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
          max: tankData.current?.max_volume || 100,
          label: {
            enabled: true,
            fontSize: 9,
            color: "#333",
            formatter: (params) => toPersianDigits(params.value),
          },
          tick: { count: 3, enabled: true },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
          crosshair: { enabled: false },
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  }, [tankData]);


  const calculatorModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    bgcolor: "#F0F0F0",
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: "15px",
    display: "block",
    overflow: "auto",
    fontFamily: "IRANSANS",
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 430, 
    bgcolor: "#F0F0F0", 
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 2, 
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "IRANSANS",
  };


  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [calculatorModalOpen, setCalculatorModalOpen] = React.useState(false);
  const handleCalculatorModalOpen = () => setCalculatorModalOpen(true);
  const handleCalculatorModalClose = () => setCalculatorModalOpen(false);

  const tableData = [
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "green",
    },
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "red",
    },
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "green",
    },
  ];

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Alert severity="error">خطا در بارگیری وضعیت مخزن: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        width: "825px",
        height: "max-content",
        paddingY: "20px",
        bgcolor: "#F0F0F0",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        py: 6,
        transform: "scale(0.85)",
      }}
    >
      {/* بخش بالای کارت: حجم مخزن */}
      <Box
        className="irrigation-card-header"
        sx={{
          width: "95%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "250px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            flexDirection: "row-reverse",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"}
            flexGrow={1}
          >
            {toPersianDigits(tankData.current?.filled_volume || 0)}
          </Typography>
          <Box
            sx={{
              width: "170px",
              height: "37px",
              borderRadius: "10px",
              borderLeft: "0.5px solid #9F9F9F",
              backgroundColor: "#FFCB82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={18}
              textAlign={"center"}
            >
              حجم فعلی مخزن
            </Typography>
          </Box>
        </Box>
        <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
          لیتر
        </Typography>
      </Box>

      {/* Placeholder برای نمودار سطح مخزن */}
      <Box
        sx={{
          width: "95%",
          height: "113px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          bgcolor: "#FFFFFF",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "60px",
            position: "relative",
            left: "20px",
            marginRight: "30px",
          }}
        >
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: tankData.current?.top_float_switch
                ? "#00FF85"
                : "#FFFFFF",
            }}
          ></Box>
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: tankData.current?.middle_float_switch
                ? "#00FF85"
                : "#FFFFFF",
            }}
          ></Box>
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: tankData.current?.buttom_float_switch
                ? "#00FF85"
                : "#FFFFFF",
            }}
          ></Box>
        </Box>
        <Box sx={{ width: "calc(100% - 40px)", height: "80%" }}>
          <AgCharts
            options={chartOptions}
            style={{ width: "90%", height: "100%" }}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          />
        </Box>
      </Box>

      {/* [اصلاح شد] - بخش جدول آبیاری */}
      <Box
        className="irrigation-card-table-container"
        sx={{
          width: "95%",
          bgcolor: "#FFFFFF",
          borderRadius: "10px",
          border: "0.5px solid #9F9F9F",
          padding: "10px 0",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
        }}
      >
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          marginBottom={"10px"}
        >
          جدول آبیاری
        </Typography>
        <Divider
          sx={{ width: "100%", backgroundColor: "#9F9F9F", mb: "10px" }}
        />

        {/* [اصلاح شد] - سربرگ جدول */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // استفاده از space-between
            width: "100%", // عرض کامل
            marginBottom: "5px",
            px: "15px", // پدینگ داخلی
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="25%"
            textAlign={"center"}
          >
            زمان شروع
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="25%"
            textAlign={"center"}
          >
            زمان پایان
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            زون
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            حجم
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            وضعیت
          </Typography>
        </Box>

        {/* [اصلاح شد] - ردیف‌های جدول */}
        {tableData.map((row, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", // استفاده از space-between
                alignItems: "center",
                width: "97%", // عرض کامل
                height: "50px",
                px: "15px", // پدینگ داخلی
              }}
            >
              {/* ستون زمان شروع */}
              <Box
                sx={{
                  width: "25%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {toPersianDigits(row.startTime)}
                </Typography>
              </Box>
              {/* ستون زمان پایان */}
              <Box
                sx={{
                  width: "25%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {toPersianDigits(row.endTime)}
                </Typography>
              </Box>
              {/* ستون زون */}
              <Box
                sx={{
                  width: "15%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {toPersianDigits(row.zone)}
                </Typography>
              </Box>
              {/* ستون حجم */}
              <Box
                sx={{
                  width: "15%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {toPersianDigits(row.volume)}
                </Typography>
              </Box>
              {/* [جدید] - ستون وضعیت (آیکون‌ها) */}
              <DataCell sx={{ width: "10%" }} isStatus={true}>
                <StatusBox status={row.status === "green" ? 3 : 0}>
                  {row.status === "green" ? (
                    <img
                      src={assets.svg.tike}
                      alt="success"
                      style={{ width: 16, height: 16 }}
                    />
                  ) : (
                    <img
                      src={assets.svg.cross}
                      alt="failed"
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </StatusBox>
              </DataCell>
            </Box>
            {index < tableData.length - 1 && (
              <Divider
                sx={{ width: "100%", backgroundColor: "#E0E0E0", my: "5px" }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>


      {/* ========= پایان مودال ========= */}

      {/* ========= Calculator Modal ========= */}
      <Modal
        open={calculatorModalOpen}
        onClose={handleCalculatorModalClose}
        aria-labelledby="calculator-modal-title"
      >
        <Box sx={calculatorModalStyle}>
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <ModalCloseButton onClick={handleCalculatorModalClose} />
          </Box>
          <Calculator onClose={handleCalculatorModalClose} />
        </Box>
      </Modal>
    </Container>
  );
};

export default IrrigationOneStorage;
