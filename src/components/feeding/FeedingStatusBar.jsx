import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Modal,
  MenuItem,
  FormControl,
  Select,
  Button,
  Collapse,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import IconTextButton from "../../card/IconTextButton";
import assets from "../../assets";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFoodstuffSchedule,
  saveFoodstuffSchedule,
  updateFoodstuffSchedule,
  deleteFoodstuffSchedule,
} from "../../api/solubleApi";
import toast from "react-hot-toast";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";
import TimeInput from "../common/TimeInput";

// کامپوننت سطر
const PlanRow = ({ id, data, onChange, onDelete, canBeDeleted, isNew }) => {
  const [isChanging, setIsChanging] = useState(false);

  // هندل کردن تغییر وضعیت دکمه
  const handleToggleActive = () => {
    setIsChanging(true);
    setTimeout(() => {
      onChange(id, "isActive", !data.isActive);
      setIsChanging(false);
    }, 200);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "10px",
        backgroundColor: isNew ? "#E3F2FD" : "transparent",
        borderRadius: "8px",
        paddingTop: isNew ? "10px" : "0",
        marginBottom: isNew ? "10px" : "0",
        border: isNew ? "1px dashed #2196F3" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          وضعیت
        </Typography>
        <Box
          sx={{
            width: "100px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            onClick={handleToggleActive}
            className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
            src={data.isActive ? assets.svg.buttonOn : assets.svg.buttonOff}
            alt="Toggle Activity"
            style={{
              cursor: "pointer",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ width: "100px" }}>
        <Button
          variant="text"
          onClick={onDelete}
          disabled={!canBeDeleted}
          sx={{
            backgroundColor: "#FED9D9",
            border: "0.5px solid #CC0000",
            borderRadius: "10px",
            width: "100px",
            height: "60px",
            color: "#CC0000",
            opacity: canBeDeleted ? 1 : 0.5,
            mt: "25px",
          }}
        >
          <Typography color="inherit" fontFamily={"IRANSANS"} fontSize={18}>
            حذف
          </Typography>
        </Button>
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          زون
        </Typography>
        <FormControl
          sx={{
            width: "100px",
            height: "60px",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              height: "60px",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              fontFamily: "IRANSANS",
            },
          }}
        >
          <Select
            value={data.zone}
            onChange={(e) => onChange(id, "zone", e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontFamily: "IRANSANS" }}>
                {toPersianDigits(n)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          حجم
        </Typography>
        <input
          type="text"
          inputMode="decimal"
          value={toPersianDigits(data.volume)}
          onChange={(e) =>
            onChange(id, "volume", toEnglishDigits(e.target.value))
          }
          style={{
            width: "100px",
            height: "60px",
            color: "#1e1e1e",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            fontFamily: "IRANSANS",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        />
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          نوع
        </Typography>
        <FormControl
          sx={{
            width: "100px",
            height: "60px",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              height: "60px",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              fontFamily: "IRANSANS",
            },
          }}
        >
          <Select
            value={data.type}
            onChange={(e) => onChange(id, "type", e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontFamily: "IRANSANS" }}>
                {toPersianDigits(n)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          زمان
        </Typography>
        <Box
          sx={{
            width: "100px",
            height: "60px",
            color: "#1e1e1e",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            boxSizing: "border-box",
            overflow: "hidden",
            px: 0.5,
          }}
        >
          <TimeInput
            value={data.time}
            onChange={(nextValue) => onChange(id, "time", nextValue)}
            style={{ fontSize: "14px" }}
            iconSize={18}
          />
        </Box>
      </Box>
    </Box>
  );
};

const FeedingStatusBar = () => {
  const queryClient = useQueryClient();
  const [modalPlans, setModalPlans] = useState(false);

  const [planRows, setPlanRows] = useState([
    {
      id: crypto.randomUUID(),
      zone: "",
      type: "",
      time: "",
      volume: "",
      isActive: false,
    },
  ]);

  // === منطق اسکرول عمودی با درگ ===
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startY = useRef(0);
  const scrollTopState = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollTopState.current = scrollRef.current.scrollTop;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
  };
  const handleMouseUp = () => {
    isDown.current = false;
  };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    scrollRef.current.scrollTop = scrollTopState.current - walk;
  };
  // ===================================

  const {
    data: rawSchedule = [],
    isLoading: isLoadingSchedule,
    isError: isErrorSchedule,
    error: scheduleError,
  } = useQuery({
    queryKey: ["foodstuffSchedule"],
    queryFn: getFoodstuffSchedule,
    refetchInterval: 5000,
    select: (response) => {
      const data = response.data || response;
      return Array.isArray(data) ? data : [];
    },
  });

  const scheduleData = useMemo(() => {
    if (!rawSchedule) return [];
    return rawSchedule.map((item) => ({
      time: toPersianDigits(item.time),
      zone: toPersianDigits(item.zone),
      type: toPersianDigits(item.type),
      volume: toPersianDigits(item.volume),
      status: item.is_active ? "فعال" : "غیرفعال",
    }));
  }, [rawSchedule]);

  const deleteScheduleMutation = useMutation({
    mutationFn: deleteFoodstuffSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(["foodstuffSchedule"]);
      toast.success("ردیف با موفقیت حذف شد");
    },
    onError: (error) => {
      console.error("Error deleting row:", error);
      toast.error("خطا در حذف ردیف");
    },
  });

  const saveScheduleMutation = useMutation({
    mutationFn: saveFoodstuffSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(["foodstuffSchedule"]);
      toast.success("برنامه با موفقیت ذخیره شد.");
    },
    onError: (error) => {
      console.error("Error saving new schedule:", error);
      toast.error("خطا در ذخیره سازی برنامه جدید.");
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, payload }) => updateFoodstuffSchedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["foodstuffSchedule"]);
      toast.success("برنامه با موفقیت به روز شد.");
    },
    onError: (error) => {
      console.error("Error updating schedule:", error);
      toast.error("خطا در به روزرسانی برنامه.");
    },
  });

  const handleModalPlansClose = () => setModalPlans(false);

  const handleModalPlansOpen = () => {
    if (rawSchedule && rawSchedule.length > 0) {
      const rows = rawSchedule.map((item) => ({
        id: item.id || crypto.randomUUID(),
        zone: item.zone,
        type: item.type,
        time: item.time,
        volume: item.volume,
        isActive: item.is_active,
        status: item.status,
      }));
      setPlanRows(rows);
    } else {
      setPlanRows([
        {
          id: crypto.randomUUID(),
          zone: "",
          type: "",
          time: "",
          volume: "",
          isActive: false,
        },
      ]);
    }
    setModalPlans(true);
  };

  const handleAddRow = () => {
    setPlanRows((prevRows) => [
      {
        id: crypto.randomUUID(),
        zone: "",
        type: "",
        time: "",
        volume: "",
        isActive: false,
      },
      ...prevRows,
    ]);
  };

  const handleDeleteRow = (idToDelete) => {
    const isExisting = (rawSchedule || []).some((r) => r.id === idToDelete);
    if (isExisting) {
      deleteScheduleMutation.mutate(idToDelete);
      setPlanRows((prevRows) =>
        prevRows.filter((row) => row.id !== idToDelete),
      );
    } else {
      if (planRows.length <= 1) return;
      setPlanRows((prevRows) =>
        prevRows.filter((row) => row.id !== idToDelete),
      );
    }
  };

  const handleRowChange = (id, field, value) => {
    setPlanRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const newRows = useMemo(() => {
    return planRows.filter(
      (row) => !(rawSchedule || []).some((raw) => raw.id === row.id),
    );
  }, [planRows, rawSchedule]);

  const updatedRows = useMemo(() => {
    return planRows.filter((row) => {
      const original = (rawSchedule || []).find((raw) => raw.id === row.id);
      if (!original) return false;
      return (
        String(row.zone) !== String(original.zone) ||
        String(row.type) !== String(original.type) ||
        String(row.volume) !== String(original.volume) ||
        row.time !== original.time ||
        row.isActive !== original.is_active
      );
    });
  }, [planRows, rawSchedule]);

  const handleSave = async () => {
    if (newRows.length === 0 && updatedRows.length === 0) {
      handleModalPlansClose();
      return;
    }

    const savePromises = newRows.map((row) => {
      const payload = {
        is_active: row.isActive,
        status: row.status || 1,
        zone: row.zone,
        volume: row.volume,
        type: row.type,
        time: row.time,
      };
      return saveScheduleMutation.mutateAsync(payload);
    });

    const updatePromises = updatedRows.map((row) => {
      const payload = {
        is_active: row.isActive,
        status: row.status || 1,
        zone: row.zone,
        volume: row.volume,
        type: row.type,
        time: row.time,
      };
      return updateScheduleMutation.mutateAsync({ id: row.id, payload });
    });

    try {
      await Promise.all([...savePromises, ...updatePromises]);
      handleModalPlansClose();
    } catch (error) {
      console.error("Error during batch save/update:", error);
      toast.error("برخی از تغییرات با خطا مواجه شدند.");
    }
  };

  const renderScheduleRow = (row, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        width: "98%",
        padding: "8px 0",
        borderBottom:
          index < scheduleData.length - 1 ? "1px solid #E0E0E0" : "none",
        pointerEvents: "none", // جلوگیری از تداخل متن با اسکرول
      }}
    >
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.time}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.zone}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.type}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.volume}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.status}</Typography>
      </Box>
    </Box>
  );

  const headerStyle = {
    fontFamily: "IRANSANS",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#555",
    textAlign: "center",
    flex: 1,
  };

  const cellStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = {
    fontFamily: "IRANSANS",
    fontSize: "10px",
    color: "#333",
    backgroundColor: "#F5F5F5",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "3px",
    width: "38px",
    textAlign: "center",
  };

  if (isLoadingSchedule) {
    return (
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: "250px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (isErrorSchedule) {
    return (
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: "250px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error">خطا در بارگذاری برنامه</Alert>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: 300,
          height: "auto",
          minHeight: "230px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "16px",
          pb: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // جلوگیری کامل از انتخاب شدن متن
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <Box
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          sx={{
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            paddingRight: "8px",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
            // استایل اسکرول‌بار مخفی و تمیز
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 0 8px 0",
              borderBottom: "2px solid #E0E0E0",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography sx={headerStyle}>زمان</Typography>
            <Typography sx={headerStyle}>زون</Typography>
            <Typography sx={headerStyle}>نوع</Typography>
            <Typography sx={headerStyle}>حجم</Typography>
            <Typography sx={headerStyle}>وضعیت</Typography>
          </Box>
          <Stack spacing={0} sx={{ width: "100%", marginTop: "8px" }}>
            {scheduleData.map(renderScheduleRow)}
          </Stack>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "15px",
            justifyContent: "right",
            display: "flex",
            height: "20px",
          }}
        >
          <IconTextButton
            text="تنظیمات ساخت محلول"
            icon={assets.svg.setting2}
            iconPosition="left"
            bgColor="#F7C98C"
            textColor="#333"
            borderColor="#F7C98C"
            onClick={handleModalPlansOpen}
            width="87%"
          />
        </Box>
      </Paper>

      <Modal
        open={modalPlans}
        className="plans-modal"
        disableAutoFocus
        onClose={handleModalPlansClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            width: "964px",
            height: "460px",
            boxShadow: 24,
            padding: "8px 8px 16px 8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            userSelect: "none",
          }}
          className="modalBox"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "95%",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={18}
              mr={2}
              mt={2}
              mb={2}
            >
              برنامه زمانی ساخت محلول
            </Typography>
            <img
              className="close-btn"
              src={assets.svg.close}
              alt="close"
              onClick={handleModalPlansClose}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "90%",
                maxWidth: "850px",
                height: "265px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              <TransitionGroup>
                {planRows.map((row) => {
                  const isNew = !(rawSchedule || []).some(
                    (raw) => raw.id === row.id,
                  );
                  return (
                    <Collapse key={row.id}>
                      <PlanRow
                        id={row.id}
                        data={row}
                        onChange={handleRowChange}
                        onDelete={() => handleDeleteRow(row.id)}
                        canBeDeleted={planRows.length > 1}
                        isNew={isNew}
                      />
                    </Collapse>
                  );
                })}
              </TransitionGroup>
            </Box>
          </div>

          <div
            style={{
              width: "90%",
              maxWidth: "850px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={newRows.length === 0 && updatedRows.length === 0}
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45a049" },
                borderRadius: "10px",
                padding: "8px 24px",
                fontFamily: "IRANSANS",
                fontSize: "16px",
              }}
            >
              ثبت تغییرات
            </Button>

            <div
              className="add-field-btn"
              onClick={handleAddRow}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography fontFamily="IRANSANS" sx={{ ml: 1 }}>
                اضافه کردن ردیف
              </Typography>
              <img
                src={assets.svg.addField}
                alt="Add Row"
                style={{ scale: "1.3" }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default FeedingStatusBar;
