import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";

import assets from "../../assets";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// --- Utility Functions for Number Conversion ---
const toPersianDigits = (str) => {
  if (str === null || str === undefined) return "";
  return str.toString().replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]);
};

const toEnglishDigits = (str) => {
  if (str === null || str === undefined) return "";
  return str
    .toString()
    .replace(/[۰-۹]/g, (x) => "۰۱۲۳۴۵۶۷۸۹".indexOf(x))
    .replace(/[٠-٩]/g, (x) => "٠١٢٣٤٥٦٧٨٩".indexOf(x));
};

// --- Sub-components ---

const TimeRangeInput = ({ label, rangeValue, setRangeValue, displayRange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "447px",
        height: "37px",
      }}
    >
      <Box
        sx={{
          width: "284px",
          height: "37px",
          backgroundColor: "#FFFFFF",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "84px",
            height: "37px",
            backgroundColor: "#FFCB82",
            borderRadius: "10px",
            borderLeft: "0.5px solid #9F9F9F",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontFamily={"IRANSANS"} fontSize={21} color="#3A3A3A">
            {label}
          </Typography>
        </Box>
        <Typography
          fontFamily={"IRANSANS"}
          fontSize={21}
          color="#000000"
          marginLeft={10}
        >
          {displayRange}
        </Typography>
      </Box>

      <TextField
        type="text"
        inputMode="numeric"
        variant="outlined"
        value={toPersianDigits(rangeValue)}
        onChange={(e) => {
          const enValue = toEnglishDigits(e.target.value);
          if (
            enValue === "" ||
            (/^\d+$/.test(enValue) &&
              Number(enValue) >= 0 &&
              Number(enValue) <= 24)
          ) {
            setRangeValue(enValue);
          }
        }}
        sx={{
          width: "69px",
          "& .MuiOutlinedInput-root": {
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
            padding: 0,
            "& input": {
              textAlign: "center",
              padding: 0,
              fontSize: "19px",
              fontFamily: "IRANSANS",
              color: "#000000",
            },
          },
          "& fieldset": { border: "none" },
        }}
      />
    </Box>
  );
};

const MinMaxInput = ({
  label,
  maxState,
  setMaxState,
  minState,
  setMinState,
}) => {
  const handleInputChange = (setter) => (e) => {
    const enValue = toEnglishDigits(e.target.value);
    if (enValue === "" || enValue === "-" || /^-?\d*\.?\d*$/.test(enValue)) {
      setter(enValue);
    }
  };

  const inputStyle = {
    width: "100px",
    height: "27px",
    border: "0.5px solid #9F9F9F",
    textAlign: "center",
    fontFamily: "IRANSANS",
    fontSize: "16px",
    color: "#000000",
    padding: 0,
    textDecoration: "none",
    outline: "none",
  };

  return (
    <Box
      sx={{
        width: "324px",
        height: "49px",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-around", width: "199px" }}
      >
        <Typography fontFamily={"IRANSANS"} fontSize={16} color="#9F9F9F">
          حداکثر
        </Typography>
        <Typography fontFamily={"IRANSANS"} fontSize={16} color="#9F9F9F">
          حداقل
        </Typography>
      </Box>

      <Box
        sx={{
          width: "324px",
          height: "27px",
          backgroundColor: "#379E79",
          borderRadius: "0 0 10px 10px",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "200px",
            height: "26px",
            display: "flex",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
            border: "0.5px solid #9F9F9F",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <input
            type="text"
            inputMode="decimal"
            value={toPersianDigits(maxState)}
            onChange={handleInputChange(setMaxState)}
            style={{ ...inputStyle, borderRight: "0.5px solid #9F9F9F" }}
          />
          <input
            type="text"
            inputMode="decimal"
            value={toPersianDigits(minState)}
            onChange={handleInputChange(setMinState)}
            style={inputStyle}
          />
        </Box>
        <Typography
          fontFamily={"IRANSANS"}
          fontSize={16}
          color="#FFFFFF"
          paddingRight={1}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

const ControllerStatus = ({ label, isActive, iconSrc, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: "60px",
        height: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: "25px",
          height: "25px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isActive ? "#379E79" : "#FFFFFF",
          transition: "background-color 0.3s",
        }}
      >
        {isActive && (
          <img
            src={iconSrc}
            alt="Done"
            style={{ width: "15px", height: "15px" }}
          />
        )}
      </Box>
      <Typography
        fontFamily={"IRANSANS"}
        color="#9F9F9F"
        fontSize={label.length > 5 ? 10 : 12}
      >
        {label}
      </Typography>
    </Box>
  );
};

// --- Constants for Special Settings ---
const specialSettingsConfig = [
  { code: "D2830", label: "ساعت شروع زون ۱ زمانی", isFloat: false },
  { code: "D2831", label: "ساعت شروع زون ۲ زمانی", isFloat: false },
  { code: "D2832", label: "ساعت شروع زون ۳ زمانی", isFloat: false },
  { code: "D2833", label: "ساعت شروع مه پاش", isFloat: false },
  { code: "D2834", label: "ساعت پایان مه پاش", isFloat: false },
  { code: "D2835", label: "شروع پد", isFloat: false },
  { code: "D2836", label: "پایان پد", isFloat: false },
  { code: "D2837", label: "شروع اگزاست", isFloat: false },
  { code: "D2838", label: "پایان اگزاست", isFloat: false },
  { code: "D2839", label: "شروع دریچه باز", isFloat: false },
  { code: "D2840", label: "پایان دریچه باز", isFloat: false },
  { code: "D2841", label: "زمان مه پاش خاموش (دهم ثانیه)", isFloat: false },
  { code: "D2842", label: "زمان مه پاش روشن (دهم ثانیه)", isFloat: false },
  { code: "D2843", label: "مکث دریچه (دهم ثانیه)", isFloat: false },
  { code: "D2844", label: "حرکت تو باز شدن (دهم ثانیه)", isFloat: false },
  { code: "D2845", label: "حرکت تو بسته شدن (دهم ثانیه)", isFloat: false },
  { code: "D2828", label: "حداقل دمای بیرون برای باز شدن", isFloat: true },
];

const PayeshSetting = ({ zone }) => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState("A");
  const [part, setPart] = useState(1);
  const buttons = ["A", "B", "C", "D", "ویژه"];

  const [range1, setRange1] = useState(0);
  const [range2, setRange2] = useState(0);
  const [range3, setRange3] = useState(0);

  const [tempMax1, setTempMax1] = useState(0);
  const [tempMax2, setTempMax2] = useState(0);
  const [tempMax3, setTempMax3] = useState(0);
  const [tempMin1, setTempMin1] = useState(0);
  const [tempMin2, setTempMin2] = useState(0);
  const [tempMin3, setTempMin3] = useState(0);

  const [humMax1, sethumMax1] = useState("0.0");
  const [humMax2, sethumMax2] = useState("0.0");
  const [humMax3, sethumMax3] = useState("0.0");
  const [humMin1, setHumMin1] = useState("0.0");
  const [humMin2, setHumMin2] = useState("0.0");
  const [humMin3, setHumMin3] = useState("0.0");

  const [humControllers, setHumControllers] = useState({
    exhaust_fan_1: false,
    exhaust_fan_2: false,
    fogger: false,
    pump_pad_off: false,
    roof_hatch: false,
  });
  const [tempControllers, setTempControllers] = useState({
    circulating_fan_1: false,
    circulating_fan_2: false,
    exhaust_fan_1: false,
    exhaust_fan_2: false,
    exhaust_fan_3: false,
    heater_1: false,
    heater_2: false,
    pump_pad: false,
    roof_hatch: false,
  });

  const [tabStates, setTabStates] = useState({});

  const [specialSettings, setSpecialSettings] = useState(() => {
    const mockSpecialData = {
      D2830: "6",
      D2831: "14",
      D2832: "22",
      D2833: "8",
      D2834: "18",
      D2835: "10",
      D2836: "16",
      D2837: "9",
      D2838: "17",
      D2839: "7",
      D2840: "19",
      D2841: "50",
      D2842: "100",
      D2843: "30",
      D2844: "20",
      D2845: "25",
      D2828: "12.5",
    };
    return specialSettingsConfig.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.code]: mockSpecialData[curr.code] || "",
      }),
      {},
    );
  });

  const initialRangeRef = useRef(null);
  const initialTempRangeRef = useRef(null);
  const initialHumRangeRef = useRef(null);
  const initialTempOpRef = useRef(null);
  const initialHumOpRef = useRef(null);

  const normalizeRange = (arr) => arr.map((x) => parseInt(x || 0));
  const formatValue = useCallback((value) => parseFloat(value || 0), []);
  const normalizeClimateRange = useCallback(
    (obj) => ({
      1: {
        minimum: formatValue(obj["1"]?.minimum),
        maximum: formatValue(obj["1"]?.maximum),
      },
      2: {
        minimum: formatValue(obj["2"]?.minimum),
        maximum: formatValue(obj["2"]?.maximum),
      },
      3: {
        minimum: formatValue(obj["3"]?.minimum),
        maximum: formatValue(obj["3"]?.maximum),
      },
    }),
    [formatValue],
  );

  const areOperatorsEqual = (op1, op2) => {
    if (!op1 || !op2) return false;
    const keys = Object.keys(op1);
    for (let key of keys) {
      if (op1[key] !== op2[key]) return false;
    }
    return true;
  };

  const humidityObject = useMemo(
    () => ({
      1: { minimum: humMin1, maximum: humMax1 },
      2: { minimum: humMin2, maximum: humMax2 },
      3: { minimum: humMin3, maximum: humMax3 },
    }),
    [humMin1, humMin2, humMin3, humMax1, humMax2, humMax3],
  );

  const tempObject = useMemo(
    () => ({
      1: { minimum: tempMin1, maximum: tempMax1 },
      2: { minimum: tempMin2, maximum: tempMax2 },
      3: { minimum: tempMin3, maximum: tempMax3 },
    }),
    [tempMax1, tempMax2, tempMax3, tempMin1, tempMin2, tempMin3],
  );

  // واکشی اطلاعات از APIهای اصلی
  const fetchClimateData = async () => {
    const [rangeRes, tempRes, humRes, opRes, humOpRes] = await Promise.all([
      apiClient.get(`/climate/range-start-time/`),
      apiClient.get(`/climate/temperature-range/`, { params: { zone, part } }),
      apiClient.get(`/climate/humidity-range/`, { params: { zone, part } }),
      apiClient.get(`/climate/temperature-range-operator/`, {
        params: { zone, part },
      }),
      apiClient.get(`/climate/humidity-range-operator/`, {
        params: { zone, part },
      }),
    ]);
    return { rangeRes, tempRes, humRes, opRes, humOpRes };
  };

  const {
    data: queryData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["climateSettings", zone, part],
    queryFn: fetchClimateData,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (queryData) {
      const { rangeRes, tempRes, humRes, opRes, humOpRes } = queryData;

      if (rangeRes) {
        setRange1(rangeRes[0]);
        setRange2(rangeRes[1]);
        setRange3(rangeRes[2]);
        initialRangeRef.current = normalizeRange(rangeRes);
      }

      if (tabStates[part]) {
        const cached = tabStates[part];
        setTempMax1(cached.tempMax1);
        setTempMin1(cached.tempMin1);
        setTempMax2(cached.tempMax2);
        setTempMin2(cached.tempMin2);
        setTempMax3(cached.tempMax3);
        setTempMin3(cached.tempMin3);
        sethumMax1(cached.humMax1);
        setHumMin1(cached.humMin1);
        sethumMax2(cached.humMax2);
        setHumMin2(cached.humMin2);
        sethumMax3(cached.humMax3);
        setHumMin3(cached.humMin3);
        setTempControllers(cached.tempControllers);
        setHumControllers(cached.humControllers);
        
        if (tempRes) initialTempRangeRef.current = normalizeClimateRange(tempRes);
        if (humRes) initialHumRangeRef.current = normalizeClimateRange(humRes);
        if (opRes) initialTempOpRef.current = { ...cached.tempControllers, ...opRes };
        if (humOpRes) initialHumOpRef.current = { ...cached.humControllers, ...humOpRes };
      } else {
        if (tempRes) {
          setTempMax1(tempRes["1"]?.maximum || 0);
          setTempMin1(tempRes["1"]?.minimum || 0);
          setTempMax2(tempRes["2"]?.maximum || 0);
          setTempMin2(tempRes["2"]?.minimum || 0);
          setTempMax3(tempRes["3"]?.maximum || 0);
          setTempMin3(tempRes["3"]?.minimum || 0);
          initialTempRangeRef.current = normalizeClimateRange(tempRes);
        }

        if (humRes) {
          sethumMax1(humRes["1"]?.maximum || 0);
          setHumMin1(humRes["1"]?.minimum || 0);
          sethumMax2(humRes["2"]?.maximum || 0);
          setHumMin2(humRes["2"]?.minimum || 0);
          sethumMax3(humRes["3"]?.maximum || 0);
          setHumMin3(humRes["3"]?.minimum || 0);
          initialHumRangeRef.current = normalizeClimateRange(humRes);
        }

        if (opRes) {
          setTempControllers((prev) => {
            const newState = { ...prev, ...opRes };
            initialTempOpRef.current = newState;
            return newState;
          });
        }

        if (humOpRes) {
          setHumControllers((prev) => {
            const newState = { ...prev, ...humOpRes };
            initialHumOpRef.current = newState;
            return newState;
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData, part]); // Excluded tabStates to avoid unnecessary re-runs when tabStates updates on tab click

  const handleSpecialSettingChange = (code, value) => {
    setSpecialSettings((prev) => ({ ...prev, [code]: value }));
  };

  const handleSave = async () => {
    const promises = [];

    // 1. Check Range Start Times
    const currentRange = normalizeRange([range1, range2, range3]);
    if (
      JSON.stringify(currentRange) !== JSON.stringify(initialRangeRef.current)
    ) {
      promises.push(
        apiClient.post(`/climate/range-start-time/`, {
          range_start_time: currentRange,
        }),
      );
    }

    // 2. Check Temperature Ranges
    const currentTempRange = normalizeClimateRange(tempObject);
    if (
      JSON.stringify(currentTempRange) !==
      JSON.stringify(initialTempRangeRef.current)
    ) {
      promises.push(
        apiClient.post(`/climate/temperature-range/`, {
          temperature_range: currentTempRange,
          zone,
          part,
        }),
      );
    }

    // 3. Check Humidity Ranges
    const currentHumRange = normalizeClimateRange(humidityObject);
    if (
      JSON.stringify(currentHumRange) !==
      JSON.stringify(initialHumRangeRef.current)
    ) {
      promises.push(
        apiClient.post(`/climate/humidity-range/`, {
          humidity_range: currentHumRange,
          zone,
          part,
        }),
      );
    }

    // 4. Check Temperature Operators
    if (!areOperatorsEqual(tempControllers, initialTempOpRef.current)) {
      promises.push(
        apiClient.post(`/climate/temperature-range-operator/`, {
          temperature_range_operator: tempControllers,
          zone,
          part,
        }),
      );
    }

    // 5. Check Humidity Operators
    if (!areOperatorsEqual(humControllers, initialHumOpRef.current)) {
      promises.push(
        apiClient.post(`/climate/humidity-range-operator/`, {
          humidity_range_operator: humControllers,
          zone,
          part,
        }),
      );
    }

    if (promises.length === 0) {
      if (selected === "ویژه") {
        toast.success("تنظیمات تب ویژه به صورت ظاهری ذخیره شد.");
        return;
      }
      toast.error("تغییری برای ذخیره وجود ندارد.");
      return;
    }

    try {
      await Promise.all(promises);
      console.log("Data successfully saved!");

      // Invalidate query cache so that switching tabs fetches fresh data
      queryClient.invalidateQueries({ queryKey: ["climateSettings", zone] });

      // Update refs
      initialRangeRef.current = currentRange;
      initialTempRangeRef.current = currentTempRange;
      initialHumRangeRef.current = currentHumRange;
      initialTempOpRef.current = { ...tempControllers };
      initialHumOpRef.current = { ...humControllers };

      // Clear the tabStates cache for this part so fresh data is loaded
      setTabStates((prev) => {
        const next = { ...prev };
        delete next[part];
        return next;
      });

      if (selected === "ویژه") {
        toast.success("تنظیمات تب ویژه و تغییرات API با موفقیت ذخیره شدند.");
      } else {
        toast.success("داده‌ها با موفقیت ذخیره شدند.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("خطا در ذخیره داده‌ها.");
    }
  };

  const toggleTempController = (key) =>
    setTempControllers((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleHumController = (key) =>
    setHumControllers((prev) => ({ ...prev, [key]: !prev[key] }));

  const tempControllerList = [
    {
      label: "فن سیرکوله۱",
      key: "circulating_fan_1",
      onClick: () => toggleTempController("circulating_fan_1"),
    },
    {
      label: "فن سیرکوله۲",
      key: "circulating_fan_2",
      onClick: () => toggleTempController("circulating_fan_2"),
    },
    {
      label: "فن ۱",
      key: "exhaust_fan_1",
      onClick: () => toggleTempController("exhaust_fan_1"),
    },
    {
      label: "فن ۲",
      key: "exhaust_fan_2",
      onClick: () => toggleTempController("exhaust_fan_2"),
    },
    {
      label: "فن ۳",
      key: "exhaust_fan_3",
      onClick: () => toggleTempController("exhaust_fan_3"),
    },
    {
      label: "بخاری ۱",
      key: "heater_1",
      onClick: () => toggleTempController("heater_1"),
    },
    {
      label: "بخاری ۲",
      key: "heater_2",
      onClick: () => toggleTempController("heater_2"),
    },
    {
      label: "پمپ پد",
      key: "pump_pad",
      onClick: () => toggleTempController("pump_pad"),
    },
    {
      label: "دریچه",
      key: "roof_hatch",
      onClick: () => toggleTempController("roof_hatch"),
    },
  ];

  const humControllerList = [
    {
      label: "فن ۱",
      key: "exhaust_fan_1",
      onClick: () => toggleHumController("exhaust_fan_1"),
    },
    {
      label: "فن ۲",
      key: "exhaust_fan_2",
      onClick: () => toggleHumController("exhaust_fan_2"),
    },
    {
      label: "مه پاش",
      key: "fogger",
      onClick: () => toggleHumController("fogger"),
    },
    {
      label: "پمپ پد خاموش",
      key: "pump_pad_off",
      onClick: () => toggleHumController("pump_pad_off"),
    },
    {
      label: "دریچه",
      key: "roof_hatch",
      onClick: () => toggleHumController("roof_hatch"),
    },
  ];

  return (
    <Container
      sx={{
        width: "820px",
        height: "740px",
        backgroundColor: "#EDECEC",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        transform: "scale(0.95)",
        transformOrigin: "center",
        paddingY: "2px",
      }}
    >
      <Stack spacing={1.5} sx={{ width: "450px" }}>
        <TimeRangeInput
          label="بازه ۱"
          rangeValue={range1}
          setRangeValue={setRange1}
          displayRange={`${toPersianDigits(range2)} - ${toPersianDigits(range1)}`}
        />
        <TimeRangeInput
          label="بازه ۲"
          rangeValue={range2}
          setRangeValue={setRange2}
          displayRange={`${toPersianDigits(range3)} - ${toPersianDigits(range2)}`}
        />
        <TimeRangeInput
          label="بازه ۳"
          rangeValue={range3}
          setRangeValue={setRange3}
          displayRange={`${toPersianDigits(range1)} - ${toPersianDigits(range3)}`}
        />
      </Stack>

      <Box
        sx={{
          width: "765px",
          height: "560px",
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "flex-start",
            width: "550px",
          }}
        >
          {buttons.map((label, index) => (
            <Box
              key={label}
              onClick={() => {
                if (selected !== "ویژه") {
                  setTabStates(prev => ({
                    ...prev,
                    [part]: {
                      tempMax1, tempMin1, tempMax2, tempMin2, tempMax3, tempMin3,
                      humMax1, humMin1, humMax2, humMin2, humMax3, humMin3,
                      tempControllers, humControllers
                    }
                  }));
                }
                setSelected(label);
                if (label !== "ویژه") setPart(index + 1);
              }}
              sx={{
                paddingX: "14px",
                marginRight: index !== buttons.length - 1 ? "10px" : 0,
                height: "46px",
                borderRadius: "10px 10px 0 0",
                backgroundColor: selected === label ? "#ffffff" : "#FFCB82",
                cursor: "pointer",
                transition: "background-color 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "60px",
              }}
            >
              <Typography
                fontSize={15}
                fontFamily={"IRANSANS"}
                color={"#111111"}
                fontWeight={selected === label ? "bold" : "normal"}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: "765px",
            height: "470px",
            backgroundColor: "#ffffff",
            borderRadius: "0 10px 10px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingY: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <>
            {selected === "ویژه" ? (
              <Box
                  sx={{
                    width: "100%",
                    px: 4,
                    height: "390px",
                    overflow: "hidden",
                    direction: "rtl",
                    display: "flex",
                    gap: 3,
                  }}
                >
                  <Stack spacing={0.5} sx={{ width: "50%" }}>
                    {specialSettingsConfig.slice(0, 9).map((field) => (
                      <Box
                        key={field.code}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.5,
                          px: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Typography
                          fontFamily={"IRANSANS"}
                          fontSize={12}
                          color="#333"
                        >
                          {field.label}
                        </Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          inputMode={field.isFloat ? "decimal" : "numeric"}
                          value={toPersianDigits(specialSettings[field.code])}
                          onChange={(e) => {
                            const val = toEnglishDigits(e.target.value);
                            if (
                              val === "" ||
                              val === "-" ||
                              (field.isFloat
                                ? /^-?\d*\.?\d*$/.test(val)
                                : /^-?\d*$/.test(val))
                            ) {
                              handleSpecialSettingChange(field.code, val);
                            }
                          }}
                          sx={{
                            width: "70px",
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "2px 4px",
                              fontSize: "13px",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>

                  <Stack spacing={0.5} sx={{ width: "50%" }}>
                    {specialSettingsConfig.slice(9).map((field) => (
                      <Box
                        key={field.code}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.5,
                          px: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Typography
                          fontFamily={"IRANSANS"}
                          fontSize={12}
                          color="#333"
                        >
                          {field.label}
                        </Typography>
                        <TextField
                          size="small"
                          variant="outlined"
                          type="text"
                          inputMode={field.isFloat ? "decimal" : "numeric"}
                          value={toPersianDigits(specialSettings[field.code])}
                          onChange={(e) => {
                            const val = toEnglishDigits(e.target.value);
                            if (
                              val === "" ||
                              val === "-" ||
                              (field.isFloat
                                ? /^-?\d*\.?\d*$/.test(val)
                                : /^-?\d*$/.test(val))
                            ) {
                              handleSpecialSettingChange(field.code, val);
                            }
                          }}
                          sx={{
                            width: "70px",
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "2px 4px",
                              fontSize: "13px",
                              fontFamily: "IRANSANS",
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Box sx={{ width: "733px", height: "390px", display: "flex" }}>
                  <Stack width="356px" spacing={2} sx={{ display: "flex" }}>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={20}
                      color="#000000"
                      textAlign={"center"}
                    >
                      دما
                    </Typography>
                    <Box
                      sx={{
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <MinMaxInput
                        label="بازه زمانی ۱"
                        maxState={tempMax1}
                        setMaxState={setTempMax1}
                        minState={tempMin1}
                        setMinState={setTempMin1}
                      />
                      <MinMaxInput
                        label="بازه زمانی ۲"
                        maxState={tempMax2}
                        setMaxState={setTempMax2}
                        minState={tempMin2}
                        setMinState={setTempMin2}
                      />
                      <MinMaxInput
                        label="بازه زمانی ۳"
                        maxState={tempMax3}
                        setMaxState={setTempMax3}
                        minState={tempMin3}
                        setMinState={setTempMin3}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          width: "320px",
                          marginTop: 2,
                          gap: "2px",
                        }}
                      >
                        {tempControllerList.slice(0, 5).map((ctrl) => (
                          <ControllerStatus
                            key={ctrl.key}
                            label={ctrl.label}
                            isActive={tempControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        ))}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          width: "320px",
                          marginTop: 1,
                          gap: "8px",
                        }}
                      >
                        {tempControllerList.slice(5, 9).map((ctrl) => (
                          <ControllerStatus
                            key={ctrl.key}
                            label={ctrl.label}
                            isActive={tempControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Stack>

                  <Stack width="356px" spacing={2} sx={{ display: "flex" }}>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={20}
                      color="#000000"
                      textAlign={"center"}
                    >
                      رطوبت
                    </Typography>
                    <Box
                      sx={{
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <MinMaxInput
                        label="بازه زمانی ۱"
                        maxState={humMax1}
                        setMaxState={sethumMax1}
                        minState={humMin1}
                        setMinState={setHumMin1}
                      />
                      <MinMaxInput
                        label="بازه زمانی ۲"
                        maxState={humMax2}
                        setMaxState={sethumMax2}
                        minState={humMin2}
                        setMinState={setHumMin2}
                      />
                      <MinMaxInput
                        label="بازه زمانی ۳"
                        maxState={humMax3}
                        setMaxState={sethumMax3}
                        minState={humMin3}
                        setMinState={setHumMin3}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          width: "320px",
                          marginTop: 2,
                          gap: "8px",
                        }}
                      >
                        {humControllerList.slice(0, 5).map((ctrl) => (
                          <ControllerStatus
                            key={ctrl.key}
                            label={ctrl.label}
                            isActive={humControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        ))}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          width: "320px",
                          marginTop: 1,
                          gap: "8px",
                        }}
                      >
                        {humControllerList.slice(5, 9).map((ctrl) => (
                          <ControllerStatus
                            key={ctrl.key}
                            label={ctrl.label}
                            isActive={humControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                tabIndex={0}
                sx={{
                  width: "110px",
                  height: "56px",
                  backgroundColor: "#FFCB82",
                  borderRadius: "10px",
                  color: "#111111",
                  fontSize: 18,
                  fontFamily: "IRANSANS",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "auto",
                  paddingX: 1,
                  "&:hover": { backgroundColor: "#E0B571" },
                }}
              >
                <img
                  src={assets.svg.saveIcon}
                  alt="ذخیره"
                  style={{ height: "24px" }}
                />{" "}
                ذخیره
              </Button>
            </>
        </Box>
      </Box>
    </Container>
  );
};

export default PayeshSetting;
