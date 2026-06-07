import * as React from "react";
import { Typography, Box, Container, Divider, Modal } from "@mui/material";
import IconTextButton from "../../card/IconTextButton";
import assets from "../../assets";
import { Scale } from "@mui/icons-material";
import CalculateIcon from "@mui/icons-material/Calculate";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import { AgCharts } from "ag-charts-react";
import apiClient from "../../api/apiClient";
import { styled } from "@mui/system";
import { toPersianDigits } from "../../utils/persianDigits";

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

const PayeshOneTimePlan = ({ fanNumber }) => {
  // Using simplified state for now, mirroring IrrigationOneStorage logic
  const [data, setData] = React.useState({
    current: null,
    history: [],
  });

  // Mock fetch or adapt if API exists
  const fetchData = React.useCallback(async () => {
    // Mock data population
    const now = new Date();
    const history = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(now.getTime() - i * 3600000),
      value: Math.random() * 100,
    })).reverse();
    
    setData({
        current: { value: 50 },
        history: history
    });
  }, [fanNumber]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartOptions = React.useMemo(() => {
    const chartData = data.history;
    return {
      data: chartData,
      padding: { top: 5, right: 15, bottom: 20, left: 5 },
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "value",
          stroke: "#0077FF",
          strokeWidth: 2,
          marker: { enabled: false },
          connectMissingValues: false,
        },
      ],
      axes: [
        {
          type: "time",
          position: "bottom",
          nice: true,
          label: { enabled: false },
          line: { enabled: false, width: 1, color: "#ccc" },
          tick: { enabled: true, color: "transparent", width: 1, size: 6 },
          gridStyle: [{ stroke: "#000000", lineDash: [0], opacity: 0.3, width: 1 }],
        },
        {
          type: "number",
          position: "left",
          min: 0,
          max: 100,
          label: {
            enabled: true,
            fontSize: 9,
            color: "#333",
            formatter: (params) => toPersianDigits(params.value),
          },
          tick: { count: 3, enabled: true },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  }, [data]);

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

  const [rows, setRows] = React.useState([
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", onDuration: "۰۰:۰۰:۰۰", offDuration: "۰۰:۰۰:۰۰" },
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", onDuration: "۰۰:۰۰:۰۰", offDuration: "۰۰:۰۰:۰۰" },
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", onDuration: "۰۰:۰۰:۰۰", offDuration: "۰۰:۰۰:۰۰" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", onDuration: "۰۰:۰۰:۰۰", offDuration: "۰۰:۰۰:۰۰" }]);
  };

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
      <Box className="irrigation-card-header" sx={{ width: "95%", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <Box sx={{ width: "250px", height: "37px", borderRadius: "10px", border: "0.5px solid #9F9F9F", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FFFFFF", flexDirection: "row-reverse" }}>
          <Typography fontFamily={"IRANSANS"} fontSize={21} textAlign={"center"} flexGrow={1}>
            {toPersianDigits(50)} 
          </Typography>
          <Box sx={{ width: "170px", height: "37px", borderRadius: "10px", borderLeft: "0.5px solid #9F9F9F", backgroundColor: "#FFCB82", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography fontFamily={"IRANSANS"} fontSize={18} textAlign={"center"}>
              وضعیت فن {fanNumber}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: "95%", height: "113px", border: "0.5px solid #9F9F9F", borderRadius: "10px", bgcolor: "#FFFFFF", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", overflow: "hidden", padding: "5px" }}>
        <Box sx={{ width: "calc(100% - 40px - 10px)", height: "calc(100% - 10px)" }}>
          <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>

      <Box className="irrigation-card-table-container" sx={{ width: "95%", bgcolor: "#FFFFFF", borderRadius: "10px", border: "0.5px solid #9F9F9F", padding: "10px 0", boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px" }}>
        <Typography color="initial" fontFamily={"IRANSANS"} fontSize={16} textAlign={"center"} marginBottom={"10px"}>
          جدول عملکرد
        </Typography>
        <Divider sx={{ width: "100%", backgroundColor: "#9F9F9F", mb: "10px" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "5px", px: "15px" }}>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>تایم شروع</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>تایم پایان</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign="center">تایم روشن</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign="center">تایم خاموش</Typography>
        </Box>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "97%", height: "50px", px: "15px" }}>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{toPersianDigits(row.startTime)}</Typography>
              </Box>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{toPersianDigits(row.endTime)}</Typography>
              </Box>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{toPersianDigits(row.onDuration)}</Typography> {/* Assuming 'onDuration' field */}
              </Box>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{toPersianDigits(row.offDuration)}</Typography> {/* Assuming 'offDuration' field */}
              </Box>
            </Box>
            {index < rows.length - 1 && <Divider sx={{ width: "100%", backgroundColor: "#E0E0E0", my: "5px" }} />}
          </React.Fragment>
        ))}
      </Box>

      <Box sx={{ width: "95%", display: "flex", justifyContent: "center", marginTop: "10px", gap: 1 }}>
        <IconTextButton text="ماشین حساب" icon={<CalculateIcon />} iconPosition="left" bgColor="#86CCB2" textColor="#000000" width="32%" height="30px" borderColor="#77b39dff" />
        <IconTextButton
          text="اضافه کردن سطر"
          icon={assets?.svg?.addField}
          iconPosition="left"
          bgColor="#FFCB82"
          textColor="#000000"
          width="32%"
          height="30px"
          borderColor="#FFCB82"
          onClick={handleAddRow}
        />
        <IconTextButton
          text="ذخیره"
          icon={assets?.svg?.Save}
          iconPosition="left"
          bgColor="#86CCB2"
          textColor="#000000"
          width="32%"
          height="30px"
          borderColor="#86CCB2"
        />
      </Box>

      <Modal open={modalOpen} onClose={handleModalClose} aria-labelledby="settings-modal-title">
        <Box sx={modalStyle}>
            {/* Simplified modal content for now, matching IrrigationOneStorage structure */}
             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "200px", pt: 2, justifyContent: "space-between" }}>
                <Box sx={{ width: "180px", height: "37px", borderRadius: "10px", border: "0.5px solid #9F9F9F", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#FFFFFF", flexDirection: "row-reverse" }}>
                    <Typography fontFamily={"IRANSANS"} fontSize={18} textAlign={"center"} flexGrow={1}>دستی ۱</Typography>
                    <Box sx={{ width: "100px", height: "37px", borderRadius: "10px", borderLeft: "0.5px solid #9F9F9F", backgroundColor: "#FFCB82", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography fontFamily={"IRANSANS"} fontSize={16} textAlign={"center"}>نام برنامه</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", mb: 5, gap: 5 }}>
                    <IconTextButton text="ذخیره" icon={<SaveIcon />} iconPosition="left" bgColor="#86CCB2" textColor="#FFFFFF" width="160px" height="40px" borderColor="#7dbfa7ff" />
                    <IconTextButton text="بارگذاری" icon={<HistoryIcon />} iconPosition="left" bgColor="#FFCB82" textColor="#000000" width="160px" height="40px" borderColor="#c59b61ff" />
                </Box>
            </Box>
            {/* Table in Modal */}
             <Box sx={{ display: "flex", flexGrow: 1, height: "100%", justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "calc(100% - 40px)", alignItems: "center", display: "flex" }}>
                    <Typography fontFamily={"IRANSANS"} fontSize={12} mb={1}>جدول برنامه</Typography>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "5px", px: "10px" }}>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign={"center"}>تایم شروع</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign={"right"}>تایم پایان</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign="center">تایم روشن</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="25%" textAlign="right">تایم خاموش</Typography>
                    </Box>
                    {/* Rows */}
                    <Box sx={{ width: "96%", flexGrow: 1, overflowY: "auto" }}>
                        {rows.concat(rows).map((row, index) => (
                            <React.Fragment key={index}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, width: "100%", height: "50px", alignItems: "center" }}>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{toPersianDigits(row.startTime)}</Typography></Box>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{toPersianDigits(row.endTime)}</Typography></Box>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{toPersianDigits(row.onDuration)}</Typography></Box> {/* Assuming 'onDuration' field */}
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{toPersianDigits(row.offDuration)}</Typography></Box> {/* Assuming 'offDuration' field */}
                                </Box>
                                <Divider sx={{ width: "100%", backgroundColor: "#E0E0E0", my: "5px" }} />
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default PayeshOneTimePlan;