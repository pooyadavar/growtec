import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFoodstuffPreparationProgram,
  updateFoodstuffPreparationProgram,
  getFoodstuffPreparationProgramPh,
  updateFoodstuffPreparationProgramPh,
} from "../api/solubleApi";
import toast, { Toaster } from "react-hot-toast";

// --- Helper for deep comparison handling string/number equality ---
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
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


// --- کامپوننت کمکی برای ستون‌های برنامه (عریض‌تر و فشرده‌تر) ---
const PlanColumnEc = ({ number, data, onChange }) => {
  const handleChange = (field, value) => {
     if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    if (field.startsWith("stock_percent.")) {
        const key = field.split(".")[1];
        const newStockPercent = { ...data.stock_percent, [key]: value };
        onChange({ ...data, stock_percent: newStockPercent });
    } else {
        onChange({ ...data, [field]: value });
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
        minWidth: 185,
        borderRadius: "8px",
      }}
    >
      <Typography
        fontFamily="IRANSANS"
        fontWeight="bold"
        textAlign="center"
        mb={1}
        fontSize="1rem"
      >
        {toPersianNumber(number)}
      </Typography>

      {/* ردیف‌های داخل ستون */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم A</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["1"] ?? "")}
          onChange={(e) => handleChange("stock_percent.1", e.target.value)}
          inputProps={{ inputMode: 'decimal' }} 
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم B</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["2"] ?? "")}
          onChange={(e) => handleChange("stock_percent.2", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم C</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["3"] ?? "")}
          onChange={(e) => handleChange("stock_percent.3", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم D</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["4"] ?? "")}
          onChange={(e) => handleChange("stock_percent.4", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم E</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["5"] ?? "")}
          onChange={(e) => handleChange("stock_percent.5", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم F</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.stock_percent?.["6"] ?? "")}
          onChange={(e) => handleChange("stock_percent.6", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>EC مطلوب</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.target_ec ?? "")}
          onChange={(e) => handleChange("target_ec", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>خطای مجاز</Typography>
        <TextField
          size="small"
          variant="outlined"
          sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
          value={toPersianNumber(data?.ec_acceptable_error ?? "")}
          onChange={(e) => handleChange("ec_acceptable_error", e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Box>
    </Paper>
  );
};

// --- کامپوننت کمکی برای ستون‌های برنامه pH ---
const PlanColumnPh = ({ number, data, onChange }) => {
    const handleChange = (field, value) => {
        if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                minWidth: 185,
                borderRadius: "8px",
            }}
        >
            <Typography
                fontFamily="IRANSANS"
                fontWeight="bold"
                textAlign="center"
                mb={1}
                fontSize="1rem"
            >
                {toPersianNumber(number)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>حجم</Typography>
                <TextField
                    size="small"
                    variant="outlined"
                    sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
                    value={""} // Empty as requested
                    inputProps={{ readOnly: true }} // Make it read-only
                />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>ph مطلوب</Typography>
                <TextField
                    size="small"
                    variant="outlined"
                    sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
                    value={toPersianNumber(data?.target_ph ?? "")}
                    onChange={(e) => handleChange("target_ph", e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography fontFamily="IRANSANS" sx={{ fontSize: "0.9rem" }}>خطای مطلوب</Typography>
                <TextField
                    size="small"
                    variant="outlined"
                    sx={{ width: "100px", "& .MuiInputBase-input": { textAlign: 'center' } }}
                    value={toPersianNumber(data?.ph_acceptable_error ?? "")}
                    onChange={(e) => handleChange("ph_acceptable_error", e.target.value)}
                    inputProps={{ inputMode: 'decimal' }}
                />
            </Box>
        </Paper>
    );
};


// --- کامپوننت اصلی صفحه ---
const FeedingSettingsPage = ({ onClose, isModal = false }) => {
  const [tabValue, setTabValue] = useState(2);
  const navigate = useNavigate();

    const [ecPrograms, setEcPrograms] = useState({});

    const [initialEcPrograms, setInitialEcPrograms] = useState({}); 

    const [isEcSaveDisabled, setIsEcSaveDisabled] = useState(true);

  

    const [phPrograms, setPhPrograms] = useState({});

    const [initialPhPrograms, setInitialPhPrograms] = useState({});

    const [isPhSaveDisabled, setIsPhSaveDisabled] = useState(true);
  
  // Slider state
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  

    const programNumbers = [1, 2, 3, 4, 5];

  

    const ecProgramQueries = useQueries({

      queries: programNumbers.map((i) => ({

        queryKey: ["foodstuffEcProgram", i],

        queryFn: () => getFoodstuffPreparationProgram(i),

        enabled: tabValue === 2, // Only fetch when EC tab is active

        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes

        cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes

      })),

    });

  

    const phProgramQueries = useQueries({

      queries: programNumbers.map((i) => ({

        queryKey: ["foodstuffPhProgram", i],

        queryFn: () => getFoodstuffPreparationProgramPh(i),

        enabled: tabValue === 1, // Only fetch when pH tab is active

        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes

        cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes

      })),

    });

  

    // Effect to process EC program data from useQueries

    useEffect(() => {

      const newPrograms = {};

      let allFetched = true;

      ecProgramQueries.forEach((query, index) => {

        if (query.isSuccess) {

          newPrograms[programNumbers[index]] = query.data;

        } else if (query.isLoading || query.isFetching) {

          allFetched = false;

        } else if (query.isError) {

          console.error(`Error fetching EC program ${programNumbers[index]}:`, query.error);

          // Handle error for individual queries, maybe set an error state

        }

      });

  

      if (allFetched && Object.keys(newPrograms).length > 0) {

        setEcPrograms(newPrograms);

        setInitialEcPrograms(JSON.parse(JSON.stringify(newPrograms))); // Deep copy for comparison

      }

    }, [ecProgramQueries, tabValue]); // Only re-run if queries change or tab changes

  

    // Effect to process pH program data from useQueries

    useEffect(() => {

      const newPrograms = {};

      let allFetched = true;

      phProgramQueries.forEach((query, index) => {

        if (query.isSuccess) {

          newPrograms[programNumbers[index]] = query.data;

        } else if (query.isLoading || query.isFetching) {

          allFetched = false;

        } else if (query.isError) {

          console.error(`Error fetching pH program ${programNumbers[index]}:`, query.error);

          // Handle error for individual queries

        }

      });

  

      if (allFetched && Object.keys(newPrograms).length > 0) {

        setPhPrograms(newPrograms);

        setInitialPhPrograms(JSON.parse(JSON.stringify(newPrograms))); // Deep copy for comparison

      }

    }, [phProgramQueries, tabValue]); // Only re-run if queries change or tab changes

  

    // Check for EC changes

    useEffect(() => {

        if (Object.keys(ecPrograms).length === 0 || Object.keys(initialEcPrograms).length === 0) return;

        const hasChanges = !deepEqual(ecPrograms, initialEcPrograms);

        setIsEcSaveDisabled(!hasChanges);

    }, [ecPrograms, initialEcPrograms]);

  

    // Check for pH changes

    useEffect(() => {

        if (Object.keys(phPrograms).length === 0 || Object.keys(initialPhPrograms).length === 0) return;

        const hasChanges = !deepEqual(phPrograms, initialPhPrograms);

        setIsPhSaveDisabled(!hasChanges);

    }, [phPrograms, initialPhPrograms]);


  const queryClient = useQueryClient();

  const updateEcProgramMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgram,
    onSuccess: (data, variables) => {
      // Invalidate the specific query for the updated program number
      queryClient.invalidateQueries(["foodstuffEcProgram", variables.program_number]);
      toast.success(`برنامه EC ${variables.program_number} با موفقیت ذخیره شد`);
    },
    onError: (error, variables) => {
      console.error(`Error saving EC program ${variables.program_number}:`, error);
      toast.error(`خطا در ذخیره برنامه EC ${variables.program_number}`);
    },
  });

  const updatePhProgramMutation = useMutation({
    mutationFn: updateFoodstuffPreparationProgramPh,
    onSuccess: (data, variables) => {
      // Invalidate the specific query for the updated program number
      queryClient.invalidateQueries(["foodstuffPhProgram", variables.program_number]);
      toast.success(`برنامه pH ${variables.program_number} با موفقیت ذخیره شد`);
    },
    onError: (error, variables) => {
      console.error(`Error saving pH program ${variables.program_number}:`, error);
      toast.error(`خطا در ذخیره برنامه pH ${variables.program_number}`);
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate(-1);
  };

  const handleSave = async () => {
    if (tabValue === 2) { // EC Tab Save
        if (isEcSaveDisabled) return;

        const updatePromises = [];
        for (let i = 1; i <= 5; i++) {
            const initial = initialEcPrograms[i];
            const current = ecPrograms[i];
            
            if (!deepEqual(initial, current)) {
                const payload = {
                    program_number: i,
                    foodstuff_preparation_program: {
                        target_ec: Number(current.target_ec),
                        ec_acceptable_error: Number(current.ec_acceptable_error),
                        stock_percent: {
                            "1": Number(current.stock_percent?.["1"] || 0),
                            "2": Number(current.stock_percent?.["2"] || 0),
                            "3": Number(current.stock_percent?.["3"] || 0),
                            "4": Number(current.stock_percent?.["4"] || 0),
                            "5": Number(current.stock_percent?.["5"] || 0),
                            "6": Number(current.stock_percent?.["6"] || 0),
                            "7": Number(current.stock_percent?.["7"] || 0),
                            "8": Number(current.stock_percent?.["8"] || 0),
                            "9": Number(current.stock_percent?.["9"] || 0),
                            "10": Number(current.stock_percent?.["10"] || 0),
                        }
                    }
                };
                updatePromises.push(updateEcProgramMutation.mutateAsync(payload));
            }
        }
        try {
            await Promise.all(updatePromises);
            // After all updates, re-fetch the programs to update initial states and reflect changes
            ecProgramQueries.forEach(query => query.refetch());
            setInitialEcPrograms(JSON.parse(JSON.stringify(ecPrograms)));
            setIsEcSaveDisabled(true); // Disable after save
        } catch (error) {
            // Error handling is done by individual mutation's onError
            toast.error("خطا در ذخیره سازی برخی از برنامه های EC");
        }
    } else if (tabValue === 1) { // pH Tab Save
        if (isPhSaveDisabled) return;

        const updatePromises = [];
        for (let i = 1; i <= 5; i++) {
            const initial = initialPhPrograms[i];
            const current = phPrograms[i];

            if (!deepEqual(initial, current)) {
                const payload = {
                    program_number: i,
                    foodstuff_preparation_program: { // Using the same key name as EC for consistency
                        target_ph: Number(current.target_ph),
                        ph_acceptable_error: Number(current.ph_acceptable_error),
                    }
                };
                updatePromises.push(updatePhProgramMutation.mutateAsync(payload));
            }
        }
        try {
            await Promise.all(updatePromises);
            // After all updates, re-fetch the programs
            phProgramQueries.forEach(query => query.refetch());
            setInitialPhPrograms(JSON.parse(JSON.stringify(phPrograms)));
            setIsPhSaveDisabled(true); // Disable after save
        } catch (error) {
            // Error handling is done by individual mutation's onError
            toast.error("خطا در ذخیره سازی برخی از برنامه های pH");
        }
    }
  };

  const handleEcProgramChange = (programNumber, newData) => {
      setEcPrograms(prev => ({
          ...prev,
          [programNumber]: newData
      }));
  };

  const handlePhProgramChange = (programNumber, newData) => {
      setPhPrograms(prev => ({
          ...prev,
          [programNumber]: newData
      }));
  };

    // Slider Logic
    const handleScrollEvents = React.useCallback(() => {
        const el = scrollRef.current;
        if (el) {
          const isAtStart = el.scrollLeft <= 5;
          const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    
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
            setTimeout(handleScrollEvents, 100); 
            return () => {
                el.removeEventListener("scroll", handleScrollEvents);
                window.removeEventListener("resize", handleScrollEvents);
            };
        }
    }, [tabValue, ecPrograms, phPrograms, handleScrollEvents]); // Re-check on data load for both tabs

    const slide = (direction) => {
        const el = scrollRef.current;
        if (el) {
            const scrollAmount = 200; 
            el.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };


  return (
    <Container
      maxWidth={isModal ? false : "lg"}
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
                  md: "scale(0.9)",
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            direction: "ltr",
            pb: 0,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              direction: "rtl",
              minHeight: "40px",
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            {["مخزن و دوزینگ پمپ", "pH", "EC"].map((label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{
                  mr: "5px",
                  fontFamily: "IRANSANS",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  px: 2,
                  py: 0.8,
                  minHeight: "40px",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  border: tabValue === index ? "2px solid #ffffff" : "1px solid #ffffff",
                  backgroundColor: tabValue === index ? "#f5f5f5" : "#f5b982",
                  color: "#000",
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: "#f5d3a8" },
                  "&.Mui-selected": {
                    backgroundColor: "#f5f5f5",
                    color: "#000",
                    border: "0.5px solid white",
                  },
                  textTransform: "none",
                  boxShadow: tabValue === index ? "0px 2px 4px rgba(0,0,0,0.1)" : "none",
                }}
              />
            ))}
          </Tabs>
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
        {tabValue === 2 && (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: { xs: 1, md: 2 },
              direction: "rtl",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isEcSaveDisabled}
                  sx={{
                    fontFamily: "IRANSANS",
                    backgroundColor: isEcSaveDisabled ? "#e0e0e0" : "#F7C98C",
                    color: isEcSaveDisabled ? "#9e9e9e" : "#333",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: isEcSaveDisabled ? "#e0e0e0" : "#f5b982" },
                    width: "120px",
                    height: "60px",
                    fontSize: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    padding: "10px",
                  }}
                  onClick={handleSave}
                >
                  ذخیره
                </Button>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Static fields can be added here if needed */}
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                        غلظت مخزن A
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                        غلظت مخزن B
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                        غلظت مخزن C
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                         غلظت مخزن D
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                         غلظت مخزن E
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                         غلظت مخزن F
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                        EC فعلی
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                     <Grid item xs={6} sm={3}>
                      <Typography variant="body2" fontFamily="IRANSANS" sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }}>
                        ضریب تصحیح EC
                      </Typography>
                      <TextField fullWidth size="small" variant="outlined" />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            {/* Slider Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <IconButton
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
                    }}
                >
                    <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
                </IconButton>

                <Box
                    ref={scrollRef}
                    sx={{
                        width: "100%", 
                        overflowX: "auto",
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        p: 1.5,
                        pb: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        scrollBehavior: "smooth",
                        direction: "ltr", 
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    {["1", "2", "3", "4", "5"].map((numStr, index) => (
                        <Box key={index} sx={{ flexShrink: 0 }}>
                             <PlanColumnEc
                                number={numStr}
                                data={ecPrograms[index + 1]}
                                onChange={(newData) => handleEcProgramChange(index + 1, newData)}
                            />
                        </Box>
                    ))}
                </Box>

                 <IconButton
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
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
                </IconButton>
            </Box>
          </Box>
        )}

        {tabValue === 0 && (
          <Box sx={{ p: 2, direction: "rtl", overflowY: "auto" }}>
            <Typography fontFamily="IRANSANS">
              محتوای تنظیمات مخزن و دوزینگ پمپ در اینجا قرار می‌گیرد.
            </Typography>
          </Box>
        )}
        {tabValue === 1 && (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: { xs: 1, md: 2 },
              direction: "rtl",
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}> 
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isPhSaveDisabled}
                  sx={{
                    fontFamily: "IRANSANS",
                    backgroundColor: isPhSaveDisabled ? "#e0e0e0" : "#F7C98C",
                    color: isPhSaveDisabled ? "#9e9e9e" : "#333",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: isPhSaveDisabled ? "#e0e0e0" : "#f5b982" },
                    width: "120px",
                    height: "60px",
                    fontSize: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    padding: "10px",
                  }}
                  onClick={handleSave}
                >
                  ذخیره
                </Button>
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography
                      variant="body2"
                      fontFamily="IRANSANS"
                      sx={{ mb: 0.5, fontSize: "0.85rem", textAlign: "right" }} 
                    >
                      ph فعلی
                    </Typography>
                    <TextField fullWidth size="small" variant="outlined" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Slider Section for pH */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <IconButton
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
                    }}
                >
                    <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
                </IconButton>

                <Box
                    ref={scrollRef}
                    sx={{
                        width: "100%", 
                        overflowX: "auto",
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        p: 1.5,
                        pb: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        scrollBehavior: "smooth",
                        direction: "ltr", // Explicit LTR direction
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    {["1", "2", "3", "4", "5"].map((numStr, index) => (
                        <Box key={index} sx={{ flexShrink: 0 }}>
                             <PlanColumnPh
                                number={numStr}
                                data={phPrograms[index + 1]}
                                onChange={(newData) => handlePhProgramChange(index + 1, newData)}
                            />
                        </Box>
                    ))}
                </Box>

                 <IconButton
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
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ fontSize: "16px", color: "#8A8A8A" }} />
                </IconButton>
            </Box>
          </Box>
        )}
        </Paper>
      </Box>
    </Container>
  );
};

export default FeedingSettingsPage;
