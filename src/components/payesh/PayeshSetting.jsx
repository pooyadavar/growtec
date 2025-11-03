import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  Grid,
  TextField,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import assets from "../../assets";
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
      {/* Box سمت چپ: نمایش بازه */}
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
        {/* برچسب بازه (بازه ۱، ۲، ۳) */}
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

      {/* ورودی عددی سمت راست */}
      <TextField
        type="number"
        variant="outlined"
        value={rangeValue}
        onChange={(e) => {
          const value = e.target.value;
          const numValue = Number(value);
          if (value === "" || (numValue >= 0 && numValue <= 24)) {
            setRangeValue(value);
          }
        }}
        inputProps={{ min: 0, max: 24 }}
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
              MozAppearance: "textfield",
              appearance: "textfield",
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
  rangeNum,
}) => {
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(parseFloat(value))) {
      setter(value);
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
    MozAppearance: "textfield",
    appearance: "textfield",
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
      {/* برچسب‌های حداکثر/حداقل */}
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

      {/* باکس ورودی‌ها و برچسب بازه زمانی */}
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
            type="number"
            value={maxState}
            onChange={handleInputChange(setMaxState)}
            style={{ ...inputStyle, borderRight: "0.5px solid #9F9F9F" }}
            onWheel={(e) => e.target.blur()}
          />
          <input
            type="number"
            value={minState}
            onChange={handleInputChange(setMinState)}
            style={inputStyle}
            onWheel={(e) => e.target.blur()}
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

// 3. کامپوننت وضعیت کنترلر (فن، بخاری، پمپ)
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

const PayeshSetting = ({ zone }) => {
  // === Helper Functions ===
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  // === State Management ===
  const [selected, setSelected] = useState("A");
  const [part, setPart] = useState(1);
  const buttons = ["A", "B", "C", "D", "تنظیمات ویژه"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stateهای بازه زمانی
  const [range1, setRange1] = useState(0);
  const [range2, setRange2] = useState(0);
  const [range3, setRange3] = useState(0);

  // Stateهای دمای حداقل و حداکثر
  const [tempMax1, setTempMax1] = useState(0);
  const [tempMax2, setTempMax2] = useState(0);
  const [tempMax3, setTempMax3] = useState(0);
  const [tempMin1, setTempMin1] = useState(0);
  const [tempMin2, setTempMin2] = useState(0);
  const [tempMin3, setTempMin3] = useState(0);

  // Stateهای رطوبت حداقل و حداکثر (به صورت string نگهداری می‌شوند تا ورودی خالی را مدیریت کنند)
  const [humMax1, sethumMax1] = useState("0.0");
  const [humMax2, sethumMax2] = useState("0.0");
  const [humMax3, sethumMax3] = useState("0.0");
  const [humMin1, setHumMin1] = useState("0.0");
  const [humMin2, setHumMin2] = useState("0.0");
  const [humMin3, setHumMin3] = useState("0.0");

  // Stateهای کنترلرها
  const [humControllers, setHumControllers] = useState({
    exhaust_fan_1: false,
    exhaust_fan_2: false,
    fogger: false,
    pump_pad_off: false,
    roof_hatch: false,
  });
  const [tempControllers, setTempControllers] = useState({
    exhaust_fan_1: false,
    exhaust_fan_2: false,
    exhaust_fan_3: false,
    shid: false,
    meh_pash: false,
    pump_pad: false,
    heater_1: false,
    heater_2: false,
    roof_hatch: false,
  });

  // این آبجکت‌ها برای Payloadهای API و همچنین استفاده در UI به کار می‌روند.
  const humidityObject = useMemo(
    () => ({
      1: { minimum: humMin1, maximum: humMax1 },
      2: { minimum: humMin2, maximum: humMax2 },
      3: { minimum: humMin3, maximum: humMax3 },
    }),
    [humMin1, humMin2, humMin3, humMax1, humMax2, humMax3]
  );

  const tempObject = useMemo(
    () => ({
      1: { minimum: tempMin1, maximum: tempMax1 },
      2: { minimum: tempMin2, maximum: tempMax2 },
      3: { minimum: tempMin3, maximum: tempMax3 },
    }),
    [tempMax1, tempMax2, tempMax3, tempMin1, tempMin2, tempMin3]
  );

  // === API Logic ===
  const apiDomain = "http://192.168.100.51:8000";

  const DUMMY_DATA = {
    // شبیه سازی خروجی range-start-time (زمان شروع بازه‌ها بر حسب ساعت)
    rangeStartTimes: [8, 16, 0], // مثال: 8 صبح, 4 عصر, 12 شب (0)

    // شبیه سازی خروجی temperature-range (حداقل/حداکثر دما برای هر بازه)
    tempRanges: {
      1: { minimum: 20, maximum: 30 },
      2: { minimum: 18, maximum: 25 },
      3: { minimum: 15, maximum: 22 },
    },

    // شبیه سازی خروجی humidity-range (حداقل/حداکثر رطوبت برای هر بازه)
    humRanges: {
      1: { minimum: 60.5, maximum: 85.0 },
      2: { minimum: 55.0, maximum: 75.5 },
      3: { minimum: 50.0, maximum: 70.0 },
    },

    // شبیه سازی خروجی temperature-range-operator (وضعیت کنترلرهای دما)
    tempOperators: {
      exhaust_fan_1: true,
      exhaust_fan_2: false,
      exhaust_fan_3: true,
      shid: false,
      mehpash: true,
      pump_pad: true,
      heater_1: false,
      heater_2: true,
      roof_hatch: false,
    },

    // شبیه سازی خروجی humidity-range-operator (وضعیت کنترلرهای رطوبت)
    humOperators: {
      exhaust_fan_1: true,
      exhaust_fan_2: false,
      exhaust_fan_2: true,
      exhaust_fan_4: false,
      sirkoole_fan_1: true,
      sirkoole_fan_2:false,
    },
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // شبیه سازی تأخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 ثانیه تأخیر

    try {
      // داده‌های Hardcode را مستقیماً به متغیرها اختصاص می‌دهیم.
      const resp1_data = DUMMY_DATA.rangeStartTimes;
      const resp2_data = DUMMY_DATA.tempRanges;
      const resp3_data = DUMMY_DATA.humRanges;
      const resp4_data = DUMMY_DATA.tempOperators;
      const resp5_data = DUMMY_DATA.humOperators;

      // بروزرسانی Stateهای بازه زمانی
      setRange1(resp1_data[0]);
      setRange2(resp1_data[1]);
      setRange3(resp1_data[2]);

      // بروزرسانی Stateهای دما (توجه: مقادیر minimum و maximum از API به صورت عدد/رشته می‌آیند)
      setTempMax1(resp2_data["1"]["maximum"]);
      setTempMin1(resp2_data["1"]["minimum"]);
      setTempMax2(resp2_data["2"]["maximum"]);
      setTempMin2(resp2_data["2"]["minimum"]);
      setTempMax3(resp2_data["3"]["maximum"]);
      setTempMin3(resp2_data["3"]["minimum"]);

      // بروزرسانی Stateهای رطوبت
      sethumMax1(resp3_data["1"]["maximum"]);
      setHumMin1(resp3_data["1"]["minimum"]);
      sethumMax2(resp3_data["2"]["maximum"]);
      setHumMin2(resp3_data["2"]["minimum"]);
      sethumMax3(resp3_data["3"]["maximum"]);
      setHumMin3(resp3_data["3"]["minimum"]);

      // بروزرسانی Stateهای کنترلرها
      setTempControllers(resp4_data);
      setHumControllers(resp5_data);
    } catch (err) {
      // این بخش در حالت Hardcode نباید اجرا شود، مگر اینکه خطایی در تخصیص داده باشد.
      console.error("Error fetching hardcoded data:", err);
      setError("خطا در تخصیص داده‌های ساختگی.");
    } finally {
      setLoading(false);
    }
  }, [zone, part]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تابع یکپارچه برای fetch
  // const fetchData = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     // استفاده از Promise.all برای فراخوانی همزمان APIها
  //     const [resp1, resp2, resp3, resp4, resp5] = await axios.all([
  //       axios.get(`${apiDomain}/api/v1/climate/range-start-time/?zone=${zone}`),
  //       axios.get(`${apiDomain}/api/v1/climate/temperature-range/?zone=${zone}&part=${part}`),
  //       axios.get(`${apiDomain}/api/v1/climate/humidity-range/?zone=${zone}&part=${part}`),
  //       axios.get(`${apiDomain}/api/v1/climate/temperature-range-operator/?zone=${zone}&part=${part}`),
  //       axios.get(`${apiDomain}/api/v1/climate/humidity-range-operator/?zone=${zone}&part=${part}`),
  //     ]);

  //     // بروزرسانی Stateهای بازه زمانی
  //     setRange1(resp1.data[0]);
  //     setRange2(resp1.data[1]);
  //     setRange3(resp1.data[2]);

  //     // بروزرسانی Stateهای دما
  //     setTempMax1(resp2.data["1"]["maximum"]); setTempMin1(resp2.data["1"]["minimum"]);
  //     setTempMax2(resp2.data["2"]["maximum"]); setTempMin2(resp2.data["2"]["minimum"]);
  //     setTempMax3(resp2.data["3"]["maximum"]); setTempMin3(resp2.data["3"]["minimum"]);

  //     // بروزرسانی Stateهای رطوبت
  //     sethumMax1(resp3.data["1"]["maximum"]); setHumMin1(resp3.data["1"]["minimum"]);
  //     sethumMax2(resp3.data["2"]["maximum"]); setHumMin2(resp3.data["2"]["minimum"]);
  //     sethumMax3(resp3.data["3"]["maximum"]); setHumMin3(resp3.data["3"]["minimum"]);

  //     // بروزرسانی Stateهای کنترلرها
  //     setTempControllers(resp4.data);
  //     setHumControllers(resp5.data);

  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setError(err.message || "خطا در دریافت اطلاعات.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [zone, part]);

  // useEffect(() => {
  //   fetchData();
  //   // وابستگی به `fetchData` اضافه شد چون از `useCallback` استفاده کردیم.
  // }, [fetchData]);

  // تابع یکپارچه برای Save (کاهش تکرار در POSTها)
  const handleSave = async () => {
    const formatValue = (value) => parseFloat(value || 0).toFixed(1);

    const formatRangeObject = (obj) => ({
      1: {
        minimum: formatValue(obj[1].minimum),
        maximum: formatValue(obj[1].maximum),
      },
      2: {
        minimum: formatValue(obj[2].minimum),
        maximum: formatValue(obj[2].maximum),
      },
      3: {
        minimum: formatValue(obj[3].minimum),
        maximum: formatValue(obj[3].maximum),
      },
    });

    const payloads = [
      {
        api: `${apiDomain}/api/v1/climate/temperature-range/`,
        data: { temperature_range: formatRangeObject(tempObject), zone, part },
      },
      {
        api: `${apiDomain}/api/v1/climate/humidity-range/`,
        data: { humidity_range: formatRangeObject(humidityObject), zone, part },
      },
      {
        api: `${apiDomain}/api/v1/climate/range-start-time/`,
        data: {
          range_start_time: [
            parseInt(range1 || 0),
            parseInt(range2 || 0),
            parseInt(range3 || 0),
          ],
        },
      },
    ];

    try {
      await axios.all(payloads.map((p) => axios.post(p.api, p.data)));
      console.log("Data successfully saved!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("خطا در ذخیره داده‌ها.");
    }
  };

  const toggleTempController = (key) =>
    setTempControllers((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleHumController = (key) =>
    setHumControllers((prev) => ({ ...prev, [key]: !prev[key] }));

  const tempControllerList = [
    {
      label: "شید",
      key: "shid",
      onClick: () => toggleTempController("shid"),
    },
    {
      label: "مه پاش",
      key: "meh_pash",
      onClick: () => toggleTempController("meh_pash"),
    },
    {
      label: "پمپ پد",
      key: "pump_pad",
      onClick: () => toggleTempController("pump_pad"),
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
      label: "فن ۳",
      key: "exhaust_fan_3",
      onClick: () => toggleHumController("exhaust_fan_3"),
    },
    {
      label: "فن ۴",
      key: "exhaust_fan_4",
      onClick: () => toggleHumController("exhaust_fan_4"),
    },
    {
      label: "فن سیرکوله۱",
      key: "sirkoole_fan_1",
      onClick: () => toggleHumController("sirkoole_fan_1"),
    },
        {
      label: "فن سیرکوله۲",
      key: "sirkoole_fan_2",
      onClick: () => toggleHumController("sirkoole_fan_2"),
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
      }}
    >
      {loading || error ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(237, 236, 236, 0.8)", 
            borderRadius: "15px",
            zIndex: 10, 
          }}
        >
          {loading && (
            <Stack spacing={2} alignItems="center">
              <CircularProgress color="primary" />
              <Typography fontFamily={"IRANSANS"}>
                در حال بارگذاری...
              </Typography>
            </Stack>
          )}
          {error && (
            <Typography fontFamily={"IRANSANS"} color="error">
              خطا: {error}
            </Typography>
          )}
        </Box>
      ) : (
        <>
          {/* ۱. بخش تنظیم بازه‌های زمانی (بالای صفحه) */}
          <Stack spacing={1.5} sx={{ width: "450px" }}>
            <TimeRangeInput
              label="بازه ۱"
              rangeValue={range1}
              setRangeValue={setRange1}
              displayRange={`${convert(range2)} - ${convert(range1)}`}
            />
            <TimeRangeInput
              label="بازه ۲"
              rangeValue={range2}
              setRangeValue={setRange2}
              displayRange={`${convert(range3)} - ${convert(range2)}`}
            />
            <TimeRangeInput
              label="بازه ۳"
              rangeValue={range3}
              setRangeValue={setRange3}
              displayRange={`${convert(range1)} - ${convert(range3)}`}
            />
          </Stack>

          {/* ۲. بخش تنظیمات دما و رطوبت (تب‌ها) */}
          <Box
            sx={{
              width: "765px",
              height: "560px",
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            {/* سربرگ تب‌ها (A, B, C, D) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                width: "450px",
              }}
            >
              {buttons.map((label, index) => (
                <Box
                  key={label}
                  onClick={() => {
                    setSelected(label);
                    setPart(index + 1);
                  }}
                  sx={{
                    paddingX: "14px",
                    marginRight: index !== buttons.length - 1 ? "14px" : 0,
                    height: "46px",
                    borderRadius: "10px 10px 0 0",
                    backgroundColor: selected === label ? "#ffffff" : "#FFCB82",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: index === buttons.length - 1 ? "100px" : "55px",
                  }}
                >
                  <Typography
                    fontSize={16}
                    fontFamily={"IRANSANS"}
                    color={"#111111"}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* محتوای تب */}
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
              }}
            >
              {/* محتوای تنظیمات (دما / رطوبت) */}
              <Box
                sx={{
                  width: "733px",
                  height: "390px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* بخش دما (Temperature) */}
                <Stack
                  width="356px"
                  spacing={2}
                  sx={{
                    display: selected !== "تنظیمات ویژه" ? "flex" : "none",
                  }}
                >
                  {/* فرض می‌کنیم 'دما' محتوای اصلی تب‌های A,B,C,D باشد */}
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
                    {/* ورودی‌های حداقل/حداکثر دما */}
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

                    {/* وضعیت کنترلرهای دما */}
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      sx={{ width: "320px", marginTop: 2 }}
                    >
                      {tempControllerList.map((ctrl) => (
                        <Grid
                          item
                          key={ctrl.key}
                          xs={2}
                          sx={{ padding: "4px !important"  ,display: 'flex', justifyContent: 'center' }}
                        >
                          <ControllerStatus
                            label={ctrl.label}
                            isActive={tempControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Stack>

                {/* بخش رطوبت (Humidity) */}
                <Stack
                  width="356px"
                  spacing={2}
                  sx={{
                    display: selected !== "تنظیمات ویژه" ? "flex" : "none",
                  }}
                >
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
                    {/* ورودی‌های حداقل/حداکثر رطوبت */}
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

                    {/* وضعیت کنترلرهای رطوبت */}
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      sx={{ width: "320px", marginTop: 2 }}
                    >
                      {humControllerList.map((ctrl) => (
                        <Grid
                          item
                          key={ctrl.key}
                          xs={2}
                          sx={{ padding: "4px !important" , display: 'flex', justifyContent: 'center' }}
                        >
                          <ControllerStatus
                            label={ctrl.label}
                            isActive={humControllers[ctrl.key]}
                            iconSrc={assets.svg.done}
                            onClick={ctrl.onClick}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Stack>
              </Box>

              {/* دکمه ذخیره */}
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
                />
                ذخیره
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default PayeshSetting;
