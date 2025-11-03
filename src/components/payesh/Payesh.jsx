import React, { useState, useEffect } from "react";
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

const Payesh = () => {
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
  function getTempData() {
    return temp.map((entry) => ({
      time: entry.time,
      zone1: entry.zone1,
      zone2: entry.zone2,
      zone3: entry.zone3,
      zone4: entry.zone4,
      zone5: entry.zone5,
      zone6: entry.zone6,
    }));
  }

  const [tempOptions, setTempOptions] = useState({
    title: { text: "دما", fontFamily: "IRANSANS" },
    data: temp, // Fix: Use the full array, not temp[0]
    series: [
      { type: "line", xKey: "time", yKey: "zone1", yName: "1" },
      { type: "line", xKey: "time", yKey: "zone2", yName: "2" },
      { type: "line", xKey: "time", yKey: "zone3", yName: "3" },
      { type: "line", xKey: "time", yKey: "zone4", yName: "4" },
      { type: "line", xKey: "time", yKey: "zone5", yName: "5" },
      { type: "line", xKey: "time", yKey: "zone6", yName: "6" },
    ],
    axes: [
      { type: "category", position: "bottom", title: { text: "" } }, // Change "time" to "category"
      { type: "number", position: "left", title: { text: "دما (°C)" } },
    ],
    legend: { enabled: true },
  });

  const [humOptions, setHumOptions] = useState({
    title: { text: "رطوبت", fontFamily: "IRANSANS" },
    data: humidity,
    series: [
      { type: "line", xKey: "time", yKey: "zone1", yName: "1" },
      { type: "line", xKey: "time", yKey: "zone2", yName: "2" },
      { type: "line", xKey: "time", yKey: "zone3", yName: "3" },
      { type: "line", xKey: "time", yKey: "zone4", yName: "4" },
      { type: "line", xKey: "time", yKey: "zone5", yName: "5" },
      { type: "line", xKey: "time", yKey: "zone6", yName: "6" },
    ],
    axes: [
      { type: "category", position: "bottom", title: { text: "" } }, // Change "time" to "category"
      { type: "number", position: "left", title: { text: "درصد" } },
    ],
  });
  useEffect(() => {
    setTemp([]);
    setHumidity([]);
    setTempOptions((prev) => ({ ...prev, data: [] }));
    setHumOptions((prev) => ({ ...prev, data: [] }));
  }, [zone]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });

      // داده ساختگی دما
      const mockTemp = {
        time: now,
        zone1: 25 + Math.random() * 2,
        zone2: 26 + Math.random() * 2,
        zone3: 27 + Math.random() * 2,
        zone4: 24 + Math.random() * 2,
        zone5: 28 + Math.random() * 2,
        zone6: 26 + Math.random() * 2,
      };

      // داده ساختگی رطوبت
      const mockHum = {
        time: now,
        zone1: 55 + Math.random() * 5,
        zone2: 60 + Math.random() * 5,
        zone3: 58 + Math.random() * 5,
        zone4: 62 + Math.random() * 5,
        zone5: 59 + Math.random() * 5,
        zone6: 63 + Math.random() * 5,
      };

      setTemp((prev) => [...prev.slice(-5), mockTemp]); // نگه‌داشتن فقط 6 داده آخر
      setHumidity((prev) => [...prev.slice(-5), mockHum]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  // const fetchData = async () => {
  //   try {
  //     // Replace with your API endpoints
  //     // let api1 = `${apiDomain}/api/v1/climate/temperature-humidity/?zone=${zone}`;
  //     // let api2 = `${apiDomain}/api/v1/climate/operators-mode/?zone=1`;

  //     // aliiiiiiiiiiiiiiiiiiiiiiiiii----------------
  //     // const response2 = await axios.get(api2);
  //     setActivity(response2.data);
  //     // const [response1] = await axios.all([axios.get(api1)]);
  //     let tempData = response1.data.temperature;
  //     const humidityData = response1.data.humidity;

  //     const now = new Date().toLocaleTimeString("fa-IR", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: false, // 24-hour format
  //       timeZone: "Asia/Tehran",
  //     });
  //     // Create a structured object with zones 1-6
  //     const newEntry = {
  //       time: now,
  //       zone1: tempData["1"],
  //       zone2: tempData["2"],
  //       zone3: tempData["3"],
  //       zone4: tempData["4"],
  //       zone5: tempData["5"],
  //       zone6: tempData["6"],
  //       average: tempData["avg"],
  //     };
  //     const newHumidityEntry = {
  //       time: now,
  //       zone1: humidityData["1"],
  //       zone2: humidityData["2"],
  //       zone3: humidityData["3"],
  //       zone4: humidityData["4"],
  //       zone5: humidityData["5"],
  //       zone6: humidityData["6"],
  //     };
  //     // ✅ Ensure temp updates correctly
  //     setTemp((prev) => {
  //       const updatedTemp = [...prev, newEntry].slice(-6); // Keep last 6 entries
  //       return updatedTemp;
  //     });

  //     setHumidity((prev) => {
  //       const updatedHumidity = [...prev, newHumidityEntry].slice(-6);
  //       return updatedHumidity;
  //     });
  //   } catch (err) {
  //     setError(err.message || "Something went wrong");
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  //   const interval = setInterval(fetchData, 3000);
  //   return () => clearInterval(interval);
  // }, [zone]);
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
                  setZone((prev) => Math.min(prev + 1, 6));
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
              justifyContent: "flex-start",
              marginTop: "10px",
              flexGrow: 1,
              gap: 2,
            }}
          >
            <IconTextButton
              icon={assets.svg.setting2}
              text="تنظیمات"
              onClick={handleOpen}
              bgColor="#6CCDB0"
              textColor="#000000"
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
              onClick={() => {}}
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
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={assets.svg.unDone}
            alt=""
            className="button"
            style={{
              scale: "2",
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
