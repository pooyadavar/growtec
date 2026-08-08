import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import CalculateIcon from "@mui/icons-material/CalculateOutlined";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import IconTextButton from "../../card/IconTextButton";
import TimeInput from "../common/TimeInput";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";
import { saveIrrigationProgramToFile } from "../../utils/saveIrrigationProgram";
import { getIrrigationConfig } from "../../api/configApi";
import { getConfigValue } from "../../utils/irrigationConfig";

const COLORS = {
  amber: "#FFCB82",
  green: "#86CCB2",
  red: "#F44336",
  bgGrey: "#F0F0F0",
  white: "#FFFFFF",
};

const IRAN_SANS = { fontFamily: "IRANSANS" };

const inputStyles = {
  ...IRAN_SANS,
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    backgroundColor: COLORS.white,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    "& fieldset": { border: "none" },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 6px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.9rem",
    fontFamily: "IRANSANS",
  },
};

const selectStyles = {
  width: "100%",
  height: "40px",
  border: "none",
  outline: "none",
  background: "transparent",
  textAlign: "center",
  fontFamily: "IRANSANS",
  fontWeight: "bold",
  fontSize: "0.9rem",
  cursor: "pointer",
  appearance: "auto",
  WebkitAppearance: "menulist",
};

const fieldShellSx = {
  borderRadius: "20px",
  backgroundColor: COLORS.white,
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const labeledFieldBodySx = {
  ...fieldShellSx,
  borderRadius: "0 0 20px 20px",
  mt: "-1px",
};

const parseTimeToSeconds = (timeStr) => {
  const en = toEnglishDigits(String(timeStr ?? "00:00:00"));
  const parts = en.split(":").map((p) => parseInt(p, 10) || 0);
  const [h = 0, m = 0, s = 0] = parts;
  return h * 3600 + m * 60 + s;
};

const durationToSeconds = parseTimeToSeconds;

const formatSecondsToTime = (totalSeconds) => {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600) % 24;
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

const getRowDurationSeconds = (row) => {
  const start = parseTimeToSeconds(row.start_time ?? row.start);
  const end = parseTimeToSeconds(row.end_time ?? row.end);
  return Math.max(0, end - start);
};

const normalizeScheduleRows = (rows, gapSeconds = 0) => {
  let previousEnd = null;

  return [...rows]
    .sort((a, b) => {
      const aBaseStart = parseTimeToSeconds(
        a.base_start_time ?? a.start_time ?? a.start,
      );
      const bBaseStart = parseTimeToSeconds(
        b.base_start_time ?? b.start_time ?? b.start,
      );
      if (aBaseStart !== bBaseStart) return aBaseStart - bBaseStart;
      const aSequence = Number(a.sequence_order) || 0;
      const bSequence = Number(b.sequence_order) || 0;
      if (aSequence !== bSequence) return aSequence - bSequence;
      const aZone = Number(a.zone) || 0;
      const bZone = Number(b.zone) || 0;
      if (aZone !== bZone) return aZone - bZone;
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    })
    .map((row, index) => {
      const originalStart = parseTimeToSeconds(row.start_time ?? row.start);
      const duration = getRowDurationSeconds(row);
      const minStart = previousEnd == null ? originalStart : previousEnd + gapSeconds;
      const nextStart = previousEnd == null ? originalStart : Math.max(originalStart, minStart);
      const nextEnd = nextStart + duration;
      previousEnd = nextEnd;

      return {
        ...row,
        order: index + 1,
        start: formatSecondsToTime(nextStart),
        end: formatSecondsToTime(nextEnd),
        start_time: formatSecondsToTime(nextStart),
        end_time: formatSecondsToTime(nextEnd),
      };
    });
};

const createEmptyRow = (index, operator = 1) => ({
  order: index + 1,
  zone: operator,
  start: "00:00:00",
  end: "00:00:00",
  duration: "00:00:00",
});

const resolveOperatorsCount = (config) => {
  return [1, 2, 3, 4].reduce(
    (sum, zone) =>
      sum + (Number(getConfigValue(config, `number_of_pumps_zone_${zone}`)) || 0),
    0,
  );
};

const CustomLabel = ({ children }) => (
  <Box
    sx={{
      backgroundColor: COLORS.amber,
      borderRadius: "15px 15px 0 0",
      padding: "4px 15px",
      width: "85%",
      margin: "0 auto 0px auto",
      position: "relative",
      zIndex: 2,
      minWidth: "120px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "0.75rem",
      fontFamily: "IRANSANS",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </Box>
);

const TimeField = ({ value, onChange, underLabel = false, sx = {} }) => (
  <Box
    sx={{
      ...(underLabel ? labeledFieldBodySx : fieldShellSx),
      height: "40px",
      display: "flex",
      alignItems: "center",
      px: 1,
      ...sx,
    }}
  >
    <TimeInput
      value={value}
      step="1"
      onChange={onChange}
      inputStyle={{ fontSize: "0.9rem", fontWeight: "bold" }}
      iconSize={18}
    />
  </Box>
);

const LabeledField = ({ label, children }) => (
  <Box sx={{ borderRadius: "20px" }}>
    <CustomLabel>{label}</CustomLabel>
    {children}
  </Box>
);

const NumberSelect = ({
  value,
  onChange,
  min = 1,
  max = 20,
  emptyLabel,
  underLabel = false,
  compact = false,
  sx = {},
}) => (
  <Box
    sx={{
      ...(underLabel ? labeledFieldBodySx : fieldShellSx),
      height: compact ? "36px" : "40px",
      display: "flex",
      alignItems: "center",
      px: compact ? 0.5 : 1,
      ...(compact
        ? {
            backgroundColor: COLORS.amber,
            borderRadius: "12px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
          }
        : {}),
      ...sx,
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      style={{
        ...selectStyles,
        height: compact ? "34px" : "40px",
        fontSize: compact ? "0.85rem" : "0.9rem",
      }}
    >
      {emptyLabel && <option value="">{emptyLabel}</option>}
      {Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => {
        const n = min + i;
        return (
          <option key={n} value={n}>
            {toPersianDigits(n)}
          </option>
        );
      })}
    </select>
  </Box>
);

const NumberInput = ({ value, onChange, min = 1, underLabel = false }) => (
  <TextField
    fullWidth
    type="text"
    value={value === "" ? "" : toPersianDigits(value)}
    onChange={(e) => {
      const raw = toEnglishDigits(e.target.value).replace(/\D/g, "");
      onChange(raw === "" ? "" : Math.max(min, Number(raw)));
    }}
    sx={{
      ...inputStyles,
      "& .MuiOutlinedInput-root": {
        borderRadius: underLabel ? "0 0 20px 20px" : "20px",
        backgroundColor: COLORS.white,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        height: "40px",
        "& fieldset": { border: "none" },
      },
      "& .MuiOutlinedInput-input": {
        padding: "8px 6px",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "0.9rem",
        fontFamily: "IRANSANS",
      },
    }}
    inputProps={{
      inputMode: "numeric",
      style: { fontFamily: "IRANSANS", textAlign: "center" },
    }}
  />
);

export default function IrrigationCalculatorPage({
  onClose,
}) {
  const { data: irrigationConfig } = useQuery({
    queryKey: ["irrigationConfig"],
    queryFn: getIrrigationConfig,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const operatorsCount = useMemo(() => {
    return resolveOperatorsCount(irrigationConfig);
  }, [irrigationConfig]);

  const [programName, setProgramName] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [firstIrrigation, setFirstIrrigation] = useState("00:00:00");
  const [irrigationCount, setIrrigationCount] = useState("");
  const [irrigationInterval, setIrrigationInterval] = useState("00:00:00");
  const [irrigationDuration, setIrrigationDuration] = useState("00:00:00");
  const [zoneInterval, setZoneInterval] = useState("00:00:00");
  const [rows, setRows] = useState([]);
  const [builtRows, setBuiltRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRows((prev) =>
      Array.from({ length: operatorsCount }, (_, index) => {
        const row = prev[index];
        if (!row) return createEmptyRow(index, index + 1);
        return {
          ...row,
          order: index + 1,
          zone:
            row.zone === ""
              ? ""
              : Math.min(Math.max(row.zone ?? 1, 1), operatorsCount),
        };
      }),
    );
  }, [operatorsCount]);

  useEffect(() => {
    if (filterOperator !== "" && Number(filterOperator) > operatorsCount) {
      setFilterOperator("");
    }
  }, [filterOperator, operatorsCount]);

  const buildProgramRows = () => {
    const first = parseTimeToSeconds(firstIrrigation);
    const count = Number(irrigationCount);
    const interval = durationToSeconds(irrigationInterval);
    const defaultDuration = durationToSeconds(irrigationDuration);
    const zoneGap = durationToSeconds(zoneInterval);

    const built = [];
    const orderedZones = rows.filter((row) => row.zone !== "");

    if (!Number.isFinite(count) || count <= 0) {
      toast.error("تعداد دفعات روشن شدن عملگر را وارد کنید");
      return built;
    }

    if (orderedZones.length === 0) {
      toast.error("حداقل یک زون در ترتیب آبیاری انتخاب کنید");
      return built;
    }

    for (let cycle = 0; cycle < count; cycle++) {
      const cycleStart = first + cycle * interval;
      let cursor = cycleStart;
      orderedZones.forEach((row) => {
        const duration = durationToSeconds(row.duration) || defaultDuration;
        if (duration <= 0) return;
        const start = cursor;
        const end = start + duration;
        built.push({
          order: built.length + 1,
          zone: row.zone,
          duration: formatSecondsToTime(duration),
          start: formatSecondsToTime(start),
          end: formatSecondsToTime(end),
          start_time: formatSecondsToTime(start),
          end_time: formatSecondsToTime(end),
          base_start_time: formatSecondsToTime(cycleStart),
          sequence_order: row.order,
          volume: "",
          is_active: true,
          start_status: 0,
          end_status: 0,
          volume_status: 0,
        });
        cursor = end + zoneGap;
      });
    }
    return built;
  };

  const handleBuildProgram = () => {
    const built = buildProgramRows();
    if (built.length === 0) return;
    const gapSeconds = durationToSeconds(zoneInterval);
    setBuiltRows((prev) => normalizeScheduleRows([...prev, ...built], gapSeconds));
    setFilterOperator("");
  };

  const handleSaveProgram = async () => {
    if (!programName.trim()) {
      toast.error("نام برنامه را وارد کنید");
      return;
    }

    const built = builtRows.length > 0 ? builtRows : buildProgramRows();
    if (built.length === 0) return;
    setBuiltRows(normalizeScheduleRows(built, durationToSeconds(zoneInterval)));

    const programData = {
      programName: programName.trim(),
      filterOperator,
      operatorsCount,
      firstIrrigation,
      irrigationCount,
      irrigationInterval,
      irrigationDuration,
      zoneInterval,
      zones: rows,
      schedule: built,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      const result = await saveIrrigationProgramToFile(
        programName.trim(),
        programData,
      );
      if (result.downloaded) {
        toast.success(`سرور ذخیره در دسترس نبود؛ فایل ${result.fileName} دانلود شد`);
      } else {
        toast.success(`فایل ${result.fileName} در پوشه برنامه ابیاری ذخیره شد`);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "ذخیره فایل ناموفق بود. سرور را با npm run save-server اجرا کنید",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleOrderChange = (index, nextOrder) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, zone: nextOrder } : row)),
    );
  };

  const handleDeleteRow = (index) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, zone: "" } : row)),
    );
  };

  const handleClearTable = () => {
    setBuiltRows([]);
    setRows(
      Array.from({ length: operatorsCount }, (_, index) =>
        createEmptyRow(index, index + 1),
      ),
    );
  };

  const handleBuiltRowChange = (index, field, value) => {
    setBuiltRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleDeleteBuiltRow = (index) => {
    setBuiltRows((prev) =>
      normalizeScheduleRows(
        prev.filter((_, i) => i !== index),
        durationToSeconds(zoneInterval),
      ),
    );
  };

  const rawDisplayRows = builtRows.length > 0 ? builtRows : rows;
  const displayRows =
    filterOperator === ""
      ? rawDisplayRows
      : rawDisplayRows.filter((row) => Number(row.zone) === Number(filterOperator));
  const isPreviewMode = builtRows.length > 0;

  const updateFormValue = (setter) => (value) => {
    setter(value);
  };

  return (
    <Box
      sx={{
        pt: 3,
        px: 1.5,
        pb: 2,
        bgcolor: COLORS.bgGrey,
        height: "100%",
        overflow: "hidden",
        direction: "rtl",
        fontFamily: "IRANSANS",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
        }}
      >
        {/* ستون اصلی: جدول عملگر/شروع/پایان/حذف */}
        <Box sx={{ flex: "0 0 62%", height: "87%", minWidth: 0 }}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                bgcolor: COLORS.amber,
                borderRadius: "20px",
                p: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <CalculateIcon sx={{ fontSize: 26 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", fontFamily: "IRANSANS" }}
              >
ماشین حساب آبیاری
              </Typography>
              <Box sx={{ width: 72, flexShrink: 0 }}>
                <NumberSelect
                  value={filterOperator}
                  emptyLabel="همه"
                  max={operatorsCount}
                  onChange={setFilterOperator}
                  sx={{
                    backgroundColor: COLORS.white,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flex: 1, minHeight: 0, gap: 0 }}>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 1,
                    mb: 1,
                    textAlign: "center",
                    direction: "ltr",
                  }}
                >
                  <Typography
                    sx={{
                      width: "16%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    عملگر
                  </Typography>
                  <Typography
                    sx={{
                      width: "22%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    مدت
                  </Typography>
                  <Typography
                    sx={{
                      width: "24%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    پایان آبیاری
                  </Typography>
                  <Typography
                    sx={{
                      width: "24%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    شروع آبیاری
                  </Typography>
                  <Typography
                    sx={{
                      width: "10%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    حذف
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 0.5,
                    maxHeight: "420px",
                    direction: "ltr",
                  }}
                >
                  {displayRows.map((row, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 0.5,
                        minHeight: "40px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "16%",
                          height: "40px",
                          borderRadius: "20px",
                          backgroundColor: COLORS.white,
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography fontFamily="IRANSANS" fontWeight="bold">
                          {row.zone === "" ? "پوچ" : toPersianDigits(row.zone)}
                        </Typography>
                      </Box>

                      <Box sx={{ width: "22%" }}>
                        <TimeField
                          value={row.duration ?? irrigationDuration}
                          onChange={(v) =>
                            isPreviewMode
                              ? handleBuiltRowChange(idx, "duration", v)
                              : handleRowChange(idx, "duration", v)
                          }
                        />
                      </Box>

                      <Box sx={{ width: "24%" }}>
                        <TimeField
                          value={row.end}
                          onChange={(v) =>
                            isPreviewMode
                              ? handleBuiltRowChange(idx, "end", v)
                              : handleRowChange(idx, "end", v)
                          }
                        />
                      </Box>

                      <Box sx={{ width: "24%" }}>
                        <TimeField
                          value={row.start}
                          onChange={(v) =>
                            isPreviewMode
                              ? handleBuiltRowChange(idx, "start", v)
                              : handleRowChange(idx, "start", v)
                          }
                        />
                      </Box>

                      <Box
                        sx={{
                          width: "10%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          onClick={() =>
                            isPreviewMode
                              ? handleDeleteBuiltRow(idx)
                              : handleDeleteRow(idx)
                          }
                          sx={{
                            p: 0.5,
                            border: `2px solid ${COLORS.red}`,
                            borderRadius: "8px",
                            color: COLORS.red,
                            display: "flex",
                            alignItems: "center",
                            cursor:
                              displayRows.length > 1 ? "pointer" : "not-allowed",
                            opacity: displayRows.length > 1 ? 1 : 0.4,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <IconTextButton
                text="حذف کل جدول"
                icon={<CloseIcon />}
                bgColor="#FFF"
                textColor={COLORS.red}
                width="180px"
                height="50px"
                onClick={handleClearTable}
                sx={{
                  mt: 1.5,
                  borderRadius: "15px",
                  py: 0.8,
                  "& .MuiTypography-root": {
                    fontSize: "0.9rem",
                    fontFamily: "IRANSANS",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ستون چپ: ترتیب + فرم */}
        <Box sx={{ flex: "0 0 calc(38% - 12px)", height: "100%", minWidth: 0 }}>
                  <Box
            sx={{
                                height: "100%",
                                minHeight: 0,
                                display: "flex",
                                flexDirection: "row",
                                gap: 1.2,
                                direction: "ltr",
                              }}
                            >
                    <Box
                      sx={{
                        width: 56,
                        flexShrink: 0,
                        bgcolor: COLORS.bgGrey,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        pt: 0.5,
                        pb: 1,
                        direction: "rtl",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          fontFamily: "IRANSANS",
                          mb: 1,
                          textAlign: "center",
                        }}
                      >
                        ترتیب
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          overflowY: "auto",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          px: 0.5,
                          maxHeight: "420px",
                        }}
                      >
                        {rows.map((row, idx) => (
                          <NumberSelect
                            key={idx}
                            compact
                            value={row.zone}
                            emptyLabel="پوچ"
                            max={operatorsCount}
                            onChange={(v) => handleOrderChange(idx, v)}
                            sx={{ width: 44 }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                                        justifyContent: "flex-start",
                                        alignItems: "stretch",
                                        direction: "rtl",
                      }}
                    >
                      <LabeledField label="نام برنامه">
                        <TextField
                          fullWidth
                          sx={{
                            ...inputStyles,
                            ...labeledFieldBodySx,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 0,
                              boxShadow: "none",
                              backgroundColor: COLORS.white,
                              "& fieldset": { border: "none" },
                            },
                          }}
                          type="text"
                          value={programName}
                          onChange={(e) => setProgramName(e.target.value)}
                          inputProps={{
                            inputMode: "text",
                            lang: "fa",
                            dir: "rtl",
                            "data-virtual-keyboard-mode": "farsi",
                            autoComplete: "off",
                            style: { fontFamily: "IRANSANS" },
                          }}
                        />
                      </LabeledField>

                      <LabeledField label="ساعت شروع عملگر">
                        <TimeField
                          underLabel
                          value={firstIrrigation}
                          onChange={updateFormValue(setFirstIrrigation)}
                        />
                      </LabeledField>

                      <LabeledField label="تعداد دفعات روشن شدن عملگر">
                        <NumberInput
                          underLabel
                          value={irrigationCount}
                          min={1}
                          onChange={updateFormValue(setIrrigationCount)}
                        />
                      </LabeledField>

                      <LabeledField label="فاصله بین دو زمان کارکرد">
                        <TimeField
                          underLabel
                          value={irrigationInterval}
                          onChange={updateFormValue(setIrrigationInterval)}
                        />
                      </LabeledField>

                      <LabeledField label="مدت زمان کارکرد">
                        <TimeField
                          underLabel
                          value={irrigationDuration}
                          onChange={updateFormValue(setIrrigationDuration)}
                        />
                      </LabeledField>

                      <LabeledField label="فاصله بین دو عملگر">
                        <TimeField
                          underLabel
                          value={zoneInterval}
                          onChange={updateFormValue(setZoneInterval)}
                        />
                      </LabeledField>

                      <Box
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 3,
                                                width: "100%",
                                                alignSelf: "stretch",
                                                mt: 0.5,
                                              }}
                                            >
                        <IconTextButton
                          text={isSaving ? "در حال ذخیره..." : "ساخت برنامه"}
                                                    icon={<SwapCallsIcon sx={{ transform: "rotate(90deg)" }} />}
                                                    bgColor={COLORS.green}
                                                    textColor="#000"
                                                    width="87%"
                                                    height="35px"
                          onClick={isSaving ? undefined : handleBuildProgram}
                          sx={{
                            borderRadius: "15px",
                            py: 0.8,
                            opacity: isSaving ? 0.7 : 1,
                            pointerEvents: isSaving ? "none" : "auto",
                            "&:hover": { filter: "brightness(0.95)" },
                            "& .MuiTypography-root": {
                              fontSize: "0.95rem",
                              fontWeight: "bold",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />

                        <IconTextButton
                          text="پاک کردن"
                                                    icon={<CloseIcon />}
                                                    bgColor={COLORS.red}
                                                    textColor="#fff"
                                                    width="87%"
                                                    height="35px"
                          onClick={onClose}
                          sx={{
                            borderRadius: "15px",
                            py: 0.5,
                            "& .MuiTypography-root": {
                              fontSize: "0.85rem",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />

                        <IconTextButton
                          text="ذخیره"
                                                    icon={<SaveIcon />}
                                                    bgColor={COLORS.amber}
                                                    textColor="#000"
                          width="87%"
                          height="35px"
                          onClick={isSaving ? undefined : handleSaveProgram}
                          sx={{
                            borderRadius: "15px",
                            py: 0.5,
                            opacity: isSaving ? 0.7 : 1,
                            pointerEvents: isSaving ? "none" : "auto",
                            "& .MuiTypography-root": {
                              fontSize: "0.85rem",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
      </Box>
    </Box>
  );
}
