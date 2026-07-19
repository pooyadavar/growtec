import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  IconButton,
  CircularProgress,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import svgButtonOnAsset from "../assets/svg/buttonOn.svg";
import svgButtonOffAsset from "../assets/svg/buttonOff.svg";
import svgAddFieldAsset from "../assets/svg/addField.svg";
import IconTextButton from "./IconTextButton";
import { AgCharts } from "ag-charts-react";
import { TransitionGroup } from "react-transition-group";
import {
  createOperatorSchedule,
  updateOperatorSchedule,
  deleteOperatorSchedule,
} from "../api/climateApi";
import { queryKeys } from "../api/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { toPersianDigits, toEnglishDigits } from "../utils/persianDigits";
import TimeInput from "../components/common/TimeInput";
import toast from "react-hot-toast";

const ROW_GRID = "36px 1fr 1fr 56px 56px 32px";

const cellBoxSx = {
  height: "35px",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "#FFFFFF",
  overflow: "hidden",
  minWidth: 0,
};

const numericInputStyle = {
  border: "none",
  outline: "none",
  width: "100%",
  height: "100%",
  textAlign: "center",
  fontFamily: "IRANSANS",
  fontSize: "12px",
  padding: "0 4px",
  boxSizing: "border-box",
};

const chartFontTheme = {
  overrides: {
    common: {
      title: { fontFamily: "IRANSANS" },
      legend: { item: { label: { fontFamily: "IRANSANS" } } },
      axes: {
        number: { label: { fontFamily: "IRANSANS" } },
        category: { label: { fontFamily: "IRANSANS" } },
      },
    },
  },
};

const operatorTranslations = {
  exhaust_fan_1: "فن اگزاست ۱",
  exhaust_fan_2: "فن اگزاست ۲",
  exhaust_fan_3: "فن اگزاست ۳",
  exhaust_fan_4: "فن اگزاست ۴",
  exhaust_fan_5: "فن اگزاست ۵",
  circule_fan_1: "فن سیرکوله ۱",
  circule_fan_2: "فن سیرکوله ۲",
  pad_pump: "پمپ پد",
  fogger: "مه پاش",
  hatch_opening: "باز کردن دریچه",
  hatch_closing: "بستن دریچه",
  shade_opening: "باز کردن پرده",
  shade_closing: "بستن پرده",
  hiter_1: "هیتر ۱",
  hiter_2: "هیتر ۲",
  hiter_3: "هیتر ۳",
  hiter_4: "هیتر ۴",
};

const TimePlansCards = ({
  fan,
  float1,
  float2,
  float3,
  data,
  zone,
  schedules = [],
}) => {
  const queryClient = useQueryClient();
  const resolvedZone = zone || 1;
  const [rows, setRows] = useState([]);
  const [initialRows, setInitialRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const translatedFanName = operatorTranslations[fan] || fan;

  const isRowChanged = (row, initial) => {
    if (!initial) return true;
    return (
      row.start_time !== initial.start_time ||
      row.end_time !== initial.end_time ||
      Number(row.on_time) !== Number(initial.on_time) ||
      Number(row.off_time) !== Number(initial.off_time) ||
      row.is_active !== initial.is_active
    );
  };

  const hasChanges = useMemo(() => {
    if (rows.some((row) => row.isNew)) {
      return true;
    }

    const currentServerRows = rows.filter((r) => !r.isNew);

    if (currentServerRows.length !== initialRows.length) {
      return true;
    }

    for (const currentRow of currentServerRows) {
      const initialRow = initialRows.find((ir) => ir.id === currentRow.id);

      if (!initialRow) {
        return true;
      }

      if (
        currentRow.start_time !== initialRow.start_time ||
        currentRow.end_time !== initialRow.end_time ||
        Number(currentRow.on_time) !== Number(initialRow.on_time) ||
        Number(currentRow.off_time) !== Number(initialRow.off_time) ||
        currentRow.is_active !== initialRow.is_active
      ) {
        return true;
      }
    }

    return false;
  }, [rows, initialRows]);

  useEffect(() => {
    if (Array.isArray(schedules)) {
      const mappedServerRows = schedules.map((s) => ({
        ...s,
        operator: s.operator || fan,
        uiId: s.id,
        isNew: false,
        is_active: s.is_active !== undefined ? s.is_active : true,
        isChanging: false,
      }));
      setInitialRows(mappedServerRows);

      setRows((prevRows) => {
        const pendingNewRows = prevRows.filter(
          (r) => r.isNew && r.operator === fan,
        );
        return [...mappedServerRows, ...pendingNewRows];
      });
    }
  }, [schedules, fan]);

  const handleAddRow = () => {
    setRows((prevRows) => [
      {
        uiId: crypto.randomUUID(),
        operator: fan,
        isNew: true,
        start_time: "00:00:00",
        end_time: "00:00:00",
        on_time: 0,
        off_time: 0,
        is_active: true,
        isChanging: false,
      },
      ...prevRows,
    ]);
  };

  const handleToggleActive = (uiId) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.uiId === uiId) {
          return { ...row, isChanging: true };
        }
        return row;
      }),
    );

    setTimeout(() => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.uiId === uiId) {
            return { ...row, is_active: !row.is_active, isChanging: false };
          }
          return row;
        }),
      );
    }, 200);
  };

  const handleDeleteRow = async (row) => {
    setRows((prevRows) => prevRows.filter((r) => r.uiId !== row.uiId));

    if (!row.isNew) {
      try {
        await deleteOperatorSchedule(row.id);
        toast.success("حذف شد");
        queryClient.invalidateQueries({
          queryKey: queryKeys.operatorSchedules(resolvedZone),
        });
      } catch (error) {
        console.error(error);
        toast.error("خطا در حذف");
        queryClient.invalidateQueries({
          queryKey: queryKeys.operatorSchedules(resolvedZone),
        });
      }
    }
  };

  const handleInputChange = (uiId, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.uiId === uiId ? { ...row, [field]: value } : row)),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    let hasError = false;
    try {
      const rowsToSave = rows.filter((row) => {
        if (row.operator && row.operator !== fan) return false;
        if (row.isNew) return true;
        const initial = initialRows.find((ir) => ir.id === row.id);
        return isRowChanged(row, initial);
      });

      for (const row of rowsToSave) {
        let startTime = row.start_time;
        let endTime = row.end_time;

        if (startTime && startTime.length === 5) startTime += ":00";
        if (endTime && endTime.length === 5) endTime += ":00";

        const payload = {
          zone: resolvedZone,
          operator: fan,
          start_time: startTime,
          end_time: endTime,
          on_time: Number(row.on_time),
          off_time: Number(row.off_time),
          is_active: row.is_active,
          start_status: 4294967295,
          end_status: 4294967295,
        };

        try {
          if (row.isNew) {
            await createOperatorSchedule(payload);
          } else {
            await updateOperatorSchedule(row.id, payload);
          }
        } catch (rowError) {
          hasError = true;
          console.error("Row save error:", rowError);

          if (
            rowError.response?.status === 400 &&
            (payload.on_time === 0 || payload.off_time === 0)
          ) {
            toast.error(`خطا: فیلدهای روشن و خاموش نمی‌توانند 0 باشند.`);
          } else {
            toast.error(
              `خطا در ذخیره سازی ردیف: ${rowError.response?.data?.detail || rowError.message || "نامشخص"}`,
            );
          }
          break;
        }
      }

      if (!hasError) {
        toast.success("تغییرات ذخیره شد");
        queryClient.invalidateQueries({
          queryKey: queryKeys.operatorSchedules(resolvedZone),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.operatorSchedules(resolvedZone),
        });
      }
    } catch (generalError) {
      console.error(generalError);
      toast.error("خطا کلی در ذخیره سازی");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = useMemo(
    () => ({
      theme: chartFontTheme,
      data: data || [],
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "value",
          stroke: "#007bff",
          strokeWidth: 1,
          marker: { enabled: true, size: 1.5, fill: "#007bff" },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: { enabled: false },
        },
        {
          type: "number",
          position: "left",
          min: 0,
          max: 1,
          nice: false,
          tick: { values: [0, 1], count: 2 },
          thickness: 30,
          label: {
            formatter: (params) => (params.value === 1 ? "روشن" : "خاموش"),
            fontSize: 8,
            fontFamily: "IRANSANS",
          },
        },
      ],
      background: { fill: "transparent" },
      padding: { top: 5, right: 10, bottom: 15, left: 40 },
    }),
    [data],
  );

  return (
    <Container
      sx={{
        width: "370px",
        height: "530px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "transform 0.2s",
        p: 2,
        gap: 1,
        overflow: "hidden",
        transform: "scale(1)",
      }}
    >
      <Box
        className="irrigation-card-title"
        sx={{
          width: "300px",
          height: "37px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "102px",
            height: "27px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            backgroundColor: "#FFCB82",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            textAlign={"center"}
          >
            {translatedFanName}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={12}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          تاریخچه عملگر{" "}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "350px",
          height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "80px",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            paddingTop: "15px",
            paddingRight: "15px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "calc(100% - 10px)",
              direction: "rtl",
            }}
          >
            <AgCharts
              options={chartOptions}
              style={{ width: "105%", height: "100%", direction: "rtl" }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        className="irrigation-card-table"
        sx={{
          width: "350px",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: ROW_GRID,
            gap: "10px",
            width: "97%",
            mb:1,
            mt:2,
            backgroundColor: "#F3F4F6",
            borderRadius: "8px",
            padding: "8px 4px",
            alignItems: "center",
            direction: "rtl",
            justifyContent: "center",
          }}
        >
          {["وضعیت", "شروع", "پایان", "روشن", "خاموش", "حذف"].map((label) => (
            <Typography
              key={label}
              fontFamily="IRANSANS"
              fontSize={10}
              textAlign="center"
              fontWeight="bold"
              color="#555"
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            maxHeight: "200px",
            overflowY: "auto",
            overflowX: "hidden",
            direction: "rtl",
            pr: 0,
            mb: 1,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "4px",
            },
          }}
        >
          {loading && rows.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {rows.length > 0 ? (
            <TransitionGroup style={{ width: "100%"}}>
              {rows.map((row) => (
                <Collapse key={row.uiId}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: ROW_GRID,
                      gap: "6px",
                      width: "95%",
                      alignItems: "center",
                      py: 0.75,
                      px: 0.5,
                      mb: 0.5,
                      direction: "rtl",
                      border: row.isNew
                        ? "1px dashed #2196F3"
                        : "1px solid #F3F4F6",
                      borderRadius: "8px",
                      backgroundColor: row.isNew ? "#E3F2FD" : "transparent",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: row.isNew ? "#2196F3" : "#E5E7EB",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        onClick={() => handleToggleActive(row.uiId)}
                        className={`on-and-off-btn ${row.isChanging ? "changing" : ""}`}
                        src={
                          row.is_active
                            ? svgButtonOnAsset
                            : svgButtonOffAsset
                        }
                        alt="Toggle"
                        style={{
                          cursor: "pointer",
                          width: "30px",
                          height: "auto",
                        }}
                      />
                    </Box>

                    <Box sx={cellBoxSx}>
                      <TimeInput
                        value={row.start_time?.substring(0, 5) || "00:00"}
                        onChange={(nextValue) =>
                          handleInputChange(row.uiId, "start_time", nextValue)
                        }
                        inputStyle={{ fontSize: "12px" }}
                        iconSize={13}
                      />
                    </Box>
                    <Box sx={cellBoxSx}>
                      <TimeInput
                        value={row.end_time?.substring(0, 5) || "00:00"}
                        onChange={(nextValue) =>
                          handleInputChange(row.uiId, "end_time", nextValue)
                        }
                        inputStyle={{ fontSize: "12px" }}
                        iconSize={13}
                      />
                    </Box>
                    <Box sx={cellBoxSx}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={toPersianDigits(row.on_time ?? "")}
                        onChange={(e) =>
                          handleInputChange(
                            row.uiId,
                            "on_time",
                            toEnglishDigits(e.target.value),
                          )
                        }
                        style={numericInputStyle}
                      />
                    </Box>
                    <Box sx={cellBoxSx}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={toPersianDigits(row.off_time ?? "")}
                        onChange={(e) =>
                          handleInputChange(
                            row.uiId,
                            "off_time",
                            toEnglishDigits(e.target.value),
                          )
                        }
                        style={numericInputStyle}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRow(row)}
                        sx={{ p: 0.25, color: "#ef5350" }}
                      >
                        <CloseIcon
                          fontSize="small"
                          sx={{ fontSize: "1.1rem" }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </Collapse>
              ))}
            </TransitionGroup>
          ) : (
            !loading && (
              <Typography fontFamily={"IRANSANS"} color="text.secondary" textAlign="center" fontSize={14} mt={5}>
                برنامه زمانی ای تنظیم نشده
              </Typography>
            )
          )}
        </Box>

        <Box
          sx={{
            width: "92%",
            display: "flex",
            justifyContent: "center",
            gap: 6,
            mb: 1,
            mt: 2,

          }}
        >
          <IconTextButton
            text="اضافه کردن سطر"
            icon={svgAddFieldAsset}
            iconPosition="left"
            bgColor="#FFCB82"
            textColor="#000000"
            width="39%"
            height="20px"
            borderColor="#FFCB82"
            onClick={handleAddRow}
            sx={{
              justifyContent: "center",
              gap: 1,
              "& .MuiTypography-root": {
                fontSize: "11px",
              },
            }}
          />
          <IconTextButton
            text={loading ? "..." : "ذخیره"}
            icon={null}
            iconPosition="left"
            bgColor={!loading && hasChanges ? "#86CCB2" : "#dbf5eb"}
            textColor={hasChanges ? "black" : "gray"}
            width="39%"
            height="20px"
            borderColor={!loading && hasChanges ? "#86CCB2" : "#aaf2d8"}
            onClick={handleSave}
            disabled={loading || !hasChanges}
            sx={{
              justifyContent: "center",
              gap: 1,
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
export default TimePlansCards;
