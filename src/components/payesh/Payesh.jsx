import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  Modal,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import assets from "../../assets";
import axios from "axios";
import { AgCharts } from "ag-charts-react";
import PayeshSetting from "./PayeshSetting";
import IconTextButton from "../../card/IconTextButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import apiClient from "../../api/apiClient";

const StatusIndicators = ({ states }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      marginRight: "10px", // Changed to marginRight
      ml: 1,
    }}
  >
    {states.map((isOn, idx) => (
      <Box
        key={idx}
        sx={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: isOn ? "#379E79" : "#FF6B6B",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "10px",
          color: "#FFFFFF",
          fontFamily: "IRANSANS",
          border: "1px solid #FFFFFF",
          cursor: "default",
        }}
      >
        {idx + 1}
      </Box>
    ))}
  </Box>
);

const Payesh = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isChanging, setIsChanging] = React.useState(false);
  const [operatorMode, setOperatorMode] = React.useState(false); // New state for operator mode
const [activity, setActivity] = React.useState(!operatorMode); // New state for operator mode
  const [zone, setZone] = useState(1);


  const sendOperatorModeUpdate = async (newMode) => {
    try {
      // Use apiClient for POST request
      const data = await apiClient.post(`/climate/operators-mode/`, { is_auto: newMode, zone: zone });
      console.log(`sendOperatorModeUpdate: newMode sent=${newMode}, API response:`, data); // Debug log
      // We rely on optimistic update in changOnAndOff, so we don't update state here
      // to avoid race conditions or flickering if the API returns old data.
    } catch (error) {
      console.error("Error updating operator mode:", error);
      // Optional: Revert state here if needed
      setOperatorMode(!newMode);
      setActivity(newMode);
    }
  };

  const sendOperatorCommand = async (operatorName, isOn) => {
    try {
      await apiClient.post('/climate/operator/', {
        operator: operatorName,
        zone: zone,
        on_off: isOn ? 'on' : 'off'
      });
    } catch (error) {
      console.error(`Error updating ${operatorName} status:`, error);
      // Handle error: perhaps revert UI change or show an error message
    }
  };


  const changOnAndOff = () => {
    setIsChanging(true);
    // Optimistic Update
    const targetMode = activity; // If currently Manual (activity=true), target is Auto (true)
    setOperatorMode(targetMode);
    setActivity(!targetMode);

    sendOperatorModeUpdate(targetMode);
    setTimeout(() => {
      setIsChanging(false);
    }, 200); // Match this to the CSS transition duration
  };

  const fetchOperatorMode = async (zoneNum) => {
    try {
      const data = await apiClient.get(`/climate/operators-mode/?zone=${zoneNum}`);
      const mode = (typeof data === 'object' && data !== null && 'is_auto' in data) ? data.is_auto : data;
      setOperatorMode(mode);
      setActivity(!mode); // activity is inverse of is_auto
      console.log(`fetchOperatorMode: API raw data:`, data, `Parsed mode (is_auto):`, mode); // Debug log
    } catch (error) {
      console.error("Error fetching operator mode:", error);
      // Optionally handle error, e.g., set operatorMode to a default or show an error message
    }
  };

  const fetchOperatorStatus = async (zoneNum) => {
    try {
      const data = await apiClient.get(`/climate/operator/?zone=${zoneNum}`);

      setExhaustFanStates({
        fan1: data.exhaust_fan_1 || false,
        fan2: data.exhaust_fan_2 || false,
        fan3: data.exhaust_fan_3 || false,
        fan4: data.exhaust_fan_4 || false,
        fan5: data.exhaust_fan_5 || false,
      });

      setCirculationFanStates({
        fan1: data.circule_fan_1 || false,
        fan2: data.circule_fan_2 || false,
      });

      setPadPumpState(data.pad_pump || false);
      setFoggerState(data.fogger || false);

      setHatchStates({
        opening: data.hatch_opening || false,
        closing: data.hatch_closing || false,
      });

      setShadeStates({
        opening: data.shade_opening || false,
        closing: data.shade_closing || false,
      });

      setHeaterStates({
        hiter1: data.hiter_1 || false,
        hiter2: data.hiter_2 || false,
        hiter3: data.hiter_3 || false,
        hiter4: data.hiter_4 || false,
      });

    } catch (error) {
      console.error("Error fetching operator status:", error);
    }
  };

  useEffect(() => {
    fetchOperatorMode(zone);
    fetchOperatorStatus(zone);

    const interval = setInterval(() => {
      fetchOperatorMode(zone);
      fetchOperatorStatus(zone);
    }, 30000);

    return () => clearInterval(interval);
  }, [zone]);
  // Modal States --------
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Modal States --------

  const apiDomain = "http://192.168.100.51:8000";
  const [humidity, setHumidity] = useState([]);
  const [temp, setTemp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xAxisInterval, setXAxisInterval] = useState(180); // پیش‌فرض: هر 3 ساعت

  // Exhaust Fan Modal States
  const [exhaustFanModalOpen, setExhaustFanModalOpen] = useState(false);
  const [exhaustFanStates, setExhaustFanStates] = useState({
    fan1: false,
    fan2: false,
    fan3: false,
    fan4: false,
  });

  const handleExhaustFanClick = () => {
    if (activity) {
      setExhaustFanModalOpen(true);
    }
  };

  const toggleExhaustFan = (fanKey) => {
    setExhaustFanStates((prev) => {
      const newState = !prev[fanKey];
      // fanKey is like 'fan1', we want 'exhaust_fan_1'
      const number = fanKey.replace('fan', '');
      const operatorName = `exhaust_fan_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [fanKey]: newState,
      };
    });
  };

  // Circulation Fan Modal States
  const [circulationFanModalOpen, setCirculationFanModalOpen] = useState(false);
  const [circulationFanStates, setCirculationFanStates] = useState({
    fan1: false,
    fan2: false,
  });

  const handleCirculationFanClick = () => {
    if (activity) {
      setCirculationFanModalOpen(true);
    }
  };

  const toggleCirculationFan = (fanKey) => {
    setCirculationFanStates((prev) => {
      const newState = !prev[fanKey];
      // fanKey is like 'fan1', we want 'circule_fan_1'
      const number = fanKey.replace('fan', '');
      const operatorName = `circule_fan_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [fanKey]: newState,
      };
    });
  };

  // Pad Pump Modal States
  const [padPumpModalOpen, setPadPumpModalOpen] = useState(false);
  const [padPumpState, setPadPumpState] = useState(false); // Single toggle for pad_pump

  const handlePadPumpClick = () => {
    if (activity) {
      setPadPumpModalOpen(true);
    }
  };

  const togglePadPump = () => {
    setPadPumpState((prev) => {
      const newState = !prev;
      sendOperatorCommand('pad_pump', newState);
      return newState;
    });
  };

  // Fogger Modal States
  const [foggerModalOpen, setFoggerModalOpen] = useState(false);
  const [foggerState, setFoggerState] = useState(false); // Single toggle for fogger

  const handleFoggerClick = () => {
    if (activity) {
      setFoggerModalOpen(true);
    }
  };

  const toggleFogger = () => {
    setFoggerState((prev) => {
      const newState = !prev;
      sendOperatorCommand('fogger', newState);
      return newState;
    });
  };

  // Hatch Modal States (Draiche)
  const [hatchModalOpen, setHatchModalOpen] = useState(false);
  const [hatchStates, setHatchStates] = useState({
    opening: false,
    closing: false,
  });

  const handleHatchClick = () => {
    if (activity) {
      setHatchModalOpen(true);
    }
  };

  const toggleHatch = (action) => {
    setHatchStates((prev) => {
      const newState = !prev[action];
      const operatorName = `hatch_${action}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [action]: newState,
      };
    });
  };

  // Shade Modal States (Pardeh)
  const [shadeModalOpen, setShadeModalOpen] = useState(false);
  const [shadeStates, setShadeStates] = useState({
    opening: false,
    closing: false,
  });

  const handleShadeClick = () => {
    if (activity) {
      setShadeModalOpen(true);
    }
  };

  const toggleShade = (action) => {
    setShadeStates((prev) => {
      const newState = !prev[action];
      const operatorName = `shade_${action}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [action]: newState,
      };
    });
  };

  // Heater Modal States (Hiter)
  const [heaterModalOpen, setHeaterModalOpen] = useState(false);
  const [heaterStates, setHeaterStates] = useState({
    hiter1: false,
    hiter2: false,
    hiter3: false,
    hiter4: false,
  });

  const handleHeaterClick = () => {
    if (activity) {
      setHeaterModalOpen(true);
    }
  };

  const toggleHeater = (hiterKey) => {
    setHeaterStates((prev) => {
      const newState = !prev[hiterKey];
      // hiterKey is like 'hiter1', we want 'hiter_1'
      const number = hiterKey.replace('hiter', '');
      const operatorName = `hiter_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [hiterKey]: newState,
      };
    });
  };

  const getExhaustFanIcon = () => {
    const isAnyOn = Object.values(exhaustFanStates).some((s) => s);
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.fan1GreenAn : assets.img.fan1RedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.fan1An : assets.img.fan1;
    }
  };

  const getCirculationFanIcon = () => {
    const isAnyOn = Object.values(circulationFanStates).some((s) => s);
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.fan2GreenAn : assets.img.fan2RedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.fan2An : assets.img.fan2;
    }
  };

  const getHeaterIcon = () => {
    const isAnyOn = Object.values(heaterStates).some((s) => s);
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.bokhariGreenAn : assets.img.bokhariRedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.bokhariAn : assets.img.bokhari;
    }
  };

  const getPadIcon = () => {
    const isAnyOn = padPumpState; // padPumpState is already a boolean
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.padGreenAn : assets.img.padRedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.padAN : assets.img.pad;
    }
  };

  const getShadeIcon = () => {
    const isAnyOn = shadeStates.opening || shadeStates.closing;
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.pardeGreenAn : assets.img.pardeRedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.pardeAn : assets.img.parde;
    }
  };

  const getHatchIcon = () => {
    const isAnyOn = hatchStates.opening || hatchStates.closing;
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.daricheGreenAn : assets.img.daricheRedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.daricheAn : assets.img.dariche;
    }
  };

  const getFoggerIcon = () => {
    const isAnyOn = foggerState; // foggerState is already a boolean
    if (!activity) {
      // Auto Mode
      return isAnyOn ? assets.img.mehPashGreenAn : assets.img.mehPashRedAn;
    } else {
      // Manual Mode
      return isAnyOn ? assets.img.mehPashAn : assets.img.mehPash;
    }
  };

  function getTempData() {
    return temp.map((entry) => ({
      time: entry.time,
      sensor1: entry.sensor1,
      sensor2: entry.sensor2,
      sensor3: entry.sensor3,
      sensor4: entry.sensor4,
      sensor5: entry.sensor5,
      sensor6: entry.sensor6,
    }));
  }

  // تابع formatter برای محور X
  const getXAxisFormatter = useMemo(() => {
    return (params) => {
      const timeParts = params.value.split(":");
      if (timeParts.length >= 2) {
        const minute = parseInt(timeParts[1]);

        // نمایش بر اساس interval تنظیم شده
        if (xAxisInterval === 60) {
          // هر 1 ساعت: نمایش ساعت‌های کامل
          if (minute === 0) {
            return `${timeParts[0]}:${timeParts[1]}`;
          }
        } else if (xAxisInterval === 30) {
          // هر نیم ساعت: نمایش ساعت:00 و ساعت:30
          if (minute === 0 || minute === 30) {
            return `${timeParts[0]}:${timeParts[1]}`;
          }
        } else {
          // هر 15 دقیقه: نمایش همه
          return `${timeParts[0]}:${timeParts[1]}`;
        }
      }
      return "";
    };
  }, [xAxisInterval]);

  const [tempOptions, setTempOptions] = useState({
    title: { text: "دما", fontFamily: "IRANSANS" },
    data: temp,
    series: [
      {
        type: "line",
        xKey: "time",
        yKey: "sensor1",
        yName: "سنسور 1",
        stroke: "#FF6B6B",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor2",
        yName: "سنسور 2",
        stroke: "#4ECDC4",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor3",
        yName: "سنسور 3",
        stroke: "#45B7D1",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor4",
        yName: "سنسور 4",
        stroke: "#FFA07A",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor5",
        yName: "سنسور 5",
        stroke: "#98D8C8",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor6",
        yName: "سنسور 6",
        stroke: "#F7DC6F",
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "" },
        label: {
          formatter: getXAxisFormatter,
        },
        tick: {
          interval: xAxisInterval,
        },
      },
      { type: "number", position: "left", title: { text: "دما (°C)" } },
    ],
    legend: { enabled: false },
  });

  const [humOptions, setHumOptions] = useState({
    title: { text: "رطوبت", fontFamily: "IRANSANS" },
    data: humidity,
    series: [
      {
        type: "line",
        xKey: "time",
        yKey: "sensor1",
        yName: "سنسور 1",
        stroke: "#FF6B6B",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor2",
        yName: "سنسور 2",
        stroke: "#4ECDC4",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor3",
        yName: "سنسور 3",
        stroke: "#45B7D1",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor4",
        yName: "سنسور 4",
        stroke: "#FFA07A",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor5",
        yName: "سنسور 5",
        stroke: "#98D8C8",
      },
      {
        type: "line",
        xKey: "time",
        yKey: "sensor6",
        yName: "سنسور 6",
        stroke: "#F7DC6F",
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { text: "" },
        label: {
          formatter: getXAxisFormatter,
        },
        tick: {
          interval: xAxisInterval,
        },
      },
      { type: "number", position: "right", title: { text: "درصد" } },
    ],
    legend: {
      enabled: true,
      position: "bottom",
      spacing: 10,
      item: {
        spacing: 24,
        marker: {
          shape: "circle",
          size: 12,
        },
        label: {
          fontFamily: "IRANSANS",
          direction: "rtl",
        },
      },
    },
  });

  useEffect(() => {
    setTemp([]);
    setHumidity([]);
    setTempOptions((prev) => ({ ...prev, data: [] }));
    setHumOptions((prev) => ({ ...prev, data: [] }));
    setXAxisInterval(180); // reset به پیش‌فرض
  }, [zone]);

  // به‌روزرسانی نمودارها وقتی xAxisInterval تغییر می‌کند
  useEffect(() => {
    setTempOptions((prev) => ({
      ...prev,
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "" },
          label: {
            formatter: getXAxisFormatter,
          },
          tick: {
            interval: xAxisInterval,
          },
        },
        { type: "number", position: "left", title: { text: "دما (°C)" } },
      ],
    }));

    setHumOptions((prev) => ({
      ...prev,
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "" },
          label: {
            formatter: getXAxisFormatter,
          },
          tick: {
            interval: xAxisInterval,
          },
        },
        { type: "number", position: "left", title: { text: "درصد" } },
      ],
    }));
  }, [xAxisInterval, getXAxisFormatter]);

  // تابع retry برای درخواست‌های با timeout
  const fetchWithRetry = async (zoneNum, retries = 3) => {
    // استفاده از baseURL از apiClient
    const baseURL =
      apiClient.defaults?.baseURL || "http://192.168.31.140:8000/api/v1";

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // استفاده از axios مستقیم برای تنظیم timeout بیشتر
        const response = await axios.post(
          `${baseURL}/log/climate/temperature-humidity/`,
          { zone: zoneNum },
          {
            timeout: 180000, // 180 ثانیه (3 دقیقه) timeout برای داده‌های حجیم
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        return response.data;
      } catch (error) {
        console.log(
          `Attempt ${attempt} failed for zone ${zoneNum}, retrying...`,
        );
        if (attempt === retries) {
          throw error;
        }
        // صبر کردن قبل از retry بعدی (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
      }
    }
  };

  // تابع برای دریافت داده‌ها برای zone فعلی
  const fetchDataZoneByZone = async () => {
    try {
      setLoading(true);
      setError(null);

      // دریافت داده‌ها فقط برای zone فعلی
      const response = await fetchWithRetry(zone);
      const data = Array.isArray(response) ? response : response.results || [];

      // فیلتر کردن داده‌ها بر اساس zone در log_data
      const zoneData = data.filter((item) => item.log_data?.zone === zone);
      const sortedData = [...zoneData].reverse();

      // پردازش داده‌ها و تبدیل به فرمت نمودار
      const tempData = [];
      const humData = [];

      sortedData.forEach((item) => {
        const timeStr = item.log_date_time.split(" ")[1]; // Extract HH:MM:SS
        const t = item.log_data.temperature;
        const h = item.log_data.humidity;

        // ایجاد رکورد برای دما
        const tempEntry = {
          time: timeStr,
          sensor1: t?.["1"] ?? 0,
          sensor2: t?.["2"] ?? 0,
          sensor3: t?.["3"] ?? 0,
          sensor4: t?.["4"] ?? 0,
          sensor5: t?.["5"] ?? 0,
          sensor6: t?.["6"] ?? 0,
        };

        // ایجاد رکورد برای رطوبت
        const humEntry = {
          time: timeStr,
          sensor1: h?.["1"] ?? 0,
          sensor2: h?.["2"] ?? 0,
          sensor3: h?.["3"] ?? 0,
          sensor4: h?.["4"] ?? 0,
          sensor5: h?.["5"] ?? 0,
          sensor6: h?.["6"] ?? 0,
        };

        tempData.push(tempEntry);
        humData.push(humEntry);
      });

      // مرتب‌سازی بر اساس زمان
      tempData.sort((a, b) => a.time.localeCompare(b.time));
      humData.sort((a, b) => a.time.localeCompare(b.time));

      // محاسبه بازه زمانی و تنظیم interval محور X
      if (tempData.length > 0) {
        const firstTime = tempData[0].time;
        const lastTime = tempData[tempData.length - 1].time;

        // تبدیل زمان به دقیقه برای محاسبه تفاوت
        const timeToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };

        const firstMinutes = timeToMinutes(firstTime);
        const lastMinutes = timeToMinutes(lastTime);
        const timeRangeMinutes = lastMinutes - firstMinutes;

        // اگر بازه زمانی بیشتر از 12 ساعت باشد، هر 1 ساعت نمایش بده
        // اگر بازه زمانی بین 2 تا 12 ساعت باشد، هر نیم ساعت نمایش بده
        // اگر بازه زمانی کمتر از 2 ساعت باشد، هر 15 دقیقه نمایش بده
        let intervalMinutes;
        if (timeRangeMinutes > 12 * 60) {
          intervalMinutes = 60; // هر 1 ساعت
        } else if (timeRangeMinutes > 2 * 60) {
          intervalMinutes = 30; // هر نیم ساعت
        } else {
          intervalMinutes = 15; // هر 15 دقیقه
        }

        setXAxisInterval(intervalMinutes);
        console.log(
          `Time range: ${firstTime} to ${lastTime} (${timeRangeMinutes} minutes), interval: ${intervalMinutes} minutes`,
        );
      }

      setTemp(tempData);
      setHumidity(humData);

      // لاگ برای دیباگ
      if (tempData.length > 0) {
        console.log(`Zone ${zone} data sample:`, tempData[0]);
        console.log(`Total records: ${tempData.length}`);
      }
    } catch (err) {
      console.error("Error fetching climate data:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataZoneByZone();
    const interval = setInterval(fetchDataZoneByZone, 20000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [zone]);
  // ✅ Update chart data when `temp` changes
  useEffect(() => {
    setTempOptions((prev) => ({ ...prev, data: temp }));
  }, [temp]);

  // ✅ Update chart data when `humidity` changes
  useEffect(() => {
    setHumOptions((prev) => ({ ...prev, data: humidity }));
    // console.log("Updated Humidity Chart Data:", humidity);
  }, [humidity]);

  // const sendBoolean = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://192.168.100.51:8000/api/v1/climate/operators-mode/?zone=1",
  //       { mode: true, zone: 1 }, // payload: sending { value: true } or { value: false }
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("API success:", res.data);
  //   } catch (error) {
  //     console.error("API error:", error);
  //   }
  // };
  return (
    <Container
      sx={{
        width: "1004px",
        height: "614px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
        transform: "scale(0.93)",
        transformOrigin: "top center",
      }}
    >
      <Box
        sx={{
          width: "1003px",
          height: "483px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "901px",
            height: "556px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "901px",
              height: "56px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Box
              sx={{
                width: "172px",
                height: "56",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #5F5F5F",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingX: "8px",
                paddingY: "6px",
              }}
            >
              <img src={assets.svg.auto} alt="" />
              <img
                onClick={() => {
                  changOnAndOff(); // first function
                  //sendBoolean(); // second function
                }}
                className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
                src={operatorMode ? assets.svg.buttonOn : assets.svg.buttonOff}
                alt=""
              />
            </Box>
            <Box
              sx={{
                width: "130px",
                height: "56px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                px: 1,
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={12}>
                وضعیت عملگر دما:
              </Typography>
              <Typography fontSize={36} color="#000000" fontWeight={"bold"}>
                A
              </Typography>
            </Box>

            <Box
              sx={{
                width: "120px",
                height: "56px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                px: 1,
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={12}>
                وضعیت عملگرها رطوبت:
              </Typography>
              <Typography fontSize={36} color="#000000" fontWeight={"bold"}>
                B
              </Typography>
            </Box>
            <Box
              sx={{
                width: "392px",
                height: "37px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <img
                src={assets.svg.nextBtn}
                alt=""
                className="button"
                onClick={() => {
                  setZone((prev) => Math.min(prev + 1, 5));
                  setTempOptions((prev) => ({ ...prev, data: [] }));
                  setHumOptions((prev) => ({ ...prev, data: [] }));
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <Box
                sx={{
                  width: "288px",
                  height: "37px",
                  display: "flex",
                  backgroundColor: "#FFFFFF",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  justifyContent: "space-between",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                }}
              >
                <Box
                  sx={{
                    width: "206px",
                    height: "37px",
                    backgroundColor: "#FFCB82",
                    overflow: "hidden",
                    border: "0.5px solid #9F9F9F",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    fontFamily={"IRANSANS"}
                    fontSize={21}
                    color="#3A3A3A"
                    textAlign={"center"}
                    alignContent={"center"}
                  >
                    زون
                  </Typography>
                </Box>
                <Typography
                  fontSize={21}
                  color="#5B5B5B"
                  marginLeft={"40px"}
                  alignContent={"center"}
                >
                  {zone}
                </Typography>
              </Box>
              <img
                src={assets.svg.prevBtn}
                alt=""
                className="button"
                onClick={() => {
                  setZone((prev) => Math.max(prev - 1, 1));
                  setTempOptions((prev) => ({ ...prev, data: [] }));
                  setHumOptions((prev) => ({ ...prev, data: [] }));
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "901px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: "90px",
                height: "483px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    exhaustFanStates.fan1,
                    exhaustFanStates.fan2,
                    exhaustFanStates.fan3,
                    exhaustFanStates.fan4,
                  ]}
                />
                <img
                  src={getExhaustFanIcon()}
                  alt=""
                  className="payesh-svg payesh-svg-fan1 button"
                  onClick={handleExhaustFanClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    circulationFanStates.fan1,
                    circulationFanStates.fan2,
                  ]}
                />
                <img
                  src={getCirculationFanIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleCirculationFanClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    heaterStates.hiter1,
                    heaterStates.hiter2,
                    heaterStates.hiter3,
                    heaterStates.hiter4,
                  ]}
                />
                <img
                  src={getHeaterIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleHeaterClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[padPumpState]} />
                <img
                  src={getPadIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handlePadPumpClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[shadeStates.opening, shadeStates.closing]}
                />
                <img
                  src={getShadeIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleShadeClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[hatchStates.opening, hatchStates.closing]}
                />
                <img
                  src={getHatchIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleHatchClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[foggerState]} />
                <img
                  src={getFoggerIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleFoggerClick}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "790px",
                  height: "232px",
                  borderRadius: "10px",
                  border: "0.5px solid #9F9F9F",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <AgCharts
                  options={tempOptions}
                  style={{
                    width: "790px",
                    height: "232px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "790px",
                  height: "232px",
                  borderRadius: "10px",
                  border: "0.5px solid #9F9F9F",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <AgCharts
                  options={humOptions}
                  style={{
                    width: "790px",
                    height: "232px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "56px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "center",
              marginTop: "10px",
              flexGrow: 1,
              gap: 8,
              mt: 3,
              right: "20px",
              position: "relative",
            }}
          >
            <IconTextButton
              icon={assets.svg.setting2}
              text="تنظیمات"
              onClick={handleOpen}
              bgColor="#6CCDB0"
              textColor="#000000"
              borderColor="#77b39dff"
              width="220px"
            />
            {/* <Button
              sx={{
                width: "246px",
                height: "56px",
                backgroundColor: "#6CCDB0",
                borderRadius: "10px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                paddingX: "30px",
                color: "#000000",
              }}
              onClick={handleOpen}
            >
              <img src={assets.svg.setting2} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                تنظیمات
              </Typography>
            </Button> */}
            <IconTextButton
              icon={assets.svg.warning}
              text="تداخلات عملگرها"
              bgColor="#FFCB82"
              textColor="#000000"
              onClick={() => {}}
              borderColor="#dcaf70ff"
              width="220px"
            />

            {/* <Button
              sx={{
                width: "234px",
                height: "56px",
                borderRadius: "10px",
                backgroundColor: "#FFCB82",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <img src={assets.svg.warning} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                تداخلات عملگرها
              </Typography>
            </Button> */}

            <IconTextButton
              icon={assets.svg.schedule}
              text="برنامه زمانی عملگرها"
              bgColor="#FFCB82"
              textColor="#000000"
              onClick={() => navigate("/payesh-time-plans")} // Update onClick
              borderColor="#dcaf70ff"
              width="220px"
            />
            {/* <Button
              sx={{
                width: "246px",
                height: "56px",
                backgroundColor: "#FFCB82",
                borderRadius: "10px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                paddingX: "0px",
                color: "#000000",
              }}
            >
              <img src={assets.svg.schedule} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                برنامه زمانی عملگرها
              </Typography>
            </Button> */}
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "48%",
            transform: "translate(-50%, -50%)",
            scale: "0.95",
          }}
        >
          <img
            src={assets.svg.unDone}
            alt=""
            className="button"
            style={{
              scale: "1",
              position: "relative",
              top: "50px",
              right: "25px",
            }}
            onClick={handleClose}
          />
          <PayeshSetting zone={zone} />
        </Box>
      </Modal>

      {/* Exhaust Fan Control Modal */}
      <Modal
        open={exhaustFanModalOpen}
        onClose={() => setExhaustFanModalOpen(false)}
        aria-labelledby="exhaust-fan-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل فن‌های اگزاست
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setExhaustFanModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  فن اگزاست {num}
                </Typography>
                <img
                  src={
                    exhaustFanStates[`fan${num}`]
                      ? assets.svg.buttonOn
                      : assets.svg.buttonOff
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleExhaustFan(`fan${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Circulation Fan Control Modal */}
      <Modal
        open={circulationFanModalOpen}
        onClose={() => setCirculationFanModalOpen(false)}
        aria-labelledby="circulation-fan-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل فن‌های سیرکوله
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setCirculationFanModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  فن سیرکوله {num}
                </Typography>
                <img
                  src={
                    circulationFanStates[`fan${num}`]
                      ? assets.svg.buttonOn
                      : assets.svg.buttonOff
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleCirculationFan(`fan${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Pad Pump Control Modal */}
      <Modal
        open={padPumpModalOpen}
        onClose={() => setPadPumpModalOpen(false)}
        aria-labelledby="pad-pump-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل پمپ پد
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setPadPumpModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 1,
              }}
            >
              <Typography fontFamily="IRANSANS" fontSize={18}>
                پمپ پد
              </Typography>
              <img
                src={padPumpState ? assets.svg.buttonOn : assets.svg.buttonOff}
                alt="toggle"
                style={{ width: "50px", cursor: "pointer" }}
                onClick={togglePadPump}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Fogger Control Modal */}
      <Modal
        open={foggerModalOpen}
        onClose={() => setFoggerModalOpen(false)}
        aria-labelledby="fogger-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل مه پاش
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setFoggerModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 1,
              }}
            >
              <Typography fontFamily="IRANSANS" fontSize={18}>
                مه پاش
              </Typography>
              <img
                src={foggerState ? assets.svg.buttonOn : assets.svg.buttonOff}
                alt="toggle"
                style={{ width: "50px", cursor: "pointer" }}
                onClick={toggleFogger}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Hatch Control Modal */}
      <Modal
        open={hatchModalOpen}
        onClose={() => setHatchModalOpen(false)}
        aria-labelledby="hatch-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل دریچه
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setHatchModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["opening", "closing"].map((action) => (
              <Box
                key={action}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  {action === "opening" ? "باز شدن دریچه" : "بسته شدن دریچه"}
                </Typography>
                <img
                  src={
                    hatchStates[action]
                      ? assets.svg.buttonOn
                      : assets.svg.buttonOff
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleHatch(action)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Shade Control Modal */}
      <Modal
        open={shadeModalOpen}
        onClose={() => setShadeModalOpen(false)}
        aria-labelledby="shade-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل پرده
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setShadeModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["opening", "closing"].map((action) => (
              <Box
                key={action}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  {action === "opening" ? "باز شدن پرده" : "بسته شدن پرده"}
                </Typography>
                <img
                  src={
                    shadeStates[action]
                      ? assets.svg.buttonOn
                      : assets.svg.buttonOff
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleShade(action)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Heater Control Modal */}
      <Modal
        open={heaterModalOpen}
        onClose={() => setHeaterModalOpen(false)}
        aria-labelledby="heater-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل هیترها
            </Typography>
            <img
              src={assets.svg.close}
              alt="Close"
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
              onClick={() => setHeaterModalOpen(false)}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  هیتر {num}
                </Typography>
                <img
                  src={
                    heaterStates[`hiter${num}`]
                      ? assets.svg.buttonOn
                      : assets.svg.buttonOff
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleHeater(`hiter${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Payesh;
