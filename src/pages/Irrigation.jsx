import React, { useState, useEffect } from "react";
import IrrigationManyStorage from "../components/Irrigation/IrrigationManyStorage";
import IrrigationOneStorage from "../components/Irrigation/IrrigationOneStorage";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getIrrigationTanksStatusLogs,
  makeManualIrrigation,
} from "../api/irrigationApi";
import IconTextButton from "../card/IconTextButton";
import ModalCloseButton from "../components/common/ModalCloseButton";
import assets from "../assets";
import toast from "react-hot-toast";
import { toPersianDigits, toEnglishDigits } from "../utils/persianDigits";

const inputStyle = {
  paddingRight: "8px",
  width: "154px",
  height: "40px",
  borderRadius: "10px",
  border: "0.5px solid #9F9F9F",
  fontFamily: "IRANSANS",
  boxSizing: "border-box",
};

const Irrigation = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["irrigationTanksStatusLogs"],
    queryFn: getIrrigationTanksStatusLogs,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    select: (response) => {
      return Array.isArray(response) ? response : [];
    },
  });

  const [singleTankId, setSingleTankId] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [status, setStatus] = useState("start");
  const [irrigationNumber, setIrrigationNumber] = useState("");
  const [volume, setVolume] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (data) {
      const uniqueTanks = new Set(data.map((log) => log.log_data?.number));
      if (uniqueTanks.size === 1) {
        setSingleTankId([...uniqueTanks][0]);
      } else {
        setSingleTankId(null);
      }
    }
  }, [data]);

  const resetManualForm = () => {
    setStatus("start");
    setIrrigationNumber("");
    setVolume("");
    setDuration("");
  };

  const handleManualClose = () => {
    setManualOpen(false);
    resetManualForm();
  };

  const handleManualOpen = () => setManualOpen(true);

  const handleNumberChange = (setter) => (event) => {
    const raw = toEnglishDigits(event.target.value);
    setter(raw === "" ? "" : raw);
  };

  const { mutate: makeManualIrrigationMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: makeManualIrrigation,
      onSuccess: () => {
        toast.success(
          status === "start" ? "آبیاری دستی شروع شد" : "آبیاری دستی پایان یافت",
        );
        handleManualClose();
      },
      onError: (err) => {
        console.error("Error creating manual irrigation:", err);
        toast.error("خطا در آبیاری دستی");
      },
    });

  const handleManualSubmit = () => {
    const payload = { status };

    if (irrigationNumber !== "") {
      const num = parseInt(irrigationNumber, 10);
      if (!Number.isNaN(num)) payload.irrigation_number = num;
    }
    if (volume !== "") {
      const vol = parseFloat(volume);
      if (!Number.isNaN(vol)) payload.volume = vol;
    }
    if (duration !== "") {
      const dur = parseInt(duration, 10);
      if (!Number.isNaN(dur)) payload.duration = dur;
    }

    makeManualIrrigationMutation(payload);
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Alert severity="error">
          خطا در بارگیری وضعیت مخازن: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      disableGutters
      sx={{
        mt: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {singleTankId ? (
        <IrrigationOneStorage storageNumber={singleTankId} />
      ) : (
        <IrrigationManyStorage />
      )}

      <Box sx={{ mt: 0.5, mb: 1 , ml: 5}}>
        <IconTextButton
          text="آبیاری دستی"
          icon={assets.svg.watericon}
          bgColor="#3fb07a"
          borderColor="#02ad5b"
          iconPosition="left"
          onClick={handleManualOpen}
          width="240px"
          textColor="#fff"
        />
      </Box>

      <Modal open={manualOpen} onClose={handleManualClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            width: "220px",
            p: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={14} fontWeight="bold">
              آبیاری دستی
            </Typography>
            <ModalCloseButton onClick={handleManualClose} />
          </Box>
          <Box
            style={{
              width: "154px",
              display: "flex",
              flexDirection: "column",
              gap: 17,
            }}
          >
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
                }}
              >
                وضعیت
              </InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="وضعیت"
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
              >
                <MenuItem value="start" sx={{ fontFamily: "IRANSANS" }}>
                  شروع
                </MenuItem>
                <MenuItem value="finish" sx={{ fontFamily: "IRANSANS" }}>
                  پایان
                </MenuItem>
              </Select>
            </FormControl>
            <input
              type="text"
              inputMode="numeric"
              placeholder="شماره آبیاری"
              value={toPersianDigits(irrigationNumber)}
              onChange={handleNumberChange(setIrrigationNumber)}
              style={inputStyle}
            />
            <input
              type="text"
              inputMode="decimal"
              placeholder="حجم"
              value={toPersianDigits(volume)}
              onChange={handleNumberChange(setVolume)}
              style={inputStyle}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="مدت (ثانیه)"
              value={toPersianDigits(duration)}
              onChange={handleNumberChange(setDuration)}
              style={inputStyle}
            />
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handleManualSubmit}
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
                fontFamily: "IRANSANS",
                fontSize: 18,
                boxShadow: "none",
              }}
            >
              ارسال
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Irrigation;
