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
  IconButton,
  Modal,
  Typography,
  Divider,
  CircularProgress,
  Collapse,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IrrigationCard from "../../card/IrrigationCard";
import apiClient from "../../api/apiClient";
import IconTextButton from "../../card/IconTextButton";
import assets from "../../assets";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/system";
import toast from "react-hot-toast";

// Styled components for the modal
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

// Helper function to determine display status
const getDisplayStatus = (startStatus, endStatus) => {
  if (startStatus === 3 && endStatus === 3) {
    return "tick";
  }
  if (startStatus === 4 || endStatus === 4) {
    return "cross";
  }
  return "blank";
};

const ScheduleRow = ({ id, data, onChange, onDelete, convert, isNew }) => {
  const [isChanging, setIsChanging] = useState(false);

  const handleToggleActive = () => {
    setIsChanging(true);
    setTimeout(() => {
      onChange(id, "is_active", !data.is_active);
      setIsChanging(false);
    }, 200);
  };

  const displayStatus = getDisplayStatus(data.start_status, data.end_status);

  const statusContent = useMemo(() => {
    switch (displayStatus) {
      case "tick":
        return (
          <img
            src={assets.svg.tike}
            alt="Success"
            style={{ width: "16px", height: "16px" }}
          />
        );
      case "cross":
        return (
          <img
            src={assets.svg.cross}
            alt="Error"
            style={{ width: "16px", height: "16px" }}
          />
        );
      case "blank":
      default:
        return null;
    }
  }, [displayStatus]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "50px 1.2fr 1.2fr 0.7fr 1fr 0.7fr 0.7fr", // Delete button moved to start
        gap: 1,
        width: "100%",
        alignItems: "center",
        padding: "8px 0",
        backgroundColor: isNew ? "#E3F2FD" : "transparent",
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
        <input
          type="time"
          step="1"
          value={data.start_time || ""}
          onChange={(e) => onChange(id, "start_time", e.target.value)}
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
        <input
          type="time"
          step="1"
          value={data.end_time || ""}
          onChange={(e) => onChange(id, "end_time", e.target.value)}
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

      {/* Zone (Read-Only) */}
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#E0E0E0",
          fontFamily: "IRANSANS",
          fontSize: "12px",
          color: "#333",
        }}
      >
        {convert(data.zone)}
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
          type="number"
          value={data.volume}
          onChange={(e) => onChange(id, "volume", parseInt(e.target.value))}
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
      <Box
        sx={{
          height: "35px",
          border: "0.5px solid #E0E0E0",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            displayStatus === "tick"
              ? "#E8F5E9"
              : displayStatus === "cross"
                ? "#FFEBEE"
                : "transparent",
        }}
      >
        {statusContent}
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
          src={data.is_active ? assets.svg.buttonOn : assets.svg.buttonOff}
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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [tanksData, setTanksData] = useState({});
  const [rawSchedules, setRawSchedules] = useState([]);
  const [allSchedulesLoading, setAllSchedulesLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState(null);
  const [modalRows, setModalRows] = useState([]);

  const handleScrollEvents = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 10;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScrollEvents);
      window.addEventListener("resize", handleScrollEvents);
      handleScrollEvents();
      return () => {
        el.removeEventListener("scroll", handleScrollEvents);
        window.removeEventListener("resize", handleScrollEvents);
      };
    }
  }, [handleScrollEvents]);

  // Fetch real-time tank data
  const fetchData = async () => {
    try {
      const response = await apiClient.post(
        "/log/irrigation/irrigation-tanks-status/",
      );
      const data = Array.isArray(response) ? response : [];
      // ... sorting logic ...
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

      setTanksData(grouped);
    } catch (error) {
      console.error("Error fetching irrigation tanks status:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all schedule data (no params or body)
  const fetchAllSchedules = async () => {
    setAllSchedulesLoading(true);
    try {
      const response = await apiClient.get("/irrigation/irrigation-schedule");
      const data = Array.isArray(response) ? response : [];
      setRawSchedules(data);
    } catch (error) {
      console.error("Error fetching all irrigation schedules:", error);
      setRawSchedules([]);
    } finally {
      setAllSchedulesLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSchedules();
    const interval = setInterval(fetchAllSchedules, 60000);
    return () => clearInterval(interval);
  }, []);

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

  const tankIds = [1, 2, 3, 4];

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

  // Helper to extract HH:mm:ss from a time string
  const getCleanTime = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.includes("T")) return timeStr.split("T")[1].substring(0, 8);
    if (timeStr.length > 8) return timeStr.substring(0, 8);
    return timeStr;
  };

  const handleSettingsClick = (id) => {
    setSelectedTankId(id);
    const filteredRows = rawSchedules
      .filter((item) => item.zone === id)
      .map((item) => ({
        ...item,
        tempId: item.id || crypto.randomUUID(),
        id: item.id, // Store original API ID
        start_status: item.start_status !== undefined ? item.start_status : 0,
        end_status: item.end_status !== undefined ? item.end_status : 0,
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
    const newRow = {
      tempId: crypto.randomUUID(),
      start_time: "00:00:00",
      end_time: "00:00:00",
      zone: selectedTankId,
      volume: 0,
      is_active: true,
      start_status: 0,
      end_status: 0,
      isNew: true,
    };
    setModalRows((prev) => [newRow, ...prev]);
  };

  const handleDeleteRow = async (tempIdToDelete) => {
    const rowToDelete = modalRows.find((row) => row.tempId === tempIdToDelete);

    if (rowToDelete && rowToDelete.id) {
      try {
        await apiClient.delete(
          `/irrigation/irrigation-schedule/${rowToDelete.id}/`,
        );
        toast.success("ردیف با موفقیت حذف شد.");
        fetchAllSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("خطا در حذف ردیف.");
      }
    } else {
      toast.success("ردیف از لیست حذف شد.");
    }
    setModalRows((prev) => prev.filter((row) => row.tempId !== tempIdToDelete));
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

    const convertToISO = (timeString) => {
      if (!timeString) return null;
      const parts = timeString.split(":");
      if (parts.length === 2) parts.push("00");
      return `${parts.join(":")}.000Z`;
    };

    const createPromises = newRows.map((row) => {
      const payload = {
        is_active: row.is_active,
        start_status: 1,
        end_status: 1,
        zone: row.zone,
        volume: row.volume,
        start_time: convertToISO(row.start_time),
        end_time: convertToISO(row.end_time),
      };
      return apiClient.post("/irrigation/irrigation-schedule/", payload);
    });

    const updatePromises = updatedRows.map((row) => {
      const payload = {
        is_active: row.is_active,
        start_status: row.start_status,
        end_status: row.end_status,
        zone: row.zone,
        volume: row.volume,
        start_time: convertToISO(row.start_time),
        end_time: convertToISO(row.end_time),
      };
      return apiClient.patch(
        `/irrigation/irrigation-schedule/${row.id}/`,
        payload,
      );
    });

    try {
      const [createdResults, updatedResults] = await Promise.all([
        Promise.all(createPromises),
        Promise.all(updatePromises),
      ]);

      toast.success("تغییرات با موفقیت ذخیره شد.");

      const processedCreatedRows = createdResults.map((item, index) => {
        const originalTempId = newRows[index].tempId;
        return {
          ...item,
          tempId: originalTempId,
          id: item.id,
          start_status: item.start_status !== undefined ? item.start_status : 0,
          end_status: item.end_status !== undefined ? item.end_status : 0,
          start_time: getCleanTime(item.start_time),
          end_time: getCleanTime(item.end_time),
          isNew: false,
        };
      });

      const processedUpdatedRows = updatedResults.map((item, index) => {
        const originalTempId = updatedRows[index].tempId;
        return {
          ...item,
          tempId: originalTempId,
          id: item.id,
          start_status: item.start_status !== undefined ? item.start_status : 0,
          end_status: item.end_status !== undefined ? item.end_status : 0,
          start_time: getCleanTime(item.start_time),
          end_time: getCleanTime(item.end_time),
          isNew: false,
        };
      });

      setModalRows((prev) => {
        const newRowsMap = new Map(
          processedCreatedRows.map((r) => [r.tempId, r]),
        );
        const updatedRowsMap = new Map(
          processedUpdatedRows.map((r) => [r.tempId, r]),
        );

        return prev.map((row) => {
          if (newRowsMap.has(row.tempId)) return newRowsMap.get(row.tempId);
          if (updatedRowsMap.has(row.tempId))
            return updatedRowsMap.get(row.tempId);
          return row;
        });
      });

      setRawSchedules((prev) => {
        const updatedIds = new Set(updatedResults.map((r) => r.id));
        const filtered = prev.filter((r) => !updatedIds.has(r.id));
        return [...filtered, ...createdResults, ...updatedResults];
      });

      fetchAllSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
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

  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "0px",
        gap: 0,
      }}
    >
      <IconButton
        onClick={() => slide("right")}
        disabled={!canScrollRight}
        sx={{
          width: "20px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollRight ? 1 : 0.5,
          zIndex: 10,
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          width: "970px",
          height: "680px",
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "hidden",
          alignItems: "center",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          padding: 0,
          transform: "scale(0.9)",
          transformOrigin: "center",
          marginTop: "-50px",
          marginBottom: "-50px",
        }}
      >
        {tankIds.map((id) => {
          const tank = tanksData[id];
          const current = tank ? tank.current : {};
          const history = tank ? tank.history : [];

          // Filter schedules for this specific tank
          const tankSchedules = rawSchedules.filter((s) => s.zone === id);

          return (
            <Box
              key={id}
              sx={{
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
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
                allSchedulesLoading={allSchedulesLoading}
              />
            </Box>
          );
        })}
      </Box>

      <IconButton
        onClick={() => slide("left")}
        disabled={!canScrollLeft}
        sx={{
          width: "20px",
          height: "40px",
          borderRadius: "5px",
          backgroundColor: "#E3E3E3",
          border: "0.5px solid #9F9F9F",
          "&:hover": { backgroundColor: "#d0d0d0" },
          opacity: canScrollLeft ? 1 : 0.5,
          zIndex: 10,
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
      </IconButton>

      {/* Settings Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="settings-modal-title"
      >
        <Box sx={modalStyle}>
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
                  assets.svg.addField ? (
                    <img
                      src={assets.svg.addField}
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
                display: "flex",
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={12} mb={1}>
                جدول آبیاری (مخزن{" "}
                {selectedTankId ? convert(selectedTankId) : ""})
              </Typography>

              {/* Table Header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "50px 1.2fr 1.2fr 0.7fr 1fr 0.7fr 0.7fr", // Updated grid to match ScheduleRow
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
                  fontSize={10n}
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
                        convert={convert}
                        isNew={row.isNew}
                      />
                      <Divider sx={{ my: 1 }} />
                    </Collapse>
                  ))}
                </TransitionGroup>

                {modalRows.length === 0 && !allSchedulesLoading && (
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
