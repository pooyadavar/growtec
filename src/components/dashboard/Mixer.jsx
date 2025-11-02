import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system"; // Or '@mui/material/styles'
import InfoIcon from "@mui/icons-material/InfoOutlined";
import assets from "../../assets";
import BuildDetailsModal from "./BuildDetailsModal";

const CustomToggleButton = styled(Button)(({ theme, selected }) => ({
  minWidth: "unset",
  padding: "4px 6px",
  borderRadius: "8px",
  backgroundColor: selected ? "#FFEBCC" : "transparent",
  color: selected ? "#E65100" : theme.palette.text.secondary,
  border: selected ? "1px solid #FFCC80" : "1px solid #e0e0e0",
  fontSize: "0.8rem",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: selected ? "#FFEBCC" : "#f5f5f5",
  },
}));

const PhEcControlCard = ({
  contents,
  statusText,
  ecTargetValue,
  onEcTargetChange,
  reportData,
}) => {
  const [selectedStockType, setSelectedStockType] = React.useState("total");
  const column1Data = reportData && reportData[0] ? reportData[0] : [];
  const column2Data = reportData && reportData[1] ? reportData[1] : [];

  const [openBuildDetailsModal, setOpenBuildDetailsModal] =
    React.useState(false);
  const handleOpenBuildDetailsModal = () => setOpenBuildDetailsModal(true);
  const handleCloseBuildDetailsModal = () => setOpenBuildDetailsModal(false);

  let fillPercentage = 0;
  if (contents?.max_volume > 0) {
    fillPercentage = (contents.filled_volume / contents.max_volume) * 100;
  }
  fillPercentage = Math.max(0, Math.min(100, fillPercentage));
  const buildDetailsData = [
    { time: "10:30", type: "pH", volume: "50L", tank: "A", status: "success" },
    { time: "11:00", type: "EC", volume: "20L", tank: "B", status: "failed" },
    { time: "11:15", type: "pH", volume: "30L", tank: "A", status: "success" },
    { time: "12:00", type: "EC", volume: "40L", tank: "C", status: "success" },
    { time: "12:30", type: "pH", volume: "10L", tank: "B", status: "success" },
    { time: "13:00", type: "EC", volume: "25L", tank: "A", status: "failed" },
    { time: "13:45", type: "pH", volume: "60L", tank: "C", status: "success" },
    { time: "14:00", type: "EC", volume: "15L", tank: "B", status: "success" },
    { time: "10:30", type: "pH", volume: "50L", tank: "A", status: "success" },
    { time: "11:00", type: "EC", volume: "20L", tank: "B", status: "failed" },
    { time: "11:15", type: "pH", volume: "30L", tank: "A", status: "success" },
    { time: "12:00", type: "EC", volume: "40L", tank: "C", status: "success" },
    { time: "12:30", type: "pH", volume: "10L", tank: "B", status: "success" },
    { time: "13:00", type: "EC", volume: "25L", tank: "A", status: "failed" },
    { time: "13:45", type: "pH", volume: "60L", tank: "C", status: "success" },
    { time: "14:00", type: "EC", volume: "15L", tank: "B", status: "success" },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        width: "360px",
        height: "320px",
        backgroundColor: "#ffff",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        borderRadius: "10px",
        px: 1,
        pr: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            border: "0.5px solid gray",
            p: 1,
            height: "95%",
            borderRadius: "15px",
            width: "40px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#e0dedeff",
              zIndex: 0,
              borderRadius: "15px",
            }}
          />
          {/* لایه آب (پُر) */}
          <Box
            sx={{
              position: "absolute",
              left: -10,
              right: 0,
              bottom: 0,
              height: `${fillPercentage}%`, 
              backgroundColor: "#3e7dca", 
              transition: "height 0.4s ease", 
              zIndex: 1,
              borderRadius: "0 0 15px 15px",
            }}
          />
          {/* لایه فلوترها (رو) */}
          <Box
            sx={{
              position: "relative", 
              zIndex: 2, 
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {/* ... (سه دایره فلوتر داینامیک شما) ... */}
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.top_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.middle_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
            <Box
              sx={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: contents?.buttom_float_switch
                  ? "#00BBFF"
                  : "white",
                position: "relative",
                left: "15px",
                border: "0.5px solid gray",
              }}
            ></Box>
          </Box>
        </Stack>

        {/* --- Middle Section (Unchanged) --- */}
        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            border: "0.5px solid gray",
            borderRadius: "15px",
            pt: 1,
          }}
          pl={1}
          pr={0.5}
          height="97%"
        >
          <Typography
            fontFamily={"IRANSANS"}
            variant="body1"
            sx={{
              textAlign: "right",
              fontWeight: "medium",
              mb: 1,
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            استوک های ریخته شده
          </Typography>
          <Stack
            direction="row"
            gap={0}
            justifyContent={"space-between"}
            sx={{ mb: 1 }}
          >
            <CustomToggleButton
              selected={selectedStockType === "stock"}
              onClick={() => setSelectedStockType("stock")}
              size="small"
            >
              استوک
            </CustomToggleButton>
            <CustomToggleButton
              selected={selectedStockType === "total"}
              onClick={() => setSelectedStockType("total")}
              size="small"
            >
              مجموع
            </CustomToggleButton>
            <CustomToggleButton
              selected={selectedStockType === "time"}
              onClick={() => setSelectedStockType("time")}
              size="small"
            >
              زمان
            </CustomToggleButton>
          </Stack>
          <Box
            sx={{
              maxHeight: 220,
              overflowY: "scroll",
              pr: 1,
              pl: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              textAlign: "center",
            }}
          >
            {column1Data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ width: "30px", textAlign: "center" }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    variant="outlined"
                    value={item}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      width: 40,
                      backgroundColor: "#f0f0f0",
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& input": {
                        textAlign: "center",
                        padding: "8px",
                        height: "unset",
                        fontSize:"10px"
                      },
                      
                    }}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    value={
                      column2Data[index] !== undefined ? column2Data[index] : ""
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      width: 40,
                      backgroundColor: "#f0f0f0",
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& input": {
                        textAlign: "center",
                        padding: "8px",
                        height: "unset",
                        fontSize:"10px"
                      },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>

        {/* --- Left Section (Unchanged) --- */}
        <Stack
          spacing={1}
          alignItems="center"
          sx={{
            flexGrow: 1,
            maxWidth: "140px",
            height: "100%",
            borderRadius: "15px",
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              border: "0.5px solid gray",
              mt: 2,
              p: 0.5,
              borderRadius: "15px",
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: "50%",
                width: 80,
                height: 80,
                p: 0,
              }}
            >
              <img
                src={assets.svg.phlogo}
                alt="pH icon"
                style={{ width: 80, height: 80 }}
              />
            </IconButton>
            <Typography
              variant="body2"
              fontFamily={"IRANSANS"}
              sx={{ mt: 1, color: "#555", mb: 1 }}
            >
              وضعیت سیستم:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#D1E7DD",
                borderRadius: "10px",
                padding: "4px 8px",
                textAlign: "center",
                border: "0.5px solid gray",
              }}
            >
              <Typography
                variant="caption"
                fontFamily={"IRANSANS"}
                sx={{ color: "#0F5132", fontWeight: "800", fontSize: "9px" }}
              >
                {statusText || "نامشخص"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize="12px" sx={{ fontWeight: "700" }}>
              EC هدف
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={ecTargetValue || ""}
              onChange={onEcTargetChange}
              sx={{
                width: 60,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                },
                "& input": {
                  textAlign: "center",
                  padding: "8px",
                  height: "unset",
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<InfoIcon sx={{ ml: "8px" }} />}
            sx={{
              backgroundColor: "#A7D9B4",
              color: "#403f3fff",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 0",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#6CCDB0",
                boxShadow: "none",
              },
              mt: 2,
              display: "flex",
              justifyContent: "center",
              pr: 1,
              pl: 1,
            }}
          >
            <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "12px" }}>
              جزئیات ساخت
            </Typography>
          </Button>

          <Button
            variant="contained"
            startIcon={<InfoIcon sx={{ ml: "8px" }} />}
            onClick={handleOpenBuildDetailsModal}
            sx={{
              backgroundColor: "#ffebcc",
              color: "#403f3fff",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: "10px 0",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#fde0b5ff",
                boxShadow: "none",
              },
              mt: 0,
              display: "flex",
              justifyContent: "center",
              pr: 1,
              pl: 1,
            }}
          >
            <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "12px" }}>
              وضعیت محلول{" "}
            </Typography>
          </Button>
        </Stack>
      </Box>

      <BuildDetailsModal
        open={openBuildDetailsModal}
        onClose={handleCloseBuildDetailsModal}
        buildDetails={buildDetailsData}
      />
    </Paper>
  );
};

export default PhEcControlCard;
