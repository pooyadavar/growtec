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
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFoodstuffPreparationProgram,
  updateFoodstuffPreparationProgram,
  getSolubleEcPhTemperature,
  getFoodstuffPreparationProgramInputWaterRatio,
  updateFoodstuffPreparationProgramInputWaterRatio,
} from "../api/solubleApi";
import { queryKeys } from "../api/queryKeys";
import toast, { Toaster } from "react-hot-toast";
import { toPersianDigits, toEnglishDigits } from "../utils/persianDigits";

const ONE_DECIMAL_INPUT = /^\d*(\.\d?)?$/;

const formatOneDecimal = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toFixed(1);
};

const toOneDecimalNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return parseFloat(num.toFixed(1));
};

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

const ProgramColumn = ({ number, data, onChange }) => {
  const handleChange = (field, value) => {
    const enValue = toEnglishDigits(value);
    
    if (enValue !== "" && !/^\d*\.?\d*$/.test(enValue)) return;

    if (field.startsWith("stock_percent.")) {
      const key = field.split(".")[1];
      const newStockPercent = { ...(data?.stock_percent || {}), [key]: enValue };
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
        برنامه {toPersianDigits(number)}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          خطای مجاز EC
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianDigits(data?.ec_acceptable_error ?? "")}
          onChange={(e) => handleChange("ec_acceptable_error", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          EC مطلوب
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianDigits(data?.target_ec ?? "")}
          onChange={(e) => handleChange("target_ec", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <Box key={num} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
            ماده {toPersianDigits(num)}
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
            value={toPersianDigits(data?.stock_percent?.[num.toString()] ?? "")}
            onChange={(e) => handleChange(`stock_percent.${num}`, e.target.value)}
            inputProps={{ inputMode: "decimal" }}
          />
        </Box>
      ))}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          PH مطلوب
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianDigits(data?.target_ph ?? "")}
          onChange={(e) => handleChange("target_ph", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          خطای قابل قبول pH
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianDigits(data?.ph_acceptable_error ?? "")}
          onChange={(e) => handleChange("ph_acceptable_error", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.75rem", minWidth: "90px" }}>
          ضریب تصحیح EC
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ flex: 1, "& .MuiInputBase-input": { textAlign: "center", padding: "4px 8px", fontSize: "0.75rem", fontFamily: "IRANSANS" } }}
          value={toPersianDigits(data?.ec_correction_coefficient ?? "")}
          onChange={(e) => handleChange("ec_correction_coefficient", e.target.value)}
          inputProps={{ inputMode: "decimal" }}
        />
      </Box>
    </Paper>
  );
};

const PROGRAM_NUMBERS = [1, 2, 3];

const FeedingSettingsPage = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState({});
  const [initialPrograms, setInitialPrograms] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [initialInputWaterVolume, setInitialInputWaterVolume] = useState("");
  const [isInputWaterInitialized, setIsInputWaterInitialized] = useState(false);

  const [inputWaterVolume, setInputWaterVolume] = useState("");

  const { data: liveEcPhData } = useQuery({
    queryKey: queryKeys.solubleEcPhTemperature(),
    queryFn: getSolubleEcPhTemperature,
    refetchInterval: 5000,
  });

  const primarySensor = liveEcPhData?.["1"];
  const currentEc = primarySensor?.ec;
  const currentPh = primarySensor?.ph;

  const programQueries = useQueries({
    queries: PROGRAM_NUMBERS.map((i) => ({
      queryKey: queryKeys.foodstuffProgram(i),
      queryFn: () => getFoodstuffPreparationProgram(i),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })),
  });

  const isDataReady = programQueries.length > 0 && programQueries.every((q) => q.isSuccess);

  const inputWaterRatioQuery = useQuery({
    queryKey: queryKeys.foodstuffInputWaterRatio(),
    queryFn: getFoodstuffPreparationProgramInputWaterRatio,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (inputWaterRatioQuery.isSuccess && !isInputWaterInitialized) {
      const value = formatOneDecimal(inputWaterRatioQuery.data ?? "");
      setInputWaterVolume(value);
      setInitialInputWaterVolume(value);
      setIsInputWaterInitialized(true);
    }
  }, [inputWaterRatioQuery.isSuccess, inputWaterRatioQuery.data, isInputWaterInitialized]);

  useEffect(() => {
    if (isDataReady && Object.keys(initialPrograms).length === 0) {
      const newPrograms = {};
      programQueries.forEach((query, index) => {
        // اطمینان از اینکه اگر دیتایی از سمت بک‌اند نیامد، مقادیر پیش‌فرض ست شود
        newPrograms[PROGRAM_NUMBERS[index]] = query.data || {};
      });
      setPrograms(newPrograms);
      setInitialPrograms(JSON.parse(JSON.stringify(newPrograms)));
    }
  }, [initialPrograms, isDataReady, programQueries]);

  useEffect(() => {
    if (
      Object.keys(programs).length === 0 ||
      Object.keys(initialPrograms).length === 0
    ) {
      const hasInputWaterChanges =
        isInputWaterInitialized && inputWaterVolume !== initialInputWaterVolume;
      setIsSaveDisabled(!hasInputWaterChanges);
      return;
    }
    const hasProgramChanges = !deepEqual(programs, initialPrograms);
    const hasInputWaterChanges =
      isInputWaterInitialized && inputWaterVolume !== initialInputWaterVolume;
    setIsSaveDisabled(!hasProgramChanges && !hasInputWaterChanges);
  }, [programs, initialPrograms, inputWaterVolume, initialInputWaterVolume, isInputWaterInitialized]);

  const queryClient = useQueryClient();

  const updateProgramMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgram,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foodstuffProgram(variables.program_number),
      });
      toast.success(`برنامه ${variables.program_number} با موفقیت ذخیره شد`);
    },
    onError: (error, variables) => {
      console.error(`Error saving program ${variables.program_number}:`, error);
      toast.error(`خطا در ذخیره برنامه ${variables.program_number}`);
    },
  });

  const updateInputWaterRatioMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgramInputWaterRatio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foodstuffInputWaterRatio(),
      });
      toast.success("حجم تغییر آب ورودی با موفقیت ذخیره شد");
    },
    onError: (error) => {
      console.error("Error saving input water ratio:", error);
      toast.error("خطا در ذخیره حجم تغییر آب ورودی");
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
      const initial = initialPrograms[i] || {};
      const current = programs[i] || {};

      if (!deepEqual(initial, current)) {
        updatePromises.push(
          updateProgramMutation.mutateAsync({
            program_number: i,
            program: current,
          }),
        );
      }
    }

    if (inputWaterVolume !== initialInputWaterVolume) {
      updatePromises.push(
        updateInputWaterRatioMutation.mutateAsync(
          toOneDecimalNumber(inputWaterVolume),
        ),
      );
    }

    try {
      await Promise.all(updatePromises);
      programQueries.forEach((query) => query.refetch());
      inputWaterRatioQuery.refetch();
      setInitialPrograms(JSON.parse(JSON.stringify(programs)));
      setInitialInputWaterVolume(inputWaterVolume);
      setIsSaveDisabled(true);
    } catch (error) {
      toast.error("خطا در ذخیره‌سازی برخی از برنامه‌ها");
    }
  };

  const handleProgramChange = (programNumber, newData) => {
    setPrograms((prev) => ({
      ...prev,
      [programNumber]: newData,
    }));
  };

  const handleInputWaterVolumeChange = (e) => {
    const enValue = toEnglishDigits(e.target.value);
    if (enValue === "" || ONE_DECIMAL_INPUT.test(enValue)) {
      setInputWaterVolume(enValue);
    }
  };

  const handleInputWaterVolumeBlur = () => {
    if (inputWaterVolume === "") return;
    const num = Number(inputWaterVolume);
    if (!Number.isNaN(num)) {
      setInputWaterVolume(formatOneDecimal(num));
    }
  };

  return (
    <Container
      maxWidth={isModal ? false : "xl"}
      sx={{ mt: 1, mb: 0, px: isModal ? "0 !important" : undefined }}
    >
      <Box
        sx={
          isModal
            ? { width: "100%", mx: "auto", pt: 0.5, overflowX: "hidden" }
            : undefined
        }
      >
        <Toaster position="top-center" reverseOrder={false} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl", pb: 1, px: 1 }}>
          <Typography fontFamily="IRANSANS" fontWeight="bold" fontSize="1.2rem" sx={{ color: "#333" }}>
            تنظیمات ساخت محلول
          </Typography>
          {!isModal && (
            <IconButton onClick={handleBackClick} title="بستن" size="small" sx={{ color: "#FFF", backgroundColor: "red", borderRadius: "8px", "&:hover": { backgroundColor: "#D32F2F" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Paper elevation={3} sx={{ height: "auto", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column", borderRadius: "10px", overflow: "hidden" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 1, md: 1.5 }, direction: "rtl" }}>
            <Grid container spacing={1.5} sx={{ mb: 2, alignItems: "center", overflowY: "visible" }}>
              <Grid item xs={12} md={2.5}>
                <Button variant="contained" startIcon={<SaveIcon />} disabled={isSaveDisabled} sx={{ fontFamily: "IRANSANS", backgroundColor: isSaveDisabled ? "#e0e0e0" : "#F7C98C", color: isSaveDisabled ? "#9e9e9e" : "#333", fontWeight: "bold", "&:hover": { backgroundColor: isSaveDisabled ? "#e0e0e0" : "#f5b982" }, width: "100%", height: "42px", fontSize: "0.9rem", gap: 2 }} onClick={handleSave}>
                  ذخیره
                </Button>
              </Grid>
              <Grid item xs={12} md={9.5}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}>
                      حجم تغییر آب ورودی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={toPersianDigits(inputWaterVolume)}
                      onChange={handleInputWaterVolumeChange}
                      onBlur={handleInputWaterVolumeBlur}
                      inputProps={{ inputMode: "decimal" }}
                      sx={{ "& .MuiInputBase-input": { textAlign: "center", padding: "6px 8px", fontSize: "0.8rem", fontFamily: "IRANSANS" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}>
                      pH فعلی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={
                        currentPh !== undefined && currentPh !== null
                          ? toPersianDigits(formatOneDecimal(currentPh))
                          : ""
                      }
                      inputProps={{ readOnly: true }}
                      sx={{ "& .MuiInputBase-input": { textAlign: "center", padding: "6px 8px", fontSize: "0.8rem", fontFamily: "IRANSANS" }, backgroundColor: "#f5f5f5" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.3, fontSize: "0.8rem", textAlign: "right" }}>
                      EC فعلی
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={
                        currentEc !== undefined && currentEc !== null
                          ? toPersianDigits(formatOneDecimal(currentEc))
                          : ""
                      }
                      inputProps={{ readOnly: true }}
                      sx={{ "& .MuiInputBase-input": { textAlign: "center", padding: "6px 8px", fontSize: "0.8rem", fontFamily: "IRANSANS" }, backgroundColor: "#f5f5f5" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "nowrap" }}>
              {[1, 2, 3].map((num) => (
                <ProgramColumn key={num} number={num} data={programs[num]} onChange={(newData) => handleProgramChange(num, newData)} />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default FeedingSettingsPage;
