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
  Modal,
  IconButton,
} from "@mui/material";

import assets from "../../assets";
import {
  getRangeStartTime,
  getClimateSettings,
  getSpecialParameters,
  updateRangeStartTime,
  updateTemperatureRange,
  updateHumidityRange,
  updateTemperatureRangeOperator,
  updateHumidityRangeOperator,
  updateSpecialParameters,
} from "../../api/climateApi";
import { queryKeys } from "../../api/queryKeys";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";

const TimeRangeInput = ({
  label,
  rangeValue,
  setRangeValue,
  displayRange,
  isLoading,
  bgColor = "#FFCB82",
  labelColor = "#3A3A3A",
}) => {
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
            backgroundColor: bgColor,
            borderRadius: "10px",
            borderLeft: "0.5px solid #9F9F9F",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontFamily={"IRANSANS"} fontSize={21} color={labelColor}>
            {label}
          </Typography>
        </Box>
        <Typography
          fontFamily={"IRANSANS"}
          fontSize={21}
          color="#000000"
          marginLeft={10}
        >
          {isLoading ? "..." : displayRange}
        </Typography>
      </Box>

      <TextField
        type="text"
        inputMode="numeric"
        variant="outlined"
        disabled={isLoading}
        value={isLoading ? "" : toPersianDigits(rangeValue)}
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

const specialSettingsConfig = [
  { key: "fogger_start_time", label: "ساعت شروع مه پاش", isFloat: false },
  { key: "fogger_end_time", label: "ساعت پایان مه پاش", isFloat: false },
  { key: "pad_pump_start_time", label: "شروع پد", isFloat: false },
  { key: "pad_pump_end_time", label: "پایان پد", isFloat: false },
  { key: "exhaust_fan_start_time", label: "شروع اگزاست", isFloat: false },
  { key: "exhaust_fan_end_time", label: "پایان اگزاست", isFloat: false },
  { key: "open_vent_start_time", label: "شروع دریچه باز", isFloat: false },
  { key: "open_vent_end_time", label: "پایان دریچه باز", isFloat: false },
  { key: "fogger_off", label: "زمان مه پاش خاموش (دهم ثانیه)", isFloat: false },
  { key: "fogger_on", label: "زمان مه پاش روشن (دهم ثانیه)", isFloat: false },
  { key: "vent_delay", label: "مکث دریچه (دهم ثانیه)", isFloat: false },
  { key: "vent_open", label: "حرکت تو باز شدن (دهم ثانیه)", isFloat: false },
  { key: "vent_close", label: "حرکت تو بسته شدن (دهم ثانیه)", isFloat: false },
  {
    key: "min_temperature",
    label: "حداقل دمای بیرون برای باز شدن",
    isFloat: true,
  },
];

const buildSpecialParametersPayload = (form) =>
  specialSettingsConfig.reduce((acc, field) => {
    const raw = form[field.key];
    acc[field.key] = field.isFloat
      ? parseFloat(raw || 0)
      : parseInt(raw || 0, 10);
    return acc;
  }, {});

const mapSpecialParametersToForm = (data = {}) =>
  specialSettingsConfig.reduce((acc, field) => {
    const value = data[field.key];
    acc[field.key] = value !== undefined && value !== null ? String(value) : "";
    return acc;
  }, {});

const PayeshSetting = ({ zone, onClose }) => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState("A");
  const [part, setPart] = useState(1);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState(null);
  const [pendingClose, setPendingClose] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const buttons = ["A", "B", "C", "D", "ویژه"];

  const [range1, setRange1] = useState("");
  const [range2, setRange2] = useState("");
  const [range3, setRange3] = useState("");

  const [tempMax1, setTempMax1] = useState("");
  const [tempMax2, setTempMax2] = useState("");
  const [tempMax3, setTempMax3] = useState("");
  const [tempMin1, setTempMin1] = useState("");
  const [tempMin2, setTempMin2] = useState("");
  const [tempMin3, setTempMin3] = useState("");

  const [humMax1, sethumMax1] = useState("");
  const [humMax2, sethumMax2] = useState("");
  const [humMax3, sethumMax3] = useState("");
  const [humMin1, setHumMin1] = useState("");
  const [humMin2, setHumMin2] = useState("");
  const [humMin3, setHumMin3] = useState("");

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

  const [specialSettings, setSpecialSettings] = useState(() =>
    mapSpecialParametersToForm(),
  );

  const initialRangeRef = useRef(null);
  const initialSpecialRef = useRef(null);
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

  const { data: rangeData, isLoading: isRangeLoading } = useQuery({
    queryKey: queryKeys.climateRangeStartTime(zone),
    queryFn: async () => {
      const res = await getRangeStartTime();
      return Array.isArray(res) ? res : [];
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (rangeData && rangeData.length >= 3) {
      setRange1(rangeData[0] ?? "");
      setRange2(rangeData[1] ?? "");
      setRange3(rangeData[2] ?? "");
      initialRangeRef.current = normalizeRange(rangeData);
    }
  }, [rangeData]);

  const {
    data: queryData,
    isLoading: isClimateLoading,
    isError: isClimateError,
  } = useQuery({
    queryKey: queryKeys.climateSettings(zone, part),
    queryFn: () => getClimateSettings(zone, part),
    staleTime: 5 * 60 * 1000,
    enabled: selected !== "ویژه",
    placeholderData: (previousData) => previousData,
  });

  const {
    data: specialParamsData,
    isLoading: isSpecialLoading,
    isError: isSpecialError,
  } = useQuery({
    queryKey: queryKeys.climateSpecialParameters(),
    queryFn: getSpecialParameters,
    staleTime: 5 * 60 * 1000,
    enabled: selected === "ویژه",
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!specialParamsData) return;
    const formState = mapSpecialParametersToForm(specialParamsData);
    setSpecialSettings(formState);
    initialSpecialRef.current = buildSpecialParametersPayload(formState);
  }, [specialParamsData]);

  useEffect(() => {
    if (queryData) {
      const { tempRes, humRes, opRes, humOpRes } = queryData;

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

        if (tempRes)
          initialTempRangeRef.current = normalizeClimateRange(tempRes);
        if (humRes) initialHumRangeRef.current = normalizeClimateRange(humRes);
        if (opRes)
          initialTempOpRef.current = { ...cached.tempControllers, ...opRes };
        if (humOpRes)
          initialHumOpRef.current = { ...cached.humControllers, ...humOpRes };
      } else {
        if (tempRes) {
          setTempMax1(tempRes["1"]?.maximum ?? "");
          setTempMin1(tempRes["1"]?.minimum ?? "");
          setTempMax2(tempRes["2"]?.maximum ?? "");
          setTempMin2(tempRes["2"]?.minimum ?? "");
          setTempMax3(tempRes["3"]?.maximum ?? "");
          setTempMin3(tempRes["3"]?.minimum ?? "");
          initialTempRangeRef.current = normalizeClimateRange(tempRes);
        }

        if (humRes) {
          sethumMax1(humRes["1"]?.maximum ?? "");
          setHumMin1(humRes["1"]?.minimum ?? "");
          sethumMax2(humRes["2"]?.maximum ?? "");
          setHumMin2(humRes["2"]?.minimum ?? "");
          sethumMax3(humRes["3"]?.maximum ?? "");
          setHumMin3(humRes["3"]?.minimum ?? "");
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
  }, [queryData, part]);

  const handleSpecialSettingChange = (code, value) => {
    setSpecialSettings((prev) => ({ ...prev, [code]: value }));
  };

  const hasCurrentTabChanges = useCallback(() => {
    if (selected === "ویژه") {
      const payload = buildSpecialParametersPayload(specialSettings);
      return (
        JSON.stringify(payload) !== JSON.stringify(initialSpecialRef.current)
      );
    }

    const currentRange = normalizeRange([range1, range2, range3]);
    if (
      JSON.stringify(currentRange) !== JSON.stringify(initialRangeRef.current)
    ) {
      return true;
    }

    const currentTempRange = normalizeClimateRange(tempObject);
    if (
      JSON.stringify(currentTempRange) !==
      JSON.stringify(initialTempRangeRef.current)
    ) {
      return true;
    }

    const currentHumRange = normalizeClimateRange(humidityObject);
    if (
      JSON.stringify(currentHumRange) !==
      JSON.stringify(initialHumRangeRef.current)
    ) {
      return true;
    }

    if (!areOperatorsEqual(tempControllers, initialTempOpRef.current)) {
      return true;
    }

    if (!areOperatorsEqual(humControllers, initialHumOpRef.current)) {
      return true;
    }

    return false;
  }, [
    selected,
    specialSettings,
    range1,
    range2,
    range3,
    tempObject,
    humidityObject,
    tempControllers,
    humControllers,
    normalizeClimateRange,
  ]);

  const saveCurrentTab = async ({ silent = false } = {}) => {
    if (selected === "ویژه") {
      const payload = buildSpecialParametersPayload(specialSettings);
      if (
        JSON.stringify(payload) === JSON.stringify(initialSpecialRef.current)
      ) {
        if (!silent) toast.error("تغییری برای ذخیره وجود ندارد.");
        return { saved: false, hadChanges: false };
      }

      try {
        await updateSpecialParameters(payload);
        initialSpecialRef.current = { ...payload };
        queryClient.invalidateQueries({
          queryKey: queryKeys.climateSpecialParameters(),
        });
        if (!silent) toast.success("تنظیمات ویژه با موفقیت ذخیره شد.");
        return { saved: true, hadChanges: true };
      } catch (saveError) {
        console.error("Error saving special parameters:", saveError);
        toast.error("خطا در ذخیره تنظیمات ویژه.");
        return { saved: false, hadChanges: true, error: true };
      }
    }

    const currentRange = normalizeRange([range1, range2, range3]);
    const [r1, r2, r3] = currentRange;

    // ولیدیشن: بازه‌ها نباید همپوشانی داشته باشن و باید به ترتیب باشن
    if (r1 >= r2 || r2 >= r3) {
      if (!silent)
        toast.error(
          "بازه‌ها نباید همپوشانی داشته باشند (اعداد باید از کم به زیاد وارد شوند).",
        );
      return { saved: false, hadChanges: true, error: true };
    }

    const promises = [];

    if (
      JSON.stringify(currentRange) !== JSON.stringify(initialRangeRef.current)
    ) {
      promises.push(updateRangeStartTime({ range_start_time: currentRange }));
    }

    const currentTempRange = normalizeClimateRange(tempObject);
    if (
      JSON.stringify(currentTempRange) !==
      JSON.stringify(initialTempRangeRef.current)
    ) {
      promises.push(
        updateTemperatureRange({
          temperature_range: currentTempRange,
          zone,
          part,
        }),
      );
    }

    const currentHumRange = normalizeClimateRange(humidityObject);
    if (
      JSON.stringify(currentHumRange) !==
      JSON.stringify(initialHumRangeRef.current)
    ) {
      promises.push(
        updateHumidityRange({
          humidity_range: currentHumRange,
          zone,
          part,
        }),
      );
    }

    if (!areOperatorsEqual(tempControllers, initialTempOpRef.current)) {
      promises.push(
        updateTemperatureRangeOperator({
          temperature_range_operator: tempControllers,
          zone,
          part,
        }),
      );
    }

    if (!areOperatorsEqual(humControllers, initialHumOpRef.current)) {
      promises.push(
        updateHumidityRangeOperator({
          humidity_range_operator: humControllers,
          zone,
          part,
        }),
      );
    }

    if (promises.length === 0) {
      if (!silent) toast.error("تغییری برای ذخیره وجود ندارد.");
      return { saved: false, hadChanges: false };
    }

    try {
      await Promise.all(promises);

      queryClient.invalidateQueries({
        queryKey: queryKeys.climateSettings(zone, part),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.climateRangeStartTime(zone),
      });

      initialRangeRef.current = currentRange;
      initialTempRangeRef.current = currentTempRange;
      initialHumRangeRef.current = currentHumRange;
      initialTempOpRef.current = { ...tempControllers };
      initialHumOpRef.current = { ...humControllers };

      setTabStates((prev) => {
        const next = { ...prev };
        delete next[part];
        return next;
      });

      if (!silent) toast.success("داده‌ها با موفقیت ذخیره شدند.");
      return { saved: true, hadChanges: true };
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("خطا در ذخیره داده‌ها.");
      return { saved: false, hadChanges: true, error: true };
    }
  };

  const handleSave = () => saveCurrentTab({ silent: false });

  const switchToTab = (label, index) => {
    if (selected !== "ویژه") {
      setTabStates((prev) => ({
        ...prev,
        [part]: {
          tempMax1,
          tempMin1,
          tempMax2,
          tempMin2,
          tempMax3,
          tempMin3,
          humMax1,
          humMin1,
          humMax2,
          humMin2,
          humMax3,
          humMin3,
          tempControllers,
          humControllers,
        },
      }));
    }
    setSelected(label);
    if (label !== "ویژه") setPart(index + 1);
  };

  const closeUnsavedDialog = () => {
    setUnsavedDialogOpen(false);
    setPendingTabSwitch(null);
    setPendingClose(false);
  };

  const completePendingAction = () => {
    if (pendingClose) {
      onClose?.();
    } else if (pendingTabSwitch) {
      switchToTab(pendingTabSwitch.label, pendingTabSwitch.index);
    }
    closeUnsavedDialog();
  };

  const handleTabSelect = (label, index) => {
    if (label === selected || isSaving) return;

    if (hasCurrentTabChanges()) {
      setPendingClose(false);
      setPendingTabSwitch({ label, index });
      setUnsavedDialogOpen(true);
      return;
    }

    switchToTab(label, index);
  };

  const handleCloseRequest = () => {
    if (!onClose) return;

    if (hasCurrentTabChanges()) {
      setPendingTabSwitch(null);
      setPendingClose(true);
      setUnsavedDialogOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscardChanges = () => {
    completePendingAction();
  };

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    try {
      const result = await saveCurrentTab({ silent: false });
      if (result.error) return;
      completePendingAction();
    } finally {
      setIsSaving(false);
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

  const showClimateLoading =
    isClimateLoading && !queryData && selected !== "ویژه";
  const showSpecialLoading =
    isSpecialLoading && !specialParamsData && selected === "ویژه";
  const showClimateError = isClimateError && !queryData && selected !== "ویژه";
  const showSpecialError =
    isSpecialError && !specialParamsData && selected === "ویژه";

  const ClockVisualizer = ({ range1, range2, range3 }) => {
    const getCoords = (hour, radius) => {
      const angle = (hour / 24) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      return {
        x: 65 + radius * Math.cos(rad),
        y: 65 + radius * Math.sin(rad),
      };
    };

    const h1 = Number(range1) || 0;
    const h2 = Number(range2) || 0;
    const h3 = Number(range3) || 0;

    const getArcPath = (startH, endH, radius) => {
      if (startH === endH) return "";
      let diff = endH - startH;
      if (diff < 0) diff += 24;
      if (diff === 0) return "";

      const start = getCoords(startH, radius);
      const end = getCoords(endH, radius);
      const largeArcFlag = diff > 12 ? 1 : 0;

      return `M 65 65 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const labels = [
      { hour: 24, text: "۲۴" },
      { hour: 6, text: "۶" },
      { hour: 12, text: "۱۲" },
      { hour: 18, text: "۱۸" },
    ];

    return (
      <Box
        sx={{
          width: 145,
          height: 145,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "50%",
          border: "0.5px solid #9F9F9F",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 130 130">
          <path d={getArcPath(h1, h2, 45)} fill="rgba(33, 150, 243, 0.2)" />
          <path d={getArcPath(h2, h3, 45)} fill="rgba(76, 175, 80, 0.2)" />
          <path d={getArcPath(h3, h1, 45)} fill="rgba(255, 152, 0, 0.2)" />

          {hours.map((h) => {
            const isMainHour = h % 6 === 0;
            const start = getCoords(h, 45);
            const end = getCoords(h, isMainHour ? 37 : 42);
            return (
              <line
                key={h}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isMainHour ? "#9F9F9F" : "#D3D3D3"}
                strokeWidth={isMainHour ? 2 : 1}
              />
            );
          })}

          {labels.map(({ hour, text }) => {
            const pos = getCoords(hour === 24 ? 0 : hour, 56);
            return (
              <text
                key={hour}
                x={pos.x}
                y={pos.y}
                fill="#3A3A3A"
                fontSize="11"
                fontFamily="IRANSANS"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {text}
              </text>
            );
          })}

          <circle cx="65" cy="65" r="3" fill="#3A3A3A" />

          {/* بازه ۱ */}
          <line
            x1="65"
            y1="65"
            x2={getCoords(h1, 35).x}
            y2={getCoords(h1, 35).y}
            stroke="#2196F3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx={getCoords(h1, 35).x}
            cy={getCoords(h1, 35).y}
            r="8"
            fill="#2196F3"
          />
          <text
            x={getCoords(h1, 35).x}
            y={getCoords(h1, 35).y}
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="IRANSANS"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {range1 ? toPersianDigits(range1) : ""}
          </text>

          {/* بازه ۲ */}
          <line
            x1="65"
            y1="65"
            x2={getCoords(h2, 35).x}
            y2={getCoords(h2, 35).y}
            stroke="#4CAF50"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx={getCoords(h2, 35).x}
            cy={getCoords(h2, 35).y}
            r="8"
            fill="#4CAF50"
          />
          <text
            x={getCoords(h2, 35).x}
            y={getCoords(h2, 35).y}
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="IRANSANS"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {range2 ? toPersianDigits(range2) : ""}
          </text>

          {/* بازه ۳ */}
          <line
            x1="65"
            y1="65"
            x2={getCoords(h3, 35).x}
            y2={getCoords(h3, 35).y}
            stroke="#FF9800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx={getCoords(h3, 35).x}
            cy={getCoords(h3, 35).y}
            r="8"
            fill="#FF9800"
          />
          <text
            x={getCoords(h3, 35).x}
            y={getCoords(h3, 35).y}
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="IRANSANS"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {range3 ? toPersianDigits(range3) : ""}
          </text>
        </svg>
      </Box>
    );
  };

  return (
    <>
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
          position: "relative",
        }}
      >
        {onClose && (
          <IconButton
            onClick={handleCloseRequest}
            title="بستن"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 20,
              color: "#FFF",
              backgroundColor: "inherit",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#D32F2F" },
            }}
          >
            <img
              src={assets.svg.close}
              alt="close"
              style={{ width: 25, height: 25 }}
            />
          </IconButton>
        )}
        <Box
          sx={{
            width: "765px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingX: 4,
          }}
        >
          <Stack spacing={1.5} sx={{ width: "480px" }}>
            <TimeRangeInput
              label="بازه ۱"
              rangeValue={range1}
              setRangeValue={setRange1}
              displayRange={`${toPersianDigits(range2)} - ${toPersianDigits(range1)}`}
              isLoading={isRangeLoading && !rangeData}
              bgColor="#2196F3"
              labelColor="#FFFFFF"
            />
            <TimeRangeInput
              label="بازه ۲"
              rangeValue={range2}
              setRangeValue={setRange2}
              displayRange={`${toPersianDigits(range3)} - ${toPersianDigits(range2)}`}
              isLoading={isRangeLoading && !rangeData}
              bgColor="#4CAF50"
              labelColor="#FFFFFF"
            />
            <TimeRangeInput
              label="بازه ۳"
              rangeValue={range3}
              setRangeValue={setRange3}
              displayRange={`${toPersianDigits(range1)} - ${toPersianDigits(range3)}`}
              isLoading={isRangeLoading && !rangeData}
              bgColor="#FF9800"
              labelColor="#FFFFFF"
            />
          </Stack>

          <ClockVisualizer range1={range1} range2={range2} range3={range3} />
        </Box>

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
                onClick={() => handleTabSelect(label, index)}
                sx={{
                  paddingX: "14px",
                  marginRight: index !== buttons.length - 1 ? "10px" : 0,
                  height: "46px",
                  borderRadius: "10px 10px 0 0",
                  backgroundColor: selected === label ? "#ffffff" : "#FFCB82",
                  cursor: isSaving ? "wait" : "pointer",
                  opacity: isSaving ? 0.7 : 1,
                  transition: "background-color 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "60px",
                  pointerEvents: isSaving ? "none" : "auto",
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
            {showClimateLoading || showSpecialLoading ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 10,
                }}
              >
                <CircularProgress />
              </Box>
            ) : showClimateError || showSpecialError ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 10,
                }}
              >
                <Typography color="error" fontFamily="IRANSANS">
                  خطا در بارگذاری اطلاعات
                </Typography>
              </Box>
            ) : (
              <>
                {selected === "ویژه" ? (
                  <Box
                    sx={{
                      width: "90%",
                      px: 4,
                      height: "390px",
                      overflow: "hidden",
                      direction: "rtl",
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <Stack spacing={0.5} sx={{ width: "50%" }}>
                      {specialSettingsConfig.slice(0, 7).map((field) => (
                        <Box
                          key={field.key}
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
                            value={toPersianDigits(specialSettings[field.key])}
                            onChange={(e) => {
                              const val = toEnglishDigits(e.target.value);
                              if (
                                val === "" ||
                                val === "-" ||
                                (field.isFloat
                                  ? /^-?\d*\.?\d*$/.test(val)
                                  : /^-?\d*$/.test(val))
                              ) {
                                handleSpecialSettingChange(field.key, val);
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
                      {specialSettingsConfig.slice(7).map((field) => (
                        <Box
                          key={field.key}
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
                            value={toPersianDigits(specialSettings[field.key])}
                            onChange={(e) => {
                              const val = toEnglishDigits(e.target.value);
                              if (
                                val === "" ||
                                val === "-" ||
                                (field.isFloat
                                  ? /^-?\d*\.?\d*$/.test(val)
                                  : /^-?\d*$/.test(val))
                              ) {
                                handleSpecialSettingChange(field.key, val);
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
                  <Box
                    sx={{ width: "733px", height: "390px", display: "flex" }}
                  >
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
            )}
          </Box>
        </Box>
      </Container>

      <Modal
        open={unsavedDialogOpen}
        onClose={closeUnsavedDialog}
        aria-labelledby="unsaved-changes-dialog"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            bgcolor: "#FFFFFF",
            borderRadius: "12px",
            border: "0.5px solid #9F9F9F",
            boxShadow: 24,
            p: 3,
            pt: 4,
            direction: "rtl",
          }}
        >
          <IconButton
            onClick={closeUnsavedDialog}
            title="بستن"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "#FFF",
              backgroundColor: "inherit",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#D32F2F" },
            }}
          >
            <img
              src={assets.svg.close}
              alt="close"
              style={{ width: 14, height: 14 }}
            />
          </IconButton>

          <Typography
            fontFamily="IRANSANS"
            fontSize={16}
            textAlign="center"
            sx={{ mb: 3, px: 1 }}
          >
            تغییرات ذخیره نشده‌اند. می‌خواهید ذخیره کنید؟
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button
              variant="outlined"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              sx={{
                fontFamily: "IRANSANS",
                minWidth: 100,
                borderColor: "#9F9F9F",
                color: "#333",
              }}
            >
              خیر
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAndContinue}
              disabled={isSaving}
              sx={{
                fontFamily: "IRANSANS",
                minWidth: 120,
                backgroundColor: "#FFCB82",
                color: "#111",
                "&:hover": { backgroundColor: "#E0B571" },
              }}
            >
              {isSaving ? "..." : "بله، ذخیره کن"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default PayeshSetting;
