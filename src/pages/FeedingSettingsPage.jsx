import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFoodstuffPreparationProgram,
  updateFoodstuffPreparationProgram,
} from "../api/solubleApi";
import toast, { Toaster } from "react-hot-toast";

// --- Helper for deep comparison handling string/number equality ---
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    const n1 = Number(obj1);
    const n2 = Number(obj2);
    if (!isNaN(n1) && !isNaN(n2)) {
      return n1 === n2;
    }
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

// --- Helper function to convert numbers to Persian numerals ---
const toPersianNumber = (num) => {
  if (num === null || num === undefined || num === "") return "";
  return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

// --- Helper function to convert Persian numbers to English digits for validation ---
const toEnglishNumber = (str) => {
  if (str === null || str === undefined || str === "") return "";
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  let result = String(str);
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianNumbers[i], i);
  }
  return result;
};

// --- کامپوننت کمکی برای ستون‌های برنامه ---
const ProgramColumn = ({ number, data, onChange }) => {
  const handleChange = (field, value) => {
    const enValue = toEnglishNumber(value);
    
    if (enValue !== "" && !/^\d*\.?\d*$/.test(enValue)) return;

    if (field.startsWith("stock_percent.")) {
      const key = field.split(".")[1];
      const newStockPercent = { ...data.stock_percent, [key]: enValue };
      onChange({ ...data, stock_percent: newStockPercent });
    } else {
      onChange({ ...data, [field]: enValue });
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        flex: 1,
        minWidth: 200,
        maxWidth: 250,
        borderRadius: "6px",
        backgroundColor: "#fafafa",
      }}
    >
      <Typography
        fontFamily="IRANSANS"
        fontWeight="bold"
        textAlign="center"
        mb={0.5}
        fontSize="0.9rem"
        sx={{
          backgroundColor: "#F7C98C",
          py: 0.5,
          borderRadius: "4px",
          color: "#333",
        }}
      >
        برنامه {toPersianNumber(number)}
      </Typography>

      {/* خطای مجاز EC */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          خطای مجاز EC
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.ec_acceptable_error ?? "")}
          onChange={(e) => handleChange("ec_acceptable_error", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {/* EC مطلوب */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          EC مطلوب
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.target_ec ?? "")}
          onChange={(e) => handleChange("target_ec", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {/* ماده ۱ تا ۱۳ */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
        <Box key={num} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
            ماده {toPersianNumber(num)}
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
            value={toPersianNumber(data?.stock_percent?.[num.toString()] ?? "")}
            onChange={(e) => handleChange(`stock_percent.${num}`, e.target.value)}
            inputProps={{ inputMode: "decimal" }}
          />
        </Box>
      ))}

      {/* PH مطلوب */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          PH مطلوب
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.target_ph ?? "")}
          onChange={(e) => handleChange("target_ph", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {/* لیتر اسید */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          لیتر اسید
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.acid_liter ?? "")}
          onChange={(e) => handleChange("acid_liter", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {/* خطای قابل قبول pH */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          خطای قابل قبول pH
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.ph_acceptable_error ?? "")}
          onChange={(e) => handleChange("ph_acceptable_error", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {/* ضریب تصحیح EC */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          ضریب تصحیح EC
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianNumber(data?.ec_correction_factor ?? "")}
          onChange={(e) => handleChange("ec_correction_factor", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>
    </Paper>
  );
};

// --- کامپوننت اصلی صفحه ---
const FeedingSettingsPage = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState({});
  const [initialPrograms, setInitialPrograms] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [inputWaterVolume, setInputWaterVolume] = useState("");

  const programNumbers = [1, 2, 3];

  const programQueries = useQueries({
    queries: programNumbers.map((i) => ({
      queryKey: ["foodstuffProgram", i],
      queryFn: () => getFoodstuffPreparationProgram(i),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    })),
  });

  // بررسی وضعیت لود شدن کوئری‌ها به عنوان یک متغیر ساده
  const isDataReady = programQueries.length > 0 && programQueries.every((q) => q.isSuccess);

  useEffect(() => {
    // فرم فقط یک‌بار وقتی که دیتا آماده شد پر می‌شود تا با تایپ کاربر تداخل نکند
    if (isDataReady && Object.keys(initialPrograms).length === 0) {
      const newPrograms = {};
      programQueries.forEach((query, index) => {
        newPrograms[programNumbers[index]] = query.data;
      });
      setPrograms(newPrograms);
      setInitialPrograms(JSON.parse(JSON.stringify(newPrograms)));
    }
  }, [isDataReady]); // وابستگی درست شد

  useEffect(() => {
    if (
      Object.keys(programs).length === 0 ||
      Object.keys(initialPrograms).length === 0
    )
      return;
    const hasChanges = !deepEqual(programs, initialPrograms);
    setIsSaveDisabled(!hasChanges);
  }, [programs, initialPrograms]);

  const queryClient = useQueryClient();

  const updateProgramMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgram,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "foodstuffProgram",
        variables.program_number,
      ]);
      toast.success(`برنامه ${variables.program_number} با موفقیت ذخیره شد`);
    },
    onError: (error, variables) => {
      console.error(`Error saving program ${variables.program_number}:`, error);
      toast.error(`خطا در ذخیره برنامه ${variables.program_number}`);
    },
  });

  const handleBackClick = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate(-1);
  };

  const handleSave = async () => {
    if (isSaveDisabled) return;

    const updatePromises = [];
    for (let i = 1; i <= 3; i++) {
      const initial = initialPrograms[i];
      const current = programs[i];

      if (!deepEqual(initial, current)) {
        const payload = {
          program_number: i,
          foodstuff_preparation_program: {
            target_ec: Number(current.target_ec),
            ec_acceptable_error: Number(current.ec_acceptable_error),
            target_ph: Number(current.target_ph),
            ph_acceptable_error: Number(current.ph_acceptable_error),
            acid_liter: Number(current.acid_liter),
            ec_correction_factor: Number(current.ec_correction_factor),
            stock_percent: {
              1: Number(current.stock_percent?.["1"] || 0),
              2: Number(current.stock_percent?.["2"] || 0),
              3: Number(current.stock_percent?.["3"] || 0),
              4: Number(current.stock_percent?.["4"] || 0),
              5: Number(current.stock_percent?.["5"] || 0),
              6: Number(current.stock_percent?.["6"] || 0),
              7: Number(current.stock_percent?.["7"] || 0),
              8: Number(current.stock_percent?.["8"] || 0),
              9: Number(current.stock_percent?.["9"] || 0),
              10: Number(current.stock_percent?.["10"] || 0),
              11: Number(current.stock_percent?.["11"] || 0),
              12: Number(current.stock_percent?.["12"] || 0),
              13: Number(current.stock_percent?.["13"] || 0),
            },
          },
        };
        updatePromises.push(updateProgramMutation.mutateAsync(payload));
      }
    }

    try {
      await Promise.all(updatePromises);
      programQueries.forEach((query) => query.refetch());
      setInitialPrograms(JSON.parse(JSON.stringify(programs)));
      setIsSaveDisabled(true);
    } catch (error) {
      toast.error("خطا در ذخیره سازی برخی از برنامه ها");
    }
  };

  const handleProgramChange = (programNumber, newData) => {
    setPrograms((prev) => ({
      ...prev,
      [programNumber]: newData,
    }));
  };

  const handleInputWaterVolumeChange = (e) => {
    const enValue = toEnglishNumber(e.target.value);
    if (enValue === "" || /^\d*\.?\d*$/.test(enValue)) {
      setInputWaterVolume(enValue);
    }
  };

  return (
    <Container
      maxWidth={isModal ? false : "xl"}
      sx={{
        mt: 1,
        mb: 0,
        px: isModal ? "0 !important" : undefined,
      }}
    >
      <Box
        sx={
          isModal
            ? {
                transform: {
                  xs: "scale(0.94)",
                  md: "scale(0.92)",
                },
                transformOrigin: "top center",
                width: "100%",
                mx: "auto",
                pt: 0.5,
                overflowX: "hidden",
              }
            : undefined
        }
      >
        <Toaster position="top-center" reverseOrder={false} />

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            direction: "rtl",
            pb: 1,
            px: 1,
          }}
        >
          <Typography
            fontFamily="IRANSANS"
            fontWeight="bold"
            fontSize="1.2rem"
            sx={{ color: "#333" }}
          >
            تنظیمات ساخت محلول
          </Typography>
          <IconButton
            onClick={handleBackClick}
            title="بستن"
            size="small"
            sx={{
              color: "#FFF",
              backgroundColor: "red",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#D32F2F" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Paper
          elevation={3}
          sx={{
            height: "auto",
            maxHeight: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: { xs: 1, md: 1.5 },
              direction: "rtl",
            }}
          >
            {/* Top Controls Row */}
            <Grid
              container
              spacing={1.5}
              sx={{ mb: 2, alignItems: "center", overflowY: "visible" }}
            >
              <Grid item xs={12} md={2.5}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSaveDisabled}
                  sx={{
                    fontFamily: "IRANSANS",
                    backgroundColor: isSaveDisabled ? "#e0e0e0" : "#F7C98C",
                    color: isSaveDisabled ? "#9e9e9e" : "#333",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: isSaveDisabled ? "#e0e0e0" : "#f5b982",
                    },
                    width: "100%",
                    height: "42px",
                    fontSize: "0.9rem",
                    gap:2,
                  }}
                  onClick={handleSave}
                >
                  ذخیره
                </Button>
              </Grid>
              <Grid item xs={12} md={9.5}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}
                    >
                      حجم تغییر آب ورودی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={toPersianNumber(inputWaterVolume)}
                      onChange={handleInputWaterVolumeChange}
                      inputProps={{ inputMode: "decimal" }}
                      sx={{
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                          padding: "6px 8px",
                          fontSize: "0.8rem",
                          fontFamily: "IRANSANS",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}
                    >
                      pH فعلی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      inputProps={{ readOnly: true }}
                      sx={{
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                          padding: "6px 8px",
                          fontSize: "0.8rem",
                          fontFamily: "IRANSANS",
                        },
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}
                    >
                      EC فعلی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      inputProps={{ readOnly: true }}
                      sx={{
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                          padding: "6px 8px",
                          fontSize: "0.8rem",
                          fontFamily: "IRANSANS",
                        },
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Programs Section */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                justifyContent: "center",
                flexWrap: "nowrap",
              }}
            >
              {[1, 2, 3].map((num) => (
                <ProgramColumn
                  key={num}
                  number={num}
                  data={programs[num]}
                  onChange={(newData) => handleProgramChange(num, newData)}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default FeedingSettingsPage;