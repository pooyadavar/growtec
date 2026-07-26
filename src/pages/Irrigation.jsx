import React, { useState, useEffect, useMemo } from "react";
import IrrigationManyStorage from "../components/Irrigation/IrrigationManyStorage";
import IrrigationOneStorage from "../components/Irrigation/IrrigationOneStorage";
import {
  Container,
  Box,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitManualIrrigationWithSchedule,
} from "../api/irrigationApi";
import { getIrrigationConfig } from "../api/configApi";
import { queryKeys } from "../api/queryKeys";
import IconTextButton from "../card/IconTextButton";
import ModalCloseButton from "../components/common/ModalCloseButton";
import svgWatericonAsset from "../assets/svg/watericon.svg";
import toast from "react-hot-toast";
import { toPersianDigits, toEnglishDigits } from "../utils/persianDigits";
import {
  getActiveIrrigationTankIds,
  getTankZoneOptions,
} from "../utils/irrigationConfig";

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
  const queryClient = useQueryClient();

  const { data: irrigationConfig } = useQuery({
    queryKey: queryKeys.adminIrrigationConfig(),
    queryFn: getIrrigationConfig,
    staleTime: 5 * 60 * 1000,
  });

  const [manualOpen, setManualOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(1);
  const [irrigationNumber, setIrrigationNumber] = useState("");
  const [isTankSelectOpen, setIsTankSelectOpen] = useState(false);
  const [isIrrigationZoneSelectOpen, setIsIrrigationZoneSelectOpen] =
    useState(false);
  const [volume, setVolume] = useState("");
  const [duration, setDuration] = useState("");

  const tankIds = useMemo(
    () => getActiveIrrigationTankIds(irrigationConfig),
    [irrigationConfig],
  );

  const resetManualForm = () => {
    setSelectedZone(tankIds[0] ?? 1);
    setIrrigationNumber("");
    setVolume("");
    setDuration("");
  };

  const handleManualClose = () => {
    setManualOpen(false);
    resetManualForm();
  };

  const handleManualOpen = () => setManualOpen(true);

  const manualZoneOptions = useMemo(
    () => getTankZoneOptions(irrigationConfig, selectedZone),
    [irrigationConfig, selectedZone],
  );

  useEffect(() => {
    if (tankIds.length === 0) return;
    if (!tankIds.includes(Number(selectedZone))) {
      setSelectedZone(tankIds[0]);
      setIrrigationNumber("");
    }
  }, [tankIds, selectedZone]);

  useEffect(() => {
    if (manualZoneOptions.length === 0) {
      setIrrigationNumber("");
      return;
    }

    if (!manualZoneOptions.includes(Number(irrigationNumber))) {
      setIrrigationNumber(String(manualZoneOptions[0]));
    }
  }, [manualZoneOptions, irrigationNumber]);

  const handleNumberChange = (setter) => (event) => {
    const raw = toEnglishDigits(event.target.value);
    setter(raw === "" ? "" : raw);
  };

  const { mutate: submitManualIrrigationMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: submitManualIrrigationWithSchedule,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.irrigationSchedules(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.irrigationTanksStatusLogs(),
        });
        toast.success("آبیاری دستی شروع شد");
        handleManualClose();
      },
      onError: (err) => {
        console.error("Error during manual irrigation:", err);
        toast.error("خطا در آبیاری دستی");
      },
    });

  const handleManualSubmit = () => {
    if (irrigationNumber === "") {
      toast.error("لطفاً زون آبیاری را انتخاب کنید");
      return;
    }
    if (tankIds.length === 0) {
      toast.error("مخزن آبیاری فعالی وجود ندارد");
      return;
    }

    const manualPayload = { status: "start" };

    if (irrigationNumber !== "") {
      const num = parseInt(irrigationNumber, 10);
      if (!Number.isNaN(num)) manualPayload.irrigation_number = num;
    }
    if (volume !== "") {
      const vol = parseFloat(volume);
      if (!Number.isNaN(vol)) manualPayload.volume = vol;
    }
    if (duration !== "") {
      const dur = parseInt(duration, 10);
      if (!Number.isNaN(dur)) manualPayload.duration = dur;
    }

    submitManualIrrigationMutation({
      manualPayload,
      scheduleInput: {
        status: "start",
        zone: irrigationNumber,
        volume,
        duration,
      },
    });
  };

  return (
    <Container
      disableGutters
      sx={{
        mt: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        scale: 0.93,
        maxWidth: "100vw",
        overflow: "hidden",
        pb: 1,
      }}
    >
      {tankIds.length === 1 ? (
        <IrrigationOneStorage storageNumber={tankIds[0]} />
      ) : (
        <IrrigationManyStorage />
      )}

      <Box
        sx={{
          mt: 0,
          mb: 2,
          width: "100%",
          maxWidth: 970,
          display: "flex",
          justifyContent: "center",
          ml: 5,
        }}
      >
        <IconTextButton
          text="آبیاری دستی"
          icon={svgWatericonAsset}
          height="35px"
          bgColor="#3fb07a"
          borderColor="#02ad5b"
          iconPosition="left"
          onClick={handleManualOpen}
          width="200px"
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
                cursor: "pointer",
              }}
              onMouseDown={(e) => {
                if (isTankSelectOpen) return;
                e.preventDefault();
                setIsTankSelectOpen(true);
              }}
            >
              <InputLabel
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
                }}
              >
                مخزن
              </InputLabel>
              <Select
                value={selectedZone}
                open={isTankSelectOpen}
                onOpen={() => setIsTankSelectOpen(true)}
                onClose={() => setIsTankSelectOpen(false)}
                onChange={(e) => {
                  setSelectedZone(Number(e.target.value));
                  setIrrigationNumber("");
                  setIsTankSelectOpen(false);
                }}
                label="مخزن"
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                  cursor: "pointer",
                  "& .MuiSelect-select": {
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {tankIds.map((num) => (
                  <MenuItem key={num} value={num} sx={{ fontFamily: "IRANSANS" }}>
                    {toPersianDigits(num)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
                cursor: "pointer",
              }}
              onMouseDown={(e) => {
                if (isIrrigationZoneSelectOpen) return;
                e.preventDefault();
                setIsIrrigationZoneSelectOpen(true);
              }}
            >
              <InputLabel
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
                }}
              >
                زون آبیاری
              </InputLabel>
              <Select
                value={irrigationNumber}
                open={isIrrigationZoneSelectOpen}
                onOpen={() => setIsIrrigationZoneSelectOpen(true)}
                onClose={() => setIsIrrigationZoneSelectOpen(false)}
                onChange={(e) => {
                  setIrrigationNumber(String(e.target.value));
                  setIsIrrigationZoneSelectOpen(false);
                }}
                label="زون آبیاری"
                renderValue={(value) => {
                  const index = manualZoneOptions.indexOf(Number(value));
                  return toPersianDigits(index >= 0 ? index + 1 : value);
                }}
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                  cursor: "pointer",
                  "& .MuiSelect-select": {
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {manualZoneOptions.map((zone, index) => (
                  <MenuItem
                    key={zone}
                    value={String(zone)}
                    sx={{ fontFamily: "IRANSANS" }}
                  >
                    {toPersianDigits(index + 1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
