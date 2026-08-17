import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Container,
  Modal,
  Typography,
  Divider,
  Alert,
  Collapse,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import ModalCloseButton from "../common/ModalCloseButton";
import NavArrowButton from "../common/NavArrowButton";
import IrrigationCard from "../../card/IrrigationCard";
import IconTextButton from "../../card/IconTextButton";
import svgTikeAsset from "../../assets/svg/tike.svg";
import svgCrossAsset from "../../assets/svg/cross.svg";
import svgButtonOnAsset from "../../assets/svg/buttonOn.svg";
import svgButtonOffAsset from "../../assets/svg/buttonOff.svg";
import svgAddFieldAsset from "../../assets/svg/addField.svg";
import SaveIcon from "@mui/icons-material/Save";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  batchDeleteIrrigationSchedules,
  getIrrigationTanksStatusLogs,
  getIrrigationStatus,
  getIrrigationSchedules,
  createIrrigationSchedule,
  createIrrigationSchedules,
  updateIrrigationSchedule,
  deleteIrrigationSchedule,
} from "../../api/irrigationApi";
import { getIrrigationConfig } from "../../api/configApi";
import { queryKeys } from "../../api/queryKeys";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";
import { uiIrrigationTankToApi } from "../../utils/tankMapping";
import {
  getActiveIrrigationTankIds,
  getActiveIrrigationZonesForTank,
  getTankZoneOptions,
  formatIrrigationStatusText,
} from "../../utils/irrigationConfig";
import { getIrrigationScheduleDisplayStatus } from "../../utils/irrigationScheduleStatus";
import { buildRowsFromIrrigationProgramFile } from "../../utils/irrigationProgramFile";
import TimeInput from "../common/TimeInput";

const MANUAL_ROW_BG = "#EEEEEE";
const SCHEDULE_GRID_COLUMNS =
  "50px 1.2fr 1.2fr 0.7fr 1fr 0.7fr 0.9fr 0.7fr";

const hasEndTimeOrVolume = (row) => {
  const endTime = String(row.end_time ?? "").trim();
  const volume = Number(row.volume);
  const hasVolume =
    row.volume !== "" && row.volume != null && !Number.isNaN(volume) && volume > 0;

  return endTime !== "" || hasVolume;
};

const convertToISO = (timeString) => {
  if (!timeString) return null;
  const parts = timeString.split(":");
  if (parts.length === 2) parts.push("00");
  return `${parts.join(":")}.000Z`;
};

const buildSchedulePayload = (row, { forceReadyStatus = false } = {}) => ({
  is_active: row.is_active,
  is_manual: false,
  start_status: forceReadyStatus ? 1 : (row.start_status ?? 1),
  end_status: forceReadyStatus ? 1 : (row.end_status ?? 1),
  volume_status: row.volume_status ?? 0,
  zone: row.zone,
  volume: row.volume === "" ? 0 : row.volume,
  start_time: convertToISO(row.start_time),
  end_time: convertToISO(row.end_time),
});

const renderStatusIcon = (status) => {
  switch (status) {
    case "tick":
      return (
        <img
          src={svgTikeAsset}
          alt="Success"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case "cross":
      return (
        <img
          src={svgCrossAsset}
          alt="Error"
          style={{ width: "16px", height: "16px" }}
        />
      );
    case "blank":
    default:
      return null;
  }
};

const statusCellSx = (status) => ({
  height: "35px",
  border:
    status === "tick"
      ? "1px solid #4CAF50"
      : status === "cross"
        ? "1px solid #F44336"
        : "0.5px solid #E0E0E0",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    status === "tick"
      ? "#E8F5E9"
      : status === "cross"
        ? "#FFEBEE"
        : "#FFFFFF",
});

const ScheduleRow = ({
  id,
  data,
  onChange,
  onDelete,
  isNew,
  zoneOptions = [],
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [isZoneOpen, setIsZoneOpen] = useState(false);

  const handleToggleActive = () => {
    setIsChanging(true);
    setTimeout(() => {
      onChange(id, "is_active", !data.is_active);
      setIsChanging(false);
    }, 200);
  };

  const displayStatus = getIrrigationScheduleDisplayStatus(data);
  const volumeStatus =
    data.volume_status === null ||
    data.volume_status === undefined ||
    data.volume_status === ""
      ? "-"
      : data.volume_status;
  const availableZoneOptions = useMemo(() => {
    const currentZone = Number(data.zone);
    const options = [...zoneOptions];
    if (currentZone && !options.includes(currentZone)) {
      options.push(currentZone);
    }
    return options.sort((a, b) => a - b);
  }, [data.zone, zoneOptions]);
  const getDisplayZone = (zone) => {
    const index = availableZoneOptions.indexOf(Number(zone));
    return index >= 0 ? index + 1 : zone;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: SCHEDULE_GRID_COLUMNS,
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
        marginBottom: isNew ? "5px" : "0",
        border: isNew ? "1px dashed #2196F3" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Delete Button (moved to left) */}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          variant="text"
          onClick={() => onDelete(id)}
          sx={{
            backgroundColor: "#FED9D9",
            border: "0.5px solid #CC0000",
            borderRadius: "10px",
            width: "auto",
            height: "35px",
            minWidth: "45px",
            color: "#CC0000",
            "&:hover": {
              backgroundColor: "#E0B3B3",
            },
            padding: "0 8px",
          }}
        >
          <Typography color="inherit" fontFamily={"IRANSANS"} fontSize={14}>
            حذف
          </Typography>
        </Button>
      </Box>

      {/* Start Time */}
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <TimeInput
          value={data.start_time || ""}
          step="1"
          onChange={(nextValue) => onChange(id, "start_time", nextValue)}
          inputStyle={{ fontSize: "12px" }}
          iconSize={14}
        />
      </Box>

      {/* End Time */}
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <TimeInput
          value={data.end_time || ""}
          step="1"
          onChange={(nextValue) => onChange(id, "end_time", nextValue)}
          inputStyle={{ fontSize: "12px" }}
          iconSize={14}
        />
      </Box>

      {/* Zone */}
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          fontFamily: "IRANSANS",
          fontSize: "12px",
          color: "#333",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
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
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              py: 0,
              cursor: "pointer",
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

      {/* Volume */}
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
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

      {/* Status (Derived Display) */}
      <Box sx={statusCellSx(displayStatus)}>
        {renderStatusIcon(displayStatus)}
      </Box>

      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Typography fontFamily="IRANSANS" fontSize={12}>
          {toPersianDigits(volumeStatus)}
        </Typography>
      </Box>

      {/* Status 2 (is_active toggle) */}
      <Box
        sx={{
          height: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          onClick={handleToggleActive}
          src={data.is_active ? svgButtonOnAsset : svgButtonOffAsset}
          alt="Toggle"
          style={{
            cursor: "pointer",
            width: "35px",
            height: "20px",
            objectFit: "contain",
            opacity: isChanging ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        />
      </Box>
    </Box>
  );
};

const IrrigationManyStorage = () => {
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [modalRows, setModalRows] = useState([]);
  const programFileInputRef = useRef(null);

  // Fetch real-time tank data
  const { data: tanksData = {}, isError: isTanksError, error: tanksError } =
    useQuery({
    queryKey: queryKeys.irrigationTanksStatusLogs(),
    queryFn: getIrrigationTanksStatusLogs,
    refetchInterval: 10000,
    networkMode: "always",
    retry: 1,
    placeholderData: (previousData) => previousData,
    select: (response) => {
      const data = Array.isArray(response) ? response : [];
      const sortedData = [...data].sort(
        (a, b) => new Date(a.log_date_time) - new Date(b.log_date_time),
      );

      const grouped = {};
      sortedData.forEach((log) => {
        const num = log.log_data.number;
        if (!grouped[num]) {
          grouped[num] = {
            current: null,
            history: [],
          };
        }
        grouped[num].history.push({
          time: new Date(log.log_date_time),
          filled_volume: log.log_data.contents.filled_volume,
        });
        grouped[num].current = log.log_data.contents;
      });
      return grouped;
    },
  });

  const {
    data: rawSchedules = [],
    isError: isSchedulesError,
    error: schedulesError,
  } = useQuery({
    queryKey: queryKeys.irrigationSchedules(),
    queryFn: getIrrigationSchedules,
    refetchInterval: 5000,
    networkMode: "always",
    retry: 1,
    placeholderData: (previousData) => previousData,
    select: (response) => {
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: irrigationConfig } = useQuery({
    queryKey: queryKeys.adminIrrigationConfig(),
    queryFn: getIrrigationConfig,
    staleTime: 5 * 60 * 1000,
  });

  const { data: irrigationStatus = [] } = useQuery({
    queryKey: queryKeys.irrigationStatus(),
    queryFn: getIrrigationStatus,
    refetchInterval: 5000,
    placeholderData: (previousData) => previousData,
  });

  const deleteIrrigationScheduleMutation = useMutation({
    mutationFn: deleteIrrigationSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("ردیف با موفقیت حذف شد.");
    },
    onError: (error) => {
      console.error("Error deleting schedule:", error);
      toast.error("خطا در حذف ردیف.");
    },
  });

  const createIrrigationScheduleMutation = useMutation({
    mutationFn: createIrrigationSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("برنامه آبیاری با موفقیت ایجاد شد.");
    },
    onError: (error) => {
      console.error("Error creating irrigation schedule:", error);
      toast.error("خطا در ایجاد برنامه آبیاری.");
    },
  });

  const updateIrrigationScheduleMutation = useMutation({
    mutationFn: ({ id, payload }) => updateIrrigationSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("برنامه آبیاری با موفقیت به روز شد.");
    },
    onError: (error) => {
      console.error("Error updating irrigation schedule:", error);
      toast.error("خطا در به روزرسانی برنامه آبیاری.");
    },
  });

  const tankIds = useMemo(
    () => getActiveIrrigationTankIds(irrigationConfig),
    [irrigationConfig],
  );

  const slide = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 323;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const scrollPos = Math.abs(el.scrollLeft);

    setCanScrollLeft(scrollPos > 1);
    setCanScrollRight(scrollPos < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, tankIds.length]);

  // Helper to extract HH:mm:ss from a time string
  const getCleanTime = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.includes("T")) return timeStr.split("T")[1].substring(0, 8);
    if (timeStr.length > 8) return timeStr.substring(0, 8);
    return timeStr;
  };

  const getZoneOptions = useCallback(
    (tankId) => getTankZoneOptions(irrigationConfig, tankId),
    [irrigationConfig],
  );

  const handleSettingsClick = (id) => {
    const zoneOptions = getZoneOptions(id);
    const fallbackZone = uiIrrigationTankToApi(id);
    setSelectedTankId(id);
    const filteredRows = rawSchedules
      .filter((item) =>
        zoneOptions.length > 0
          ? zoneOptions.includes(Number(item.zone))
          : item.zone === fallbackZone,
      )
      .map((item) => ({
        ...item,
        tempId: item.id || crypto.randomUUID(),
        id: item.id, // Store original API ID
        start_status: item.start_status !== undefined ? item.start_status : 0,
        end_status: item.end_status !== undefined ? item.end_status : 0,
        volume_status: item.volume_status !== undefined ? item.volume_status : 0,
        // Clean time for inputs
        start_time: getCleanTime(item.start_time),
        end_time: getCleanTime(item.end_time),
      }));
    setModalRows(filteredRows);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTankId(null);
    setModalRows([]);
  };

  // CRUD Operations for Modal
  const handleAddRow = () => {
    const zoneOptions = getZoneOptions(selectedTankId);
    const newRow = {
      tempId: crypto.randomUUID(),
      start_time: "00:00:00",
      end_time: "",
      zone: zoneOptions[0] ?? uiIrrigationTankToApi(selectedTankId),
      volume: "",
      is_active: true,
      start_status: 0,
      end_status: 0,
      volume_status: 0,
      isNew: true,
    };
    setModalRows((prev) => [newRow, ...prev]);
  };

  const handleProgramFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text());
      const importedRows = buildRowsFromIrrigationProgramFile(
        payload,
        getZoneOptions(selectedTankId),
      );
      if (importedRows.length === 0) {
        toast.error("ردیف قابل استفاده برای این مخزن پیدا نشد.");
        return;
      }
      const zoneOptions = getZoneOptions(selectedTankId);
      const fallbackZone = uiIrrigationTankToApi(selectedTankId);
      const ids = rawSchedules
        .filter((item) =>
          zoneOptions.length > 0
            ? zoneOptions.includes(Number(item.zone))
            : item.zone === fallbackZone,
        )
        .map((row) => row.id)
        .filter(Boolean);
      if (ids.length > 0) {
        await batchDeleteIrrigationSchedules(ids);
        queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      }
      setModalRows(importedRows);
      toast.success("قبلی‌ها حذف شد؛ برنامه زمانی آماده جایگزین جدول شد.");
    } catch {
      toast.error("فایل برنامه زمانی نامعتبر است.");
    }
  };

  const handleDeleteRow = (tempIdToDelete) => {
    const rowToDelete = modalRows.find((row) => row.tempId === tempIdToDelete);

    if (rowToDelete && rowToDelete.id) {
      deleteIrrigationScheduleMutation.mutate(rowToDelete.id);
    } else {
      toast.success("ردیف از لیست حذف شد.");
    }
    setModalRows((prev) => prev.filter((row) => row.tempId !== tempIdToDelete)); // Optimistic update
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
      const original = rawSchedules.find((r) => r.id === row.id);
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

    const createPromises =
      newRows.length > 1
        ? [
            createIrrigationSchedules(
              newRows.map((row) =>
                buildSchedulePayload(row, { forceReadyStatus: true }),
              ),
            ),
          ]
        : newRows.map((row) =>
            createIrrigationScheduleMutation.mutateAsync(
              buildSchedulePayload(row, { forceReadyStatus: true }),
            ),
          );

    const updatePromises = updatedRows.map((row) => {
      const payload = buildSchedulePayload(row);
      return updateIrrigationScheduleMutation.mutateAsync({ id: row.id, payload });
    });

    try {
      await Promise.all([...createPromises, ...updatePromises]);
      queryClient.invalidateQueries({ queryKey: queryKeys.irrigationSchedules() });
      toast.success("تغییرات با موفقیت ذخیره شد.");
      handleModalClose();
    } catch (error) {
      console.error("Error during batch save/update:", error);
      toast.error("خطا در ذخیره تغییرات.");
    }
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

  const selectedTankZoneOptions = getZoneOptions(selectedTankId);

  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "0px",
        gap: 0,
      }}
    >
      {(isTanksError || isSchedulesError) && (
        <Alert severity="warning" sx={{ width: "100%", maxWidth: 970, mb: 0.5 }}>
          {isTanksError
            ? `خطا در دریافت وضعیت مخازن${tanksError?.message ? `: ${tanksError.message}` : ""}`
            : `خطا در دریافت برنامه آبیاری${schedulesError?.message ? `: ${schedulesError.message}` : ""}`}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1030px",
        }}
      >
      <NavArrowButton
        direction="next"
        onClick={() => slide("right")}
        disabled={!canScrollRight}
        sx={{
          width: "30px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollRight ? 1 : 0.5,
          zIndex: 10,
        }}
      />

      <Box
        ref={scrollRef}
        sx={{
          width: "970px",
          height: "600px",
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "auto",
          overflowY: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          padding: 0,
          marginTop: "-8px",
          marginBottom: "-8px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {tankIds.map((id) => {
          const apiTankKey = uiIrrigationTankToApi(id);
          const tank = tanksData[apiTankKey] ?? tanksData[String(apiTankKey)];
          const current = tank ? tank.current : {};
          const history = tank ? tank.history : [];
          const zoneOptions = getZoneOptions(id);
          const activeIrrigationZones = getActiveIrrigationZonesForTank(
            irrigationConfig,
            id,
            irrigationStatus,
          );

          const tankSchedules = rawSchedules.filter((s) =>
            zoneOptions.length > 0
              ? zoneOptions.includes(Number(s.zone))
              : s.zone === apiTankKey,
          );

          return (
            <Box
              key={id}
              sx={{
                flexShrink: 0,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: "scale(0.96)",
                transformOrigin: "center",
                position:"relative",
                top:"-15px"
              }}
            >
              <Typography
                fontFamily="IRANSANS"
                fontSize={13}
                fontWeight="bold"
                color={activeIrrigationZones.length > 0 ? "#1565C0" : "#666"}
                sx={{ height: 22, mb: -1 }}
              >
                {toPersianDigits(
                  formatIrrigationStatusText(activeIrrigationZones),
                )}
              </Typography>
              <IrrigationCard
                storageNumber={id}
                storageCapacity={current?.filled_volume || 0}
                maxStorageCapacity={current?.max_volume || 0}
                float1={current?.buttom_float_switch || false}
                float2={current?.middle_float_switch || false}
                float3={current?.top_float_switch || false}
                chartData={history}
                onClickSettings={() => handleSettingsClick(id)}
                irrigationScheduleItems={tankSchedules}
                zoneOptions={zoneOptions}
                allSchedulesLoading={false}
              />
            </Box>
          );
        })}
      </Box>

      <NavArrowButton
        direction="prev"
        onClick={() => slide("left")}
        disabled={!canScrollLeft}
        sx={{
          width: "30px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollLeft ? 1 : 0.5,
          zIndex: 10,
        }}
      />

      </Box>

      {/* Settings Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="settings-modal-title"
      >
        <Box sx={modalStyle}>
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <ModalCloseButton onClick={handleModalClose} />
          </Box>
          {/* Sidebar (Buttons) */}
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
            {/* Header / Title */}
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
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                flexGrow={1}
              >
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
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={16}
                  textAlign={"center"}
                >
                  نام برنامه
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", mb: 5, gap: 5 }}
            >
              <input
                ref={programFileInputRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={handleProgramFileChange}
              />
              <IconTextButton
                text="برنامه زمانی آماده"
                icon={<SaveIcon />}
                iconPosition="left"
                bgColor="#FFFFFF"
                textColor="#000000"
                width="160px"
                height="40px"
                borderColor="#c59b61ff"
                onClick={() => programFileInputRef.current?.click()}
                sx={{ "& .MuiTypography-root": { fontSize: "12px" } }}
              />

              {/* Save Button */}
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

              {/* Add Button (Replaces History/Load) */}
              <IconTextButton
                text="اضافه کردن"
                icon={
                  svgAddFieldAsset ? (
                    <img
                      src={svgAddFieldAsset}
                      alt="add"
                      style={{ width: 24, height: 24 }}
                    />
                  ) : null
                } // Removed HistoryIcon fallback
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

          {/* Table Container */}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "calc(100% - 20px)",
                alignItems: "center",
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={12} mb={1}>
                جدول آبیاری (مخزن{" "}
                {selectedTankId ? toPersianDigits(selectedTankId) : ""})
              </Typography>

              {/* Table Header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: SCHEDULE_GRID_COLUMNS,
                  gap: 1,
                  width: "96%",
                  marginBottom: "5px",
                  px: "0px",

                }}
              >
                <Box /> {/* Empty for delete button column */}
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  textAlign={"center"}
                >
                  زمان شروع
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  textAlign={"center"}
                >
                  زمان پایان
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  textAlign={"center"}
                >
                  زون
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  textAlign={"center"}
                >
                  حجم
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  textAlign={"center"}
                >
                  وضعیت
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={10}
                  textAlign={"center"}
                >
                  آب‌رفته
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={10}
                  textAlign={"center"}
                >
                  فعال/غیرفعال
                </Typography>
              </Box>

              {/* Table Body */}
              <Box
                sx={{
                  width: "96%",
                  flexGrow: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 1,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                <TransitionGroup>
                  {modalRows.map((row) => (
                    <Collapse key={row.tempId}>
                      <ScheduleRow
                        id={row.tempId}
                        data={row}
                        onChange={handleRowChange}
                        onDelete={handleDeleteRow}
                        isNew={row.isNew}
                        zoneOptions={selectedTankZoneOptions}
                      />
                      <Divider sx={{ my: 1 }} />
                    </Collapse>
                  ))}
                </TransitionGroup>

                {modalRows.length === 0 && (
                  <Typography
                    fontFamily={"IRANSANS"}
                    fontSize={14}
                    textAlign="center"
                    mt={2}
                  >
                    داده‌ای موجود نیست. دکمه اضافه کردن را بزنید.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default IrrigationManyStorage;
