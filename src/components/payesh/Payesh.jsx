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

const Payesh = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isChanging, setIsChanging] = React.useState(false);
  const [activity, setActivity] = React.useState(false);

  const changOnAndOff = () => {
    setIsChanging(true);
    setTimeout(() => {
      setActivity(!activity);
      setIsChanging(false);
    }, 200); // Match this to the CSS transition duration
  };
  // Modal States --------
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Modal States --------

  const [zone, setZone] = useState(1);
  const apiDomain = "http://192.168.100.51:8000";
  const [humidity, setHumidity] = useState([]);
  const [temp, setTemp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xAxisInterval, setXAxisInterval] = useState(180); // پیش‌فرض: هر 3 ساعت
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
      const timeParts = params.value.split(':');
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
      return '';
    };
  }, [xAxisInterval]);

  const [tempOptions, setTempOptions] = useState({
    title: { text: "دما", fontFamily: "IRANSANS" },
    data: temp,
    series: [
      { type: "line", xKey: "time", yKey: "sensor1", yName: "سنسور 1", stroke: "#FF6B6B" },
      { type: "line", xKey: "time", yKey: "sensor2", yName: "سنسور 2", stroke: "#4ECDC4" },
      { type: "line", xKey: "time", yKey: "sensor3", yName: "سنسور 3", stroke: "#45B7D1" },
      { type: "line", xKey: "time", yKey: "sensor4", yName: "سنسور 4", stroke: "#FFA07A" },
      { type: "line", xKey: "time", yKey: "sensor5", yName: "سنسور 5", stroke: "#98D8C8" },
      { type: "line", xKey: "time", yKey: "sensor6", yName: "سنسور 6", stroke: "#F7DC6F" },
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
        }
      },
      { type: "number", position: "left", title: { text: "دما (°C)" } },
    ],
    legend: { enabled: false },
  });

  const [humOptions, setHumOptions] = useState({
    title: { text: "رطوبت", fontFamily: "IRANSANS" },
    data: humidity,
    series: [
      { type: "line", xKey: "time", yKey: "sensor1", yName: "سنسور 1", stroke: "#FF6B6B" },
      { type: "line", xKey: "time", yKey: "sensor2", yName: "سنسور 2", stroke: "#4ECDC4" },
      { type: "line", xKey: "time", yKey: "sensor3", yName: "سنسور 3", stroke: "#45B7D1" },
      { type: "line", xKey: "time", yKey: "sensor4", yName: "سنسور 4", stroke: "#FFA07A" },
      { type: "line", xKey: "time", yKey: "sensor5", yName: "سنسور 5", stroke: "#98D8C8" },
      { type: "line", xKey: "time", yKey: "sensor6", yName: "سنسور 6", stroke: "#F7DC6F" },
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
        }
      },
      { type: "number", position: "left", title: { text: "درصد" } },
    ],
    legend: {
      enabled: true,
      position: "bottom",
      spacing: 20,
      item: {
        marker: { shape: "circle" },
        paddingX: 30,
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
          }
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
          }
        },
        { type: "number", position: "left", title: { text: "درصد" } },
      ],
    }));
  }, [xAxisInterval, getXAxisFormatter]);

  // تابع retry برای درخواست‌های با timeout
  const fetchWithRetry = async (zoneNum, retries = 3) => {
    // استفاده از baseURL از apiClient
    const baseURL = apiClient.defaults?.baseURL || 'http://192.168.31.140:8000/api/v1';
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // استفاده از axios مستقیم برای تنظیم timeout بیشتر
        const response = await axios.post(
          `${baseURL}/log/climate/temperature-humidity/`,
          { zone: zoneNum },
          {
            timeout: 180000, // 180 ثانیه (3 دقیقه) timeout برای داده‌های حجیم
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      } catch (error) {
        console.log(`Attempt ${attempt} failed for zone ${zoneNum}, retrying...`);
        if (attempt === retries) {
          throw error;
        }
        // صبر کردن قبل از retry بعدی (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
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
          const [hours, minutes] = timeStr.split(':').map(Number);
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
        console.log(`Time range: ${firstTime} to ${lastTime} (${timeRangeMinutes} minutes), interval: ${intervalMinutes} minutes`);
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
                src={activity ? assets.svg.buttonOff : assets.svg.buttonOn}
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
                width: "62px",
                height: "483px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <img
                src={assets.img.fan1An}
                alt=""
                className="payesh-svg payesh-svg-fan1 button"
              />
              <img
                src={assets.img.fan2An}
                alt=""
                className="payesh-svg button"
              />
              <img
                src={assets.img.bokhariAn}
                alt=""
                className="payesh-svg button"
              />
              <img
                src={assets.img.padAN}
                alt=""
                className="payesh-svg button"
              />
              <img
                src={assets.img.pardeAn}
                alt=""
                className="payesh-svg button"
              />
              <img
                src={assets.img.daricheAn}
                alt=""
                className="payesh-svg button"
              />
              <img
                src={assets.img.mehPashAn}
                alt=""
                className="payesh-svg button"
              />
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
                  width: "826px",
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
                    width: "826px",
                    height: "232px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "826px",
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
                    width: "826px",
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
            scale: "0.95"
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
    </Container>
  );
};

export default Payesh;
