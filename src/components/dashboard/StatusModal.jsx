import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Modal,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { getMixTankStatus } from "../../api/solubleApi";
import { queryKeys } from "../../api/queryKeys";
import { toPersianDigits } from "../../utils/persianDigits";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  direction: "rtl",
  outline: "none", 
};

const HeaderBox = styled(Paper)(({ theme }) => ({
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#FFEBCC",
  border: "1px solid #FFCC80",
  borderRadius: "8px",
  fontFamily: "IRANSANS",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#E65100",
}));

const DataCell = styled(Box)(({ theme }) => ({
  minHeight: "40px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  padding: "8px",
  textAlign: "center",
}));

const FIELD_TRANSLATIONS = {
  stock_injection_volume: "حجم تزریق استوک",
  acid_injection_volume: "حجم تزریق اسید",
  stock_injection_count: "تعداد تزریق استوک",
  acid_injection_count: "تعداد تزریق اسید",
};

const StatusModal = ({ open, onClose, title }) => {
  const { data: mixTankData } = useQuery({
    queryKey: queryKeys.mixTankStatusDetail(),
    queryFn: getMixTankStatus,
    enabled: open,
  });

  const details = useMemo(() => {
    const data = mixTankData?.detail || {};
    return Object.entries(data).map(([key, value]) => ({
      name: FIELD_TRANSLATIONS[key] || key,
      value: value,
    }));
  }, [mixTankData]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="status-modal-title"
      aria-describedby="status-modal-description"
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
          }}
        >
          <Typography
            id="status-modal-title"
            variant="h6"
            component="h2"
            fontFamily={"IRANSANS"}
            fontWeight="bold"
          >
            {title || "جزئیات وضعیت"}
          </Typography>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            width: "100%",
            mb: 1.5,
          }}
        >
          <HeaderBox>وضعیت</HeaderBox>
          <HeaderBox>پارامتر</HeaderBox>
        </Box>

        {/* Data Rows */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            pr: "4px",
          }}
        >
          {details && details.length > 0 ? (
            details.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  width: "100%",
                  mb: 1,
                  alignItems: "center",
                }}
              >
                {/* Status Cell (Name) */}
                <DataCell>
                  <Typography fontFamily={"IRANSANS"} fontSize="12px">
                    {item.name}
                  </Typography>
                </DataCell>

                {/* Parameter Cell (Value) */}
                <DataCell>
                  <Typography fontFamily={"IRANSANS"} fontSize="12px">
                    {toPersianDigits(item.value)}
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
    </Modal>
  );
};

export default StatusModal;