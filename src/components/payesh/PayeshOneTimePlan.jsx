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

  const chartOptions = React.useMemo(() => {
    const chartData = data.history;
    return {
      data: chartData,
      padding: { top: 5, right: 15, bottom: 5, left: 5 },
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
          label: { enabled: true, fontSize: 9, color: "#333" },
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

  const tableData = [
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", zone: 1, volume: "", status: "green" },
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", zone: 1, volume: "", status: "red" },
    { startTime: "۰۰:۰۰:۰۰", endTime: "۰۰:۰۰:۰۰", zone: 1, volume: "", status: "green" },
  ];

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
            {convert(50)} 
          </Typography>
          <Box sx={{ width: "170px", height: "37px", borderRadius: "10px", borderLeft: "0.5px solid #9F9F9F", backgroundColor: "#FFCB82", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography fontFamily={"IRANSANS"} fontSize={18} textAlign={"center"}>
              وضعیت فن {fanNumber}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: "95%", height: "113px", border: "0.5px solid #9F9F9F", borderRadius: "10px", bgcolor: "#FFFFFF", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", overflow: "hidden" }}>
        <Box sx={{ width: "calc(100% - 40px)", height: "80%" }}>
          <AgCharts options={chartOptions} style={{ width: "90%", height: "100%" }} display={"flex"} justifyContent={"center"} alignItems={"center"} />
        </Box>
      </Box>

      <Box className="irrigation-card-table-container" sx={{ width: "95%", bgcolor: "#FFFFFF", borderRadius: "10px", border: "0.5px solid #9F9F9F", padding: "10px 0", boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px" }}>
        <Typography color="initial" fontFamily={"IRANSANS"} fontSize={16} textAlign={"center"} marginBottom={"10px"}>
          جدول عملکرد
        </Typography>
        <Divider sx={{ width: "100%", backgroundColor: "#9F9F9F", mb: "10px" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "5px", px: "15px" }}>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>زمان شروع</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>زمان پایان</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="15%" textAlign="center">زون</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="15%" textAlign="center">مقدار</Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="15%" textAlign="center">وضعیت</Typography>
        </Box>
        {tableData.map((row, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "97%", height: "50px", px: "15px" }}>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{convert(row.startTime)}</Typography>
              </Box>
              <Box sx={{ width: "25%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{convert(row.endTime)}</Typography>
              </Box>
              <Box sx={{ width: "15%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{convert(row.zone)}</Typography>
              </Box>
              <Box sx={{ width: "15%", height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography fontFamily={"IRANSANS"} fontSize={14}>{convert(row.volume)}</Typography>
              </Box>
              <DataCell sx={{ width: "10%" }} isStatus={true}>
                <StatusBox status={row.status === "green" ? 3 : 0}>
                  {row.status === "green" ? <img src={assets.svg.tike} alt="success" style={{ width: 16, height: 16 }} /> : <img src={assets.svg.cross} alt="failed" style={{ width: 16, height: 16 }} />}
                </StatusBox>
              </DataCell>
            </Box>
            {index < tableData.length - 1 && <Divider sx={{ width: "100%", backgroundColor: "#E0E0E0", my: "5px" }} />}
          </React.Fragment>
        ))}
      </Box>

      <Box sx={{ width: "95%", display: "flex", justifyContent: "center", marginTop: "10px", gap: 6 }}>
        <IconTextButton text="ماشین حساب" icon={<CalculateIcon />} iconPosition="left" bgColor="#86CCB2" textColor="#000000" width="30%" height="30px" borderColor="#77b39dff" />
        <IconTextButton text="تغییر تنظیمات" icon={<SettingsIcon />} iconPosition="left" bgColor="#FFCB82" textColor="#000000" width="30%" height="30px" borderColor="#c59b61ff" onClick={handleModalOpen} />
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
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="19%" textAlign={"center"}>زمان شروع</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="12%" textAlign={"right"}>زمان پایان</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="10%" textAlign="center">زون</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="15%" textAlign="center">حجم</Typography>
                        <Typography fontFamily={"IRANSANS"} fontSize={12} width="15%" textAlign="right">وضعیت</Typography>
                    </Box>
                    {/* Rows */}
                    <Box sx={{ width: "96%", flexGrow: 1, overflowY: "auto" }}>
                        {tableData.concat(tableData).map((row, index) => (
                            <React.Fragment key={index}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 1, width: "100%", height: "50px", alignItems: "center" }}>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{convert(row.startTime)}</Typography></Box>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{convert(row.endTime)}</Typography></Box>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{convert(row.zone)}</Typography></Box>
                                    <Box sx={{ height: "35px", border: "0.5px solid #9F9F9F", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography fontFamily={"IRANSANS"} fontSize={12}>{convert(row.volume)}</Typography></Box>
                                    <DataCell isStatus={true}>
                                        <StatusBox status={row.status === "green" ? 3 : 0}>
                                            {row.status === "green" ? <img src={assets.svg.tike} alt="success" style={{ width: 16, height: 16 }} /> : <img src={assets.svg.cross} alt="failed" style={{ width: 16, height: 16 }} />}
                                        </StatusBox>
                                    </DataCell>
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