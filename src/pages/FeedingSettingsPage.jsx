import React, { useState, useEffect, useMemo } from "react";
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
  getFoodstuffPreparationProgramSpecialParameters,
  updateFoodstuffPreparationProgramSpecialParameters,
} from "../api/solubleApi";
import { queryKeys } from "../api/queryKeys";
import { getSolubleConfig } from "../api/configApi";
import toast from "react-hot-toast";
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

const formatMaxTwoDecimals = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return String(parseFloat(num.toFixed(2)));
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

const ProgramColumn = ({ number, data, onChange, stockNumbers }) => {
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
        flex: "1 1 0",
        minWidth: 0,
        maxWidth: "none",
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

      {stockNumbers.map((num) => (
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
const TAB_LABELS = ["تنظیمات محلول", "تنظیمات ویژه"];

const SPECIAL_PARAMETER_FIELDS = [
  {
    key: "maximum_stock_injection_count",
    label: "حداکثر تعداد تزریق استوک",
    code: "D2648",
    inputMode: "numeric",
  },
  {
    key: "maximum_acid_injection_count",
    label: "حداکثر تعداد تزریق اسید",
    code: "D2650",
    inputMode: "numeric",
  },
  {
    key: "maximum_stock_injection_volume",
    label: "حداکثر لیتر تزریق ۱ استوک",
    code: "D2640",
  },
  {
    key: "maximum_acid_injection_volume",
    label: "حداکثر لیتر تزریق اسید",
    code: "D2642",
  },
  {
    key: "input_waters_maximum_working_duration",
    label: "حداکثر زمان روشن بودن هر ورودی آب",
    code: "D2410",
    helper: "واحد: دهم ثانیه",
    inputMode: "numeric",
  },
  {
    key: "minimum_stock_injection_volume_per_injection",
    label: "حداقل لیتر استوک در هر تزریق",
    code: "D2644",
  },
  {
    key: "minimum_acid_injection_volume_per_injection",
    label: "حداقل لیتر اسید در هر تزریق",
    code: "D2686",
  },
  {
    key: "input_water_ratio",
    label: "کسر تغییر ورودی آب از ۱ به ۲",
    code: "D2392",
  },
  {
    key: "ec_tamcin",
    label: "حد تمکین EC",
    code: "D2414",
  },
  {
    key: "ec_correction_coefficient_over_1000",
    label: "ضریب تصحیح pH در EC بالای ۱۰۰۰",
    code: "D2472",
  },
  {
    key: "ec_correction_coefficient_under_1000",
    label: "ضریب تصحیح pH در EC زیر ۱۰۰۰",
    code: "D2474",
  },
  {
    key: "ph_tamcin",
    label: "حد تمکین میکس هوشمند برای تنظیم pH",
    code: "D2416",
  },
  {
    key: "ec_change_per_ph_injection",
    label: "میزان تغییر EC با اضافه شدن pH",
    code: "D2396",
  },
];

const buildEmptySpecialParameters = () =>
  SPECIAL_PARAMETER_FIELDS.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});

const normalizeSpecialParameters = (data = {}) =>
  SPECIAL_PARAMETER_FIELDS.reduce((acc, field) => {
    const source =
      data?.foodstuff_preparation_program_special_parameters ??
      data?.data?.foodstuff_preparation_program_special_parameters ??
      data;
    const value = source?.[field.key];
    acc[field.key] = formatMaxTwoDecimals(value);
    return acc;
  }, {});

const buildSpecialParametersPayload = (data = {}) =>
  SPECIAL_PARAMETER_FIELDS.reduce((acc, field) => {
    const value = data?.[field.key];
    if (value === "" || value === null || value === undefined) {
      acc[field.key] = 0;
      return acc;
    }
    const numericValue = Number(value);
    acc[field.key] = Number.isNaN(numericValue) ? 0 : numericValue;
    return acc;
  }, {});

const combineProgramQueries = (results) => ({
  isSuccess: results.length > 0 && results.every((query) => query.isSuccess),
  dataUpdatedAt: results.map((query) => query.dataUpdatedAt).join("|"),
  programs: results.reduce((acc, query, index) => {
    acc[PROGRAM_NUMBERS[index]] = query.data || {};
    return acc;
  }, {}),
  refetchAll: () => results.forEach((query) => query.refetch()),
});

const FeedingSettingsPage = ({
  onClose,
  isModal = false,
  mockSpecialParameters,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [programs, setPrograms] = useState({});
  const [initialPrograms, setInitialPrograms] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [initialInputWaterVolume, setInitialInputWaterVolume] = useState("");
  const [isInputWaterInitialized, setIsInputWaterInitialized] = useState(false);
  const [specialParameters, setSpecialParameters] = useState(
    buildEmptySpecialParameters(),
  );
  const [initialSpecialParameters, setInitialSpecialParameters] = useState(
    buildEmptySpecialParameters(),
  );

  const [inputWaterVolume, setInputWaterVolume] = useState("");

  const { data: solubleConfig } = useQuery({
    queryKey: queryKeys.adminSolubleConfig(),
    queryFn: getSolubleConfig,
    staleTime: 5 * 60 * 1000,
  });

  const stockNumbers = useMemo(() => {
    const dosingPumpCount =
      solubleConfig?.number_of_dosing_pumps ??
      solubleConfig?.data?.number_of_dosing_pumps;
    const stockPumpCount = Math.max(0, Number(dosingPumpCount || 0) - 1);
    return Array.from({ length: stockPumpCount }, (_, index) => index + 1);
  }, [solubleConfig]);

  const { data: liveEcPhData } = useQuery({
    queryKey: queryKeys.solubleEcPhTemperature(),
    queryFn: getSolubleEcPhTemperature,
    refetchInterval: 5000,
  });

  const primarySensor = liveEcPhData?.["1"];
  const currentEc = primarySensor?.ec;
  const currentPh = primarySensor?.ph;

  const programQueryResult = useQueries({
    queries: PROGRAM_NUMBERS.map((i) => ({
      queryKey: queryKeys.foodstuffProgram(i),
      queryFn: () => getFoodstuffPreparationProgram(i),
      staleTime: 0,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: "always",
    })),
    combine: combineProgramQueries,
  });

  const isDataReady = programQueryResult.isSuccess;
  const programDataSignature = programQueryResult.dataUpdatedAt;

  const inputWaterRatioQuery = useQuery({
    queryKey: queryKeys.foodstuffInputWaterRatio(),
    queryFn: getFoodstuffPreparationProgramInputWaterRatio,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: "always",
  });

  const specialParametersQuery = useQuery({
    queryKey: queryKeys.foodstuffSpecialParameters(),
    queryFn: getFoodstuffPreparationProgramSpecialParameters,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: "always",
    enabled: !mockSpecialParameters,
  });

  const specialParametersData = mockSpecialParameters ?? specialParametersQuery.data;

  useEffect(() => {
    if (inputWaterRatioQuery.isSuccess) {
      const value = formatOneDecimal(inputWaterRatioQuery.data ?? "");
      setInputWaterVolume(value);
      setInitialInputWaterVolume(value);
      setIsInputWaterInitialized(true);
    }
  }, [inputWaterRatioQuery.isSuccess, inputWaterRatioQuery.data]);

  useEffect(() => {
    if (isDataReady) {
      const newPrograms = programQueryResult.programs;
      setPrograms(newPrograms);
      setInitialPrograms(JSON.parse(JSON.stringify(newPrograms)));
    }
  }, [isDataReady, programDataSignature, programQueryResult.programs]);

  useEffect(() => {
    if (!specialParametersData) return;
    const normalized = normalizeSpecialParameters(specialParametersData);
    setSpecialParameters(normalized);
    setInitialSpecialParameters(normalized);
  }, [specialParametersData]);

  useEffect(() => {
    if (activeTab === 1) {
      setIsSaveDisabled(deepEqual(specialParameters, initialSpecialParameters));
      return;
    }

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
  }, [
    activeTab,
    programs,
    initialPrograms,
    inputWaterVolume,
    initialInputWaterVolume,
    isInputWaterInitialized,
    specialParameters,
    initialSpecialParameters,
  ]);

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

  const updateSpecialParametersMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgramSpecialParameters,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foodstuffSpecialParameters(),
      });
      toast.success("تنظیمات ویژه با موفقیت ذخیره شد");
    },
    onError: (error) => {
      console.error("Error saving special parameters:", error);
      toast.error("خطا در ذخیره تنظیمات ویژه");
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

    if (activeTab === 1) {
      const payload = buildSpecialParametersPayload(specialParameters);
      try {
        await updateSpecialParametersMutation.mutateAsync(payload);
        setInitialSpecialParameters({ ...specialParameters });
        setIsSaveDisabled(true);
      } catch (error) {
        toast.error("خطا در ذخیره‌سازی تنظیمات ویژه");
      }
      return;
    }

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
      programQueryResult.refetchAll();
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

  const handleSpecialParameterChange = (key, value) => {
    const enValue = toEnglishDigits(value);
    if (enValue !== "" && !/^-?\d*\.?\d*$/.test(enValue)) return;

    setSpecialParameters((prev) => ({
      ...prev,
      [key]: enValue,
    }));
  };

  return (
    <Container
      maxWidth={isModal ? false : "xl"}
      sx={{ mt: 4, mb: 0, px: isModal ? "0 !important" : undefined }}
    >
      <Box
        sx={
          isModal
            ? { width: "100%", mx: "auto", pt: 0.5, overflowX: "hidden" }
            : undefined
        }
      >
        {!isModal && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", direction: "rtl", pb: 1, px: 1 }}>
            {/* <Typography fontFamily="IRANSANS" fontWeight="bold" fontSize="1.2rem" sx={{ color: "#333" }}>
              تنظیمات ساخت محلول
            </Typography> */}
            <IconButton onClick={handleBackClick} title="بستن" size="small" sx={{ color: "#FFF", backgroundColor: "red", borderRadius: "8px", "&:hover": { backgroundColor: "#D32F2F" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            height: "auto",
            maxHeight: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              direction: "ltr",
              px: 0,
              pt: 1,
              backgroundColor: "#EFEEEE",
            }}
          >
            {TAB_LABELS.map((label, index) => (
              <Box
                key={label}
                onClick={() => setActiveTab(index)}
                sx={{
                  px: 2.5,
                  ml: index !== 0 ? 1 : 0,
                  height: "44px",
                  minWidth: "130px",
                  borderRadius: "10px 10px 0 0",
                  backgroundColor: activeTab === index ? "#ffffff" : "#FFCB82",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  fontSize={15}
                  fontFamily="IRANSANS"
                  color="#111111"
                  fontWeight={activeTab === index ? "bold" : "normal"}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: { xs: 1, md: 1.5 },
              direction: "rtl",
            }}
          >
            <Grid container spacing={1.5} sx={{ mb: 2, alignItems: "center", overflowY: "visible" }}>
              <Grid item xs={12} md={2.5}>
                <Button variant="contained" startIcon={<SaveIcon />} disabled={isSaveDisabled} sx={{ fontFamily: "IRANSANS", backgroundColor: isSaveDisabled ? "#e0e0e0" : "#F7C98C", color: isSaveDisabled ? "#9e9e9e" : "#333", fontWeight: "bold", "&:hover": { backgroundColor: isSaveDisabled ? "#e0e0e0" : "#f5b982" }, width: "100%", height: "42px", fontSize: "0.9rem", gap: 2 }} onClick={handleSave}>
                  ذخیره
                </Button>
              </Grid>
              {activeTab === 0 && (
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
              )}
            </Grid>

            {activeTab === 0 ? (
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "stretch", flexWrap: "nowrap", width: "100%" }}>
                {[1, 2, 3].map((num) => (
                  <ProgramColumn
                    key={num}
                    number={num}
                    data={programs[num]}
                    stockNumbers={stockNumbers}
                    onChange={(newData) => handleProgramChange(num, newData)}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.2,
                  alignItems: "start",
                }}
              >
                {[0, 1].map((columnIndex) => (
                  <Box
                    key={columnIndex}
                    sx={{
                      display: "grid",
                      gridAutoRows: "62px",
                      gap: 1,
                    }}
                  >
                    {SPECIAL_PARAMETER_FIELDS.filter(
                      (_, index) =>
                        index >=
                          columnIndex *
                            Math.ceil(SPECIAL_PARAMETER_FIELDS.length / 2) &&
                        index <
                          (columnIndex + 1) *
                            Math.ceil(SPECIAL_PARAMETER_FIELDS.length / 2),
                    ).map((field) => (
                      <Paper
                        key={field.key}
                        variant="outlined"
                        sx={{
                          px: 1.2,
                          py: 0.8,
                          borderRadius: "8px",
                          backgroundColor: "#fafafa",
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) 130px",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ minWidth: 0, textAlign: "right" }}>
                          <Typography
                            fontFamily="IRANSANS"
                            fontSize="0.78rem"
                            fontWeight="bold"
                            color="#333"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {field.label}
                          </Typography>
                          {field.helper && (
                            <Typography
                              fontFamily="IRANSANS"
                              fontSize="0.68rem"
                              color="#777"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {field.helper}
                            </Typography>
                          )}
                        </Box>
                        <TextField
                          size="small"
                          variant="outlined"
                          value={toPersianDigits(specialParameters[field.key] ?? "")}
                          onChange={(e) => handleSpecialParameterChange(field.key, e.target.value)}
                          inputProps={{ inputMode: field.inputMode || "decimal" }}
                          sx={{
                            width: "130px",
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "6px 8px",
                              fontSize: "0.78rem",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FeedingSettingsPage;
