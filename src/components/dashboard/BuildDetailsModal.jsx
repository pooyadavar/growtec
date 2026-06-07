import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Modal,
  Container, 
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import assets from "../../assets"; 
import { getFoodstuffSchedule } from "../../api/solubleApi";
import { queryKeys } from "../../api/queryKeys";
import { toPersianDigits } from "../../utils/persianDigits";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  height: "500px",
  direction: "rtl",
};


const HeaderBox = styled(Paper)(({ theme }) => ({
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#FFEBCC",
  border: "1px solid #FFCC80",
  borderRadius: "8px",
  fontFamily: "IRANSANS",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#E65100", 
}));

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

// --- استایل برای باکس‌های وضعیت (تیک و ضربدر) ---
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

const BuildDetailsModal = ({ open, onClose }) => {
  const { data: scheduleData } = useQuery({
    queryKey: queryKeys.foodstuffSchedule(),
    queryFn: getFoodstuffSchedule,
    enabled: open,
  });

  const details = useMemo(() => {
    const data = scheduleData?.data || scheduleData;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      time: item.time,
      tank: item.zone,
      type: item.type,
      volume: item.volume,
      status: item.status,
    }));
  }, [scheduleData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="build-details-modal-title"
      aria-describedby="build-details-modal-description"
    >
      {/* 2. اضافه کردن تگ کانتینر در اینجا */}
      <Container sx={{ p: 0 ,overflow: "scroll" , overflowX: "hidden"}}>
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
              direction: "rtl",
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", 
              gap: 1,
              width: "100%",
              mb: 1.5,
            }}
          >

            <HeaderBox>وضعیت</HeaderBox>
            <HeaderBox>مخزن</HeaderBox>
            <HeaderBox>حجم</HeaderBox>
            <HeaderBox>نوع</HeaderBox>
            <HeaderBox>زمان</HeaderBox>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
              width: "100%",
              overflowY: "auto", 
              minHeight: 0,
              pr: "4px",
            }}
          >
            {details && details.length > 0 ? (
              details.map((detail, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", 
                    gap: 1,
                    width: "100%",
                    mb: 1, // فاصله بین ردیف‌ها
                    alignItems: "center",
                  }}
                >

                  {/* سلول وضعیت (باکس آیکون) */}
                  <DataCell isStatus={true}>
                    <StatusBox status={detail.status}>
                      {detail.status === 3 ? (
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
                  <DataCell >
                    {" "}
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize="11px"
                      textAlign="center"
                    >
                      {toPersianDigits(detail.tank)}
                    </Typography>
                  </DataCell>

                  {/* سلول حجم */}
                  <DataCell>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize="11px"
                      textAlign="center"
                    >
                      {toPersianDigits(detail.volume)}
                    </Typography>
                  </DataCell>

                  {/* سلول نوع */}
                  <DataCell>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize="11px"
                      textAlign="center"
                    >
                      {toPersianDigits(detail.type)}
                    </Typography>
                  </DataCell>

                  {/* سلول زمان */}
                  <DataCell>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize="11px"
                      textAlign="center"
                    >
                      {toPersianDigits(detail.time)}
                    </Typography>
                  </DataCell>
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
      </Container>
    </Modal>
  );
};

export default BuildDetailsModal;
