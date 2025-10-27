import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Modal,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import assets from "../../assets"; // Make sure this path is correct

// --- Custom Toggle Button (Copied from PhEcControlCard) ---
// You might want to move this to its own file later
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

// --- Styles for the Modal ---
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 510,
  bgcolor: "background.paper",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  //maxHeight: "90vh",
  overflowY: "scroll",
  direction: "rtl", // Set direction for Farsi
  height: '500px',
  overflowX: 'hidden',
};

const BuildDetailsModal = ({ open, onClose, buildDetails }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="build-details-modal-title"
      aria-describedby="build-details-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 2,
            pb: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            id="build-details-modal-title"
            variant="h6"
            component="h2"
            fontFamily={"IRANSANS"}
            fontWeight="bold"
          >
            وضعیت ساخت محلول
          </Typography>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Table Headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 0.5fr",
            gap: 1,
            width: "98%",
            mb: 1,
            backgroundColor: "#FFCB82",
            borderRadius: "5px",
            p: 0.5,
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize="12px"
            textAlign="center"
            fontWeight="bold"
          >
            وضعیت
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize="12px"
            textAlign="center"
            fontWeight="bold"
          >
            مخزن
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize="12px"
            textAlign="center"
            fontWeight="bold"
          >
            حجم
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize="12px"
            textAlign="center"
            fontWeight="bold"
          >
            نوع
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize="12px"
            textAlign="center"
            fontWeight="bold"
          >
            زمان
          </Typography>
        </Box>

        {/* Table Body */}
        <Box sx={{ flexGrow: 1, width: "100%", overflowY: "auto" }}>
          {buildDetails && buildDetails.length > 0 ? (
            buildDetails.map((detail, index) => (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 0.5fr",
                  gap: 1,
                  width: "98%",
                  mb: 0.5,
                  p: 0.5,
                  border: "0.5px solid #eee",
                  borderRadius: "5px",
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? "#eee" : "#ffffff",
                  height:"30px"
                  
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Ensure these asset paths are correct */}
                  {detail.status === "success" ? (
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
                </Box>
                
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize="10px"
                  textAlign="center"
                >
                  {detail.tank}
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize="10px"
                  textAlign="center"
                >
                  {detail.volume}
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize="10px"
                  textAlign="center"
                >
                  {detail.type}
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize="10px"
                  textAlign="center"
                >
                  {detail.time}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography
              fontFamily={"IRANSANS"}
              textAlign="center"
              mt={3}
              color="text.secondary"
            >
              هیچ جزئیاتی برای نمایش وجود ندارد.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default BuildDetailsModal;
