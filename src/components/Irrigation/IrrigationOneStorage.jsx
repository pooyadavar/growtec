import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import IrrigationCard from "../../card/IrrigationCard";
import IconTextButton from "../../card/IconTextButton";
import ModalCloseButton from "../common/ModalCloseButton";
import TimeInput from "../common/TimeInput";
import {
  createIrrigationSchedule,
  deleteIrrigationSchedule,
  getIrrigationSchedules,
  getIrrigationTanksStatusLogs,
  updateIrrigationSchedule,
} from "../../api/irrigationApi";
import { getIrrigationConfig } from "../../api/configApi";
import { queryKeys } from "../../api/queryKeys";
import { uiIrrigationTankToApi } from "../../utils/tankMapping";
import { getTankZoneOptions } from "../../utils/irrigationConfig";
import { toEnglishDigits, toPersianDigits } from "../../utils/persianDigits";
import svgTikeAsset from "../../assets/svg/tike.svg";
import svgCrossAsset from "../../assets/svg/cross.svg";
import svgButtonOnAsset from "../../assets/svg/buttonOn.svg";
import svgButtonOffAsset from "../../assets/svg/buttonOff.svg";
import svgAddFieldAsset from "../../assets/svg/addField.svg";

const MANUAL_ROW_BG = "#EEEEEE";

const getDisplayStatus = (startStatus, endStatus) => {
  if (startStatus === 3 && endStatus === 3) return "tick";
  if (startStatus === 4 || endStatus === 4) return "cross";
  return "blank";
};

const getCleanTime = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.includes("T")) return timeStr.split("T")[1].substring(0, 8);
  if (timeStr.length > 8) return timeStr.substring(0, 8);
  return timeStr;
};

const convertToISO = (timeString) => {
  if (!timeString) return null;
  const parts = timeString.split(":");
  if (parts.length === 2) parts.push("00");
  return `${parts.join(":")}.000Z`;
};

const hasEndTimeOrVolume = (row) => {
  const endTime = String(row.end_time ?? "").trim();
  const volume = Number(row.volume);
  const hasVolume =
    row.volume !== "" && row.volume != null && !Number.isNaN(volume) && volume > 0;

  return endTime !== "" || hasVolume;
};

const ScheduleRow = ({ id, data, onChange, onDelete, isNew, zoneOptions }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [isZoneOpen, setIsZoneOpen] = useState(false);

  const availableZoneOptions = useMemo(() => {
    const currentZone = Number(data.zone);
    const options = [...zoneOptions];
    if (currentZone && !options.includes(currentZone)) options.push(currentZone);
    return options.sort((a, b) => a - b);
  }, [data.zone, zoneOptions]);

  const getDisplayZone = (zone) => {
    const index = availableZoneOptions.indexOf(Number(zone));
    return index >= 0 ? index + 1 : zone;
  };

  const displayStatus = getDisplayStatus(data.start_status, data.end_status);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "50px 1.2fr 1.2fr 0.7fr 1fr 0.7fr 0.7fr",
        gap: 1,
        width: "100%",
        alignItems: "center",
        padding: "8px 0",
        backgroundColor: isNew
          ? "#E3F2FD"
          : data.is_manual
            ? MANUAL_ROW_BG
            : "transparent",
        borderRadius: "8px",
        marginBottom: isNew ? "5px" : 0,
        border: isNew ? "1px dashed #2196F3" : "none",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="text"
          onClick={() => onDelete(id)}
          sx={{
            backgroundColor: "#FED9D9",
            border: "0.5px solid #CC0000",
            borderRadius: "10px",
            height: "35px",
            minWidth: "45px",
            color: "#CC0000",
            padding: "0 8px",
          }}
        >
          <Typography color="inherit" fontFamily="IRANSANS" fontSize={14}>
            حذف
          </Typography>
        </Button>
      </Box>

      <Box sx={cellSx}>
        <TimeInput
          value={data.start_time || ""}
          step="1"
          onChange={(nextValue) => onChange(id, "start_time", nextValue)}
          inputStyle={{ fontSize: "12px" }}
          iconSize={14}
        />
      </Box>

      <Box sx={cellSx}>
        <TimeInput
          value={data.end_time || ""}
          step="1"
          onChange={(nextValue) => onChange(id, "end_time", nextValue)}
          inputStyle={{ fontSize: "12px" }}
          iconSize={14}
        />
      </Box>

      <Box
        sx={{ ...cellSx, cursor: "pointer", position: "relative" }}
        onMouseDown={(e) => {
          if (isZoneOpen) return;
          e.preventDefault();
          e.stopPropagation();
          setIsZoneOpen(true);
        }}
      >
        <Select
          value={data.zone ?? ""}
          renderValue={(value) => toPersianDigits(getDisplayZone(value))}
          open={isZoneOpen}
          onOpen={() => setIsZoneOpen(true)}
          onClose={() => setIsZoneOpen(false)}
          onChange={(e) => {
            onChange(id, "zone", Number(e.target.value));
            setIsZoneOpen(false);
          }}
          variant="standard"
          disableUnderline
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            fontFamily: "IRANSANS",
            fontSize: "12px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              boxSizing: "border-box",
              py: 0,
            },
          }}
        >
          {availableZoneOptions.map((zone) => (
            <MenuItem key={zone} value={zone} sx={{ fontFamily: "IRANSANS" }}>
              {toPersianDigits(getDisplayZone(zone))}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={cellSx}>
        <input
          type="text"
          inputMode="decimal"
          value={toPersianDigits(data.volume ?? "")}
          onChange={(e) => {
            const raw = toEnglishDigits(e.target.value);
            onChange(id, "volume", raw === "" ? "" : parseInt(raw, 10));
          }}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontFamily: "IRANSANS",
            fontSize: "12px",
          }}
        />
      </Box>

      <Box
        sx={{
          ...cellSx,
          border: "0.5px solid #E0E0E0",
          backgroundColor:
            displayStatus === "tick"
              ? "#E8F5E9"
              : displayStatus === "cross"
                ? "#FFEBEE"
                : "transparent",
        }}
      >
        {displayStatus === "tick" && (
          <img src={svgTikeAsset} alt="Success" style={{ width: 16, height: 16 }} />
        )}
        {displayStatus === "cross" && (
          <img src={svgCrossAsset} alt="Error" style={{ width: 16, height: 16 }} />
        )}
      </Box>

      <Box sx={{ height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          onClick={() => {
            setIsChanging(true);
            setTimeout(() => {
              onChange(id, "is_active", !data.is_active);
              setIsChanging(false);
            }, 200);
          }}
          src={data.is_active ? svgButtonOnAsset : svgButtonOffAsset}
          alt="Toggle"
          style={{
            cursor: "pointer",
            width: "35px",
            height: "20px",
            objectFit: "contain",
            opacity: isChanging ? 0.7 : 1,
          }}
        />
      </Box>
    </Box>
  );
};

const cellSx = {
  height: "35px",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "#FFFFFF",
  overflow: "hidden",
};

const IrrigationOneStorage = ({ storageNumber }) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRows, setModalRows] = useState([]);

  const { data: irrigationConfig } = useQuery({
    queryKey: queryKeys.adminIrrigationConfig(),
    queryFn: getIrrigationConfig,
    staleTime: 5 * 60 * 1000,
  });

  const zoneOptions = useMemo(
    () => getTankZoneOptions(irrigationConfig, storageNumber),
    [irrigationConfig, storageNumber],
  );

  const { data: tankData = { current: {}, history: [] }, isError, error } = useQuery({
    queryKey: [...queryKeys.irrigationTanksStatusLogs(), storageNumber],
    queryFn: getIrrigationTanksStatusLogs,
    enabled: !!storageNumber,
    refetchInterval: 10000,
    networkMode: "always",
    retry: 1,
    placeholderData: (previousData) => previousData,
    select: (response) => {
      const allLogs = Array.isArray(response) ? response : [];
      const tankLogs = allLogs
        .filter((log) => Number(log.log_data?.number) === Number(storageNumber))
        .sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time));

      if (tankLogs.length === 0) return { current: {}, history: [] };

      return {
        current: tankLogs[tankLogs.length - 1].log_data.contents,
        history: tankLogs.map((log) => ({
          time: new Date(log.log_date_time),
          filled_volume: log.log_data.contents.filled_volume,
        })),
      };
    },
  });

  const { data: rawSchedules = [], isError: isSchedulesError, error: schedulesError } =
    useQuery({
      queryKey: queryKeys.irrigationSchedules(),
      queryFn: getIrrigationSchedules,
      refetchInterval: 60000,
      networkMode: "always",
      retry: 1,
      placeholderData: (previousData) => previousData,
      select: (response) => (Array.isArray(response) ? response : []),
    });

  const tankSchedules = useMemo(() => {
    const fallbackZone = uiIrrigationTankToApi(storageNumber);
    return rawSchedules.filter((item) =>
      zoneOptions.length > 0
        ? zoneOptions.includes(Number(item.zone))
        : Number(item.zone) === Number(fallbackZone),
    );
  }, [rawSchedules, storageNumber, zoneOptions]);

  const deleteMutation = useMutation({
    mutationFn: deleteIrrigationSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("ردیف با موفقیت حذف شد.");
    },
    onError: () => toast.error("خطا در حذف ردیف."),
  });

  const createMutation = useMutation({
    mutationFn: createIrrigationSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("برنامه آبیاری با موفقیت ایجاد شد.");
    },
    onError: () => toast.error("خطا در ایجاد برنامه آبیاری."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateIrrigationSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("برنامه آبیاری با موفقیت به روز شد.");
    },
    onError: () => toast.error("خطا در به روزرسانی برنامه آبیاری."),
  });

  const handleSettingsClick = useCallback(() => {
    setModalRows(
      tankSchedules.map((item) => ({
        ...item,
        tempId: item.id || crypto.randomUUID(),
        id: item.id,
        start_status: item.start_status !== undefined ? item.start_status : 0,
        end_status: item.end_status !== undefined ? item.end_status : 0,
        start_time: getCleanTime(item.start_time),
        end_time: getCleanTime(item.end_time),
      })),
    );
    setModalOpen(true);
  }, [tankSchedules]);

  const handleAddRow = () => {
    setModalRows((prev) => [
      {
        tempId: crypto.randomUUID(),
        start_time: "00:00:00",
        end_time: "",
        zone: zoneOptions[0] ?? uiIrrigationTankToApi(storageNumber),
        volume: "",
        is_active: true,
        start_status: 0,
        end_status: 0,
        isNew: true,
      },
      ...prev,
    ]);
  };

  const handleDeleteRow = (tempId) => {
    const row = modalRows.find((item) => item.tempId === tempId);
    if (row?.id) deleteMutation.mutate(row.id);
    else toast.success("ردیف از لیست حذف شد.");
    setModalRows((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleRowChange = (id, field, value) => {
    setModalRows((prev) =>
      prev.map((row) => (row.tempId === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSave = async () => {
    const newRows = modalRows.filter((row) => row.isNew);
    const updatedRows = modalRows.filter((row) => {
      if (row.isNew) return false;
      const original = rawSchedules.find((item) => item.id === row.id);
      if (!original) return false;
      return (
        row.start_time !== getCleanTime(original.start_time) ||
        row.end_time !== getCleanTime(original.end_time) ||
        row.zone !== original.zone ||
        row.volume !== original.volume ||
        row.is_active !== original.is_active
      );
    });

    if (newRows.length === 0 && updatedRows.length === 0) {
      toast("هیچ تغییری برای ذخیره وجود ندارد.");
      return;
    }

    if (newRows.some((row) => !hasEndTimeOrVolume(row))) {
      toast.error("برای ردیف جدید، زمان پایان یا حجم را وارد کنید.");
      return;
    }

    try {
      await Promise.all([
        ...newRows.map((row) =>
          createMutation.mutateAsync({
            is_active: row.is_active,
            start_status: 1,
            end_status: 1,
            zone: row.zone,
            volume: row.volume === "" ? 0 : row.volume,
            start_time: convertToISO(row.start_time),
            end_time: convertToISO(row.end_time),
          }),
        ),
        ...updatedRows.map((row) =>
          updateMutation.mutateAsync({
            id: row.id,
            payload: {
              is_active: row.is_active,
              start_status: row.start_status,
              end_status: row.end_status,
              zone: row.zone,
              volume: row.volume,
              start_time: convertToISO(row.start_time),
              end_time: convertToISO(row.end_time),
            },
          }),
        ),
      ]);
      toast.success("تغییرات با موفقیت ذخیره شد.");
      setModalOpen(false);
    } catch {
      toast.error("خطا در ذخیره تغییرات.");
    }
  };

  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {(isError || isSchedulesError) && (
        <Alert severity="warning" sx={{ position: "absolute", top: 8, width: "90%", maxWidth: 970 }}>
          {isError
            ? `خطا در دریافت وضعیت مخزن${error?.message ? `: ${error.message}` : ""}`
            : `خطا در دریافت برنامه آبیاری${schedulesError?.message ? `: ${schedulesError.message}` : ""}`}
        </Alert>
      )}

      <IrrigationCard
        storageNumber={storageNumber}
        storageCapacity={tankData.current?.filled_volume || 0}
        maxStorageCapacity={tankData.current?.max_volume || 0}
        float1={tankData.current?.buttom_float_switch || false}
        float2={tankData.current?.middle_float_switch || false}
        float3={tankData.current?.top_float_switch || false}
        chartData={tankData.history}
        onClickSettings={handleSettingsClick}
        irrigationScheduleItems={tankSchedules}
        zoneOptions={zoneOptions}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <ModalCloseButton onClick={() => setModalOpen(false)} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "200px",
              pt: 2,
              justifyContent: "space-between",
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
                bgcolor: "#FFFFFF",
                flexDirection: "row-reverse",
              }}
            >
              <Typography fontFamily="IRANSANS" fontSize={18} textAlign="center" flexGrow={1}>
                دستی ۱
              </Typography>
              <Box
                sx={{
                  width: "100px",
                  height: "37px",
                  borderRadius: "10px",
                  borderLeft: "0.5px solid #9F9F9F",
                  backgroundColor: "#FFCB82",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={16} textAlign="center">
                  نام برنامه
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", mb: 5, gap: 5 }}>
              <IconTextButton
                text="ذخیره"
                icon={<SaveIcon />}
                iconPosition="left"
                bgColor="#86CCB2"
                textColor="#FFFFFF"
                width="160px"
                height="40px"
                borderColor="#7dbfa7ff"
                onClick={handleSave}
                sx={{ "& .MuiTypography-root": { fontSize: "18px" } }}
              />

              <IconTextButton
                text="اضافه کردن"
                icon={<img src={svgAddFieldAsset} alt="add" style={{ width: 24, height: 24 }} />}
                iconPosition="left"
                bgColor="#FFCB82"
                textColor="#000000"
                width="160px"
                height="40px"
                borderColor="#c59b61ff"
                onClick={handleAddRow}
                sx={{ "& .MuiTypography-root": { fontSize: "18px" } }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexGrow: 1, height: "100%", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "calc(100% - 20px)", alignItems: "center" }}>
              <Typography fontFamily="IRANSANS" fontSize={12} mb={1}>
                جدول آبیاری (مخزن {toPersianDigits(storageNumber)})
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "50px 1.2fr 1.2fr 0.7fr 1fr 0.7fr 0.7fr",
                  gap: 1,
                  width: "96%",
                  marginBottom: "5px",
                }}
              >
                <Box />
                {["زمان شروع", "زمان پایان", "زون", "حجم", "وضعیت", "فعال"].map((label) => (
                  <Typography key={label} fontFamily="IRANSANS" fontSize={12} textAlign="center">
                    {label}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ width: "96%", flexGrow: 1, overflowY: "auto", overflowX: "hidden", pr: 0.5 }}>
                {modalRows.map((row) => (
                  <ScheduleRow
                    key={row.tempId}
                    id={row.tempId}
                    data={row}
                    onChange={handleRowChange}
                    onDelete={handleDeleteRow}
                    isNew={row.isNew}
                    zoneOptions={zoneOptions}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
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

export default IrrigationOneStorage;
