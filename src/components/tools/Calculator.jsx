import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography, Grid } from "@mui/material";
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

const MOCK_OPERATORS_COUNT = 8;

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

const durationToSeconds = ({ hours = 0, minutes = 0 }) =>
  Math.max(0, Number(hours) || 0) * 3600 +
  Math.max(0, Number(minutes) || 0) * 60;

const emptyDuration = () => ({ hours: 0, minutes: 0 });

const clampDurationPart = (field, raw) => {
  const n = Math.max(0, parseInt(toEnglishDigits(String(raw)), 10) || 0);
  if (field === "minutes") return Math.min(59, n);
  return Math.min(99, n);
};

const formatSecondsToTime = (totalSeconds) => {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600) % 24;
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

const createEmptyRow = (index, operator = 1) => ({
  order: index + 1,
  zone: operator,
  start: "00:00:00",
  end: "00:00:00",
});

const resolveOperatorsCount = (config) => {
  const count = Number(
    config?.operators_count ??
      config?.operator_count ??
      config?.operators?.length ??
      0,
  );
  return count > 0 ? count : MOCK_OPERATORS_COUNT;
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

const durationInputSx = {
  ...inputStyles,
  width: "44px",
  minWidth: "44px",
  flexShrink: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: COLORS.bgGrey,
    boxShadow: "none",
    height: "28px",
    "& fieldset": { border: "none" },
  },
  "& .MuiOutlinedInput-input": {
    padding: "2px 0",
    fontSize: "0.8rem",
  },
};

const DurationField = ({ value, onChange, underLabel = false }) => {
  const hours = value?.hours ?? 0;
  const minutes = value?.minutes ?? 0;

  const handlePartChange = (field, raw) => {
    onChange({
      ...value,
      [field]: clampDurationPart(field, raw),
    });
  };

  return (
    <Box
      sx={{
        ...(underLabel ? labeledFieldBodySx : fieldShellSx),
        height: "40px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "center",
        px: 0.75,
        gap: 0.4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: "bold",
          fontFamily: "IRANSANS",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        دقیقه
      </Typography>
      <TextField
        sx={durationInputSx}
        value={toPersianDigits(minutes)}
        onChange={(e) => handlePartChange("minutes", e.target.value)}
        inputProps={{
          inputMode: "numeric",
          style: { fontFamily: "IRANSANS", textAlign: "center", padding: 0 },
        }}
      />
      <Typography
        sx={{
          fontWeight: "bold",
          fontFamily: "IRANSANS",
          flexShrink: 0,
          px: 0.2,
        }}
      >
        :
      </Typography>
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: "bold",
          fontFamily: "IRANSANS",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        ساعت
      </Typography>
      <TextField
        sx={durationInputSx}
        value={toPersianDigits(hours)}
        onChange={(e) => handlePartChange("hours", e.target.value)}
        inputProps={{
          inputMode: "numeric",
          style: { fontFamily: "IRANSANS", textAlign: "center", padding: 0 },
        }}
      />
    </Box>
  );
};

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
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        ...selectStyles,
        height: compact ? "34px" : "40px",
        fontSize: compact ? "0.85rem" : "0.9rem",
      }}
    >
      {Array.from({ length: max - min + 1 }, (_, i) => {
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

export default function IrrigationCalculatorPage({
  onClose,
  operatorsCount: operatorsCountProp,
}) {
  const { data: irrigationConfig } = useQuery({
    queryKey: ["irrigationConfig"],
    queryFn: getIrrigationConfig,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const operatorsCount = useMemo(() => {
    if (operatorsCountProp > 0) return operatorsCountProp;
    return resolveOperatorsCount(irrigationConfig);
  }, [operatorsCountProp, irrigationConfig]);

  const [programName, setProgramName] = useState("");
  const [headerOperator, setHeaderOperator] = useState(1);
  const [firstIrrigation, setFirstIrrigation] = useState("00:00:00");
  const [irrigationCount, setIrrigationCount] = useState(1);
  const [irrigationInterval, setIrrigationInterval] = useState(emptyDuration);
  const [irrigationDuration, setIrrigationDuration] = useState(emptyDuration);
  const [zoneInterval, setZoneInterval] = useState(emptyDuration);
  const [rows, setRows] = useState([createEmptyRow(0, 1)]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHeaderOperator((prev) => Math.min(Math.max(prev, 1), operatorsCount));
  }, [operatorsCount]);

  useEffect(() => {
    setRows((prev) =>
      Array.from({ length: irrigationCount }, (_, i) => {
        if (prev[i]) {
          return {
            ...prev[i],
            order: i + 1,
            zone: Math.min(Math.max(prev[i].zone ?? 1, 1), operatorsCount),
          };
        }
        return createEmptyRow(i, headerOperator);
      }),
    );
  }, [irrigationCount, operatorsCount]);

  const buildProgramRows = () => {
    const first = parseTimeToSeconds(firstIrrigation);
    const interval = durationToSeconds(irrigationInterval);
    const duration = durationToSeconds(irrigationDuration);
    const zoneGap = durationToSeconds(zoneInterval);

    const built = [];
    for (let i = 0; i < irrigationCount; i++) {
      let startSec;
      if (interval > 0) {
        startSec = first + i * interval;
      } else if (i === 0) {
        startSec = first;
      } else {
        startSec = parseTimeToSeconds(built[i - 1].end) + zoneGap;
      }

      built.push({
        order: i + 1,
        zone: rows[i]?.zone ?? headerOperator,
        start: formatSecondsToTime(startSec),
        end: formatSecondsToTime(startSec + duration),
      });
    }
    return built;
  };

  const handleBuildProgram = async () => {
    if (!programName.trim()) {
      toast.error("نام برنامه را وارد کنید");
      return;
    }

    const built = buildProgramRows();
    setRows(built);

    const programData = {
      programName: programName.trim(),
      headerOperator,
      operatorsCount,
      firstIrrigation,
      irrigationCount,
      irrigationInterval,
      irrigationDuration,
      zoneInterval,
      schedule: built,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      const result = await saveIrrigationProgramToFile(
        programName.trim(),
        programData,
      );
      toast.success(`فایل ${result.fileName} در روت پروژه ذخیره شد`);
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

  const handleDeleteRow = (index) => {
    if (rows.length <= 1) return;
    const next = rows
      .filter((_, i) => i !== index)
      .map((row, i) => ({
        ...row,
        order: i + 1,
        zone: i + 1,
      }));
    setRows(next);
    setIrrigationCount(next.length);
  };

  const handleClearTable = () => {
    setRows(
      Array.from({ length: irrigationCount }, (_, i) =>
        createEmptyRow(i, headerOperator),
      ),
    );
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
      <Grid
        container
        spacing={1.5}
        alignItems="stretch"
        sx={{ maxWidth: "1000px", margin: "0 auto", height: "100%" }}
      >
        <Grid item xs={12} md={7}>
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
                ماشین حساب آبیاری عملگر (دراپ باکس)
              </Typography>
              <Box sx={{ width: 72, flexShrink: 0 }}>
                <NumberSelect
                  value={headerOperator}
                  max={operatorsCount}
                  onChange={setHeaderOperator}
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
                      width: "32%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    شروع آبیاری
                  </Typography>
                  <Typography
                    sx={{
                      width: "32%",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    پایان آبیاری
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
                  {rows.map((row, idx) => (
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
                      <NumberSelect
                        value={row.zone}
                        max={operatorsCount}
                        onChange={(v) => handleRowChange(idx, "zone", v)}
                        sx={{
                          width: "16%",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        }}
                      />

                      <Box sx={{ width: "32%" }}>
                        <TimeField
                          value={row.start}
                          onChange={(v) => handleRowChange(idx, "start", v)}
                        />
                      </Box>

                      <Box sx={{ width: "32%" }}>
                        <TimeField
                          value={row.end}
                          onChange={(v) => handleRowChange(idx, "end", v)}
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
                          onClick={() => handleDeleteRow(idx)}
                          sx={{
                            p: 0.5,
                            border: `2px solid ${COLORS.red}`,
                            borderRadius: "8px",
                            color: COLORS.red,
                            display: "flex",
                            alignItems: "center",
                            cursor: rows.length > 1 ? "pointer" : "not-allowed",
                            opacity: rows.length > 1 ? 1 : 0.4,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  width: 56,
                  flexShrink: 0,
                  bgcolor: COLORS.bgGrey,
                  borderRight: "1px solid #9F9F9F",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pt: 0.5,
                  pb: 1,
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
                  }}
                >
                  {rows.map((row, idx) => (
                    <NumberSelect
                      key={idx}
                      compact
                      value={row.order}
                      max={irrigationCount}
                      onChange={(v) => handleRowChange(idx, "order", v)}
                      sx={{ width: 44 }}
                    />
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
                width="200px"
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
        </Grid>

        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "flex-start",
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
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              inputProps={{ style: { fontFamily: "IRANSANS" } }}
            />
          </LabeledField>

          <LabeledField label="ساعت شروع عملگر">
            <TimeField
              underLabel
              value={firstIrrigation}
              onChange={setFirstIrrigation}
            />
          </LabeledField>

          <LabeledField label="تعداد دفعات روشن شدن عملگر">
            <NumberSelect
              underLabel
              value={irrigationCount}
              min={1}
              max={20}
              onChange={setIrrigationCount}
            />
          </LabeledField>

          <LabeledField label="فاصله بین دو زمان کارکرد">
            <DurationField
              underLabel
              value={irrigationInterval}
              onChange={setIrrigationInterval}
            />
          </LabeledField>

          <LabeledField label="مدت زمان کارکرد">
            <DurationField
              underLabel
              value={irrigationDuration}
              onChange={setIrrigationDuration}
            />
          </LabeledField>

          <LabeledField label="فاصله بین دو عملگر">
            <DurationField
              underLabel
              value={zoneInterval}
              onChange={setZoneInterval}
            />
          </LabeledField>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "90%",
              alignSelf: "right",
              mt: 0.5,
            }}
          >
            <IconTextButton
              text={isSaving ? "در حال ذخیره..." : "ساخت برنامه"}
              icon={<SwapCallsIcon sx={{ transform: "rotate(90deg)" }} />}
              bgColor={COLORS.green}
              textColor="#000"
              width="100%"
              height="40px"
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
              width="100%"
              height="40px"
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
              width="100%"
              height="40px"
              sx={{
                borderRadius: "15px",
                py: 0.5,
                "& .MuiTypography-root": {
                  fontSize: "0.85rem",
                  fontFamily: "IRANSANS",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
