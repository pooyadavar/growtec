import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import assets from "../../assets";
import axios from "axios";

const PayeshSetting = ({ zone }) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  // Select A-B-C-D Title ------
  const [selected, setSelected] = useState("A");
  const [part, setPart] = useState(1);
  const buttons = ["A", "B", "C", "D", "تنظیمات ویژه"];
  // Select A-B-C-D Title ------

  ///////////////////////

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  ///////////////////////

  const [range1, setRange1] = useState(0);
  const [range2, setRange2] = useState(0);
  const [range3, setRange3] = useState(0);

  ///////////////////////

  const [tempMax1, setTempMax1] = useState(0);
  const [tempMax2, setTempMax2] = useState(0);
  const [tempMax3, setTempMax3] = useState(0);

  ///////////////////////

  const [tempMin1, setTempMin1] = useState(0);
  const [tempMin2, setTempMin2] = useState(0);
  const [tempMin3, setTempMin3] = useState(0);

  ///////////////////////

  const [humMax1, sethumMax1] = useState(0.0);
  const [humMax2, sethumMax2] = useState(0.0);
  const [humMax3, sethumMax3] = useState(0.0);

  ///////////////////////

  const [humMin1, setHumMin1] = useState(0.0);
  const [humMin2, setHumMin2] = useState(0.0);
  const [humMin3, setHumMin3] = useState(0.0);

  ///////////////////////

  const [hum_exhaust_fan_1, set_hum_exhaust_fan_1] = useState(false);
  const [hum_exhaust_fan_2, set_hum_exhaust_fan_2] = useState(false);
  const [hum_fogger, set_hum_fogger] = useState(false);
  const [hum_pump_pad_off, set_hum_pump_pad_off] = useState(false);
  const [hum_roof_hatch, set_hum_roof_hatch] = useState(false);

  ///////////////////////

  const [temp_exhaust_fan_1, set_temp_exhaust_fan_1] = useState(false);
  const [temp_exhaust_fan_2, set_temp_exhaust_fan_2] = useState(false);
  const [temp_exhaust_fan_3, set_temp_exhaust_fan_3] = useState(false);
  const [temp_circulating_fan_1, set_temp_circulating_fan_1] = useState(false);
  const [temp_circulating_fan_2, set_temp_circulating_fan_2] = useState(false);
  const [temp_pump_pad, set_temp_pump_pad] = useState(false);
  const [temp_heater_1, set_temp_heater_1] = useState(false);
  const [temp_heater_2, set_temp_heater_2] = useState(false);
  const [temp_roof_hatch, set_temp_roof_hatch] = useState(false);

  ///////////////////////

  const [humidityObject, setHumidityObject] = useState({
    1: { minimum: humMin1, maximum: humMax1 },
    2: { minimum: humMin2, maximum: humMax2 },
    3: { minimum: humMin3, maximum: humMax3 },
  });

  ///////////////////////

  const [tempObject, setTempObject] = useState({
    1: { minimum: tempMin1, maximum: tempMax1 },
    2: { minimum: tempMin2, maximum: tempMax2 },
    3: { minimum: tempMin3, maximum: tempMax3 },
  });

  ///////////////////////

  useEffect(() => {
    setHumidityObject({
      1: { minimum: humMin1, maximum: humMax1 },
      2: { minimum: humMin2, maximum: humMax2 },
      3: { minimum: humMin3, maximum: humMax3 },
    });
    setTempObject({
      1: { minimum: tempMin1, maximum: tempMax1 },
      2: { minimum: tempMin2, maximum: tempMax2 },
      3: { minimum: tempMin3, maximum: tempMax3 },
    });
  }, [
    humMin1,
    humMin2,
    humMin3,
    humMax1,
    humMax2,
    humMax3,
    tempMax1,
    tempMax2,
    tempMax3,
    tempMin1,
    tempMin2,
    tempMin3,
  ]);

  const apiDomain = "http://192.168.100.51:8000";
  useEffect(() => {
    const fetchData = async () => {
      try {
        let api1 = `${apiDomain}/api/v1/climate/range-start-time/?zone=${zone}`;
        let api2 = `${apiDomain}/api/v1/climate/temperature-range/?zone=${zone}&part=${part}`;
        let api3 = `${apiDomain}/api/v1/climate/humidity-range/?zone=${zone}&part=${part}`;
        let api4 = `${apiDomain}/api/v1/climate/temperature-range-operator/?zone=${zone}&part=${part}`;
        let api5 = `${apiDomain}/api/v1/climate/humidity-range-operator/?zone=${zone}&part=${part}`;
        const response1 = await axios.get(api1);
        const response2 = await axios.get(api2);
        const response3 = await axios.get(api3);
        const response4 = await axios.get(api4);
        const response5 = await axios.get(api5);

        console.log(response1.data);
        ///////////////////////
        set_hum_exhaust_fan_1(response5.data.exhaust_fan_1);
        set_hum_exhaust_fan_2(response5.data.exhaust_fan_2);
        set_hum_fogger(response5.data.fogger);
        set_hum_pump_pad_off(response5.data.pump_pad_off);
        set_hum_roof_hatch(response5.data.roof_hatch);
        ///////////////////////
        set_temp_circulating_fan_1(response4.data.circulating_fan_1);
        set_temp_circulating_fan_2(response4.data.circulating_fan_2);
        set_temp_exhaust_fan_1(response4.data.exhaust_fan_1);
        set_temp_exhaust_fan_2(response4.data.exhaust_fan_2);
        set_temp_exhaust_fan_3(response4.data.exhaust_fan_3);
        set_temp_heater_1(response4.data.heater_1);
        set_temp_heater_2(response4.data.heater_2);
        set_temp_pump_pad(response4.data.pump_pad);
        set_temp_roof_hatch(response4.data.roof_hatch);
        ///////////////////////
        setRange1(response1.data[0]);
        setRange2(response1.data[1]);
        setRange3(response1.data[2]);
        ///////////////////////
        setTempMax1(response2.data["1"]["maximum"]);
        setTempMax2(response2.data["2"]["maximum"]);
        setTempMax3(response2.data["3"]["maximum"]);
        ///////////////////////
        setTempMin1(response2.data["1"]["minimum"]);
        setTempMin2(response2.data["2"]["minimum"]);
        setTempMin3(response2.data["3"]["minimum"]);
        ///////////////////////
        sethumMax1(response3.data["1"]["maximum"]);
        sethumMax2(response3.data["2"]["maximum"]);
        sethumMax3(response3.data["3"]["maximum"]);
        ///////////////////////
        setHumMin1(response3.data["1"]["minimum"]);
        setHumMin2(response3.data["2"]["minimum"]);
        setHumMin3(response3.data["3"]["minimum"]);
        // Set data in state
        // set;
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [part]);

  const handleSave = async () => {
    const formatKeysAsStrings = (obj) => {
      return {
        1: {
          minimum: parseFloat(obj[1].minimum).toFixed(1),
          maximum: parseFloat(obj[1].maximum).toFixed(1),
        },
        2: {
          minimum: parseFloat(obj[2].minimum).toFixed(1),
          maximum: parseFloat(obj[2].maximum).toFixed(1),
        },
        3: {
          minimum: parseFloat(obj[3].minimum).toFixed(1),
          maximum: parseFloat(obj[3].maximum).toFixed(1),
        },
      };
    };
    const humidityPayload = {
      humidity_range: formatKeysAsStrings(humidityObject),
      zone: zone,
      part: part,
    };
    const rangePayload = {
      range_start_time: [parseInt(range1), parseInt(range2), parseInt(range3)],
    };
    const temperaturePayload = {
      temperature_range: formatKeysAsStrings(tempObject),
      zone: zone,
      part: part,
    };

    console.log("Humidity Payload:", JSON.stringify(humidityPayload, null, 2)); // console.log(temperaturePayload);
    console.log(
      "Temperature Payload:",
      JSON.stringify(temperaturePayload, null, 2)
    );
    console.log("Range Start:", JSON.stringify(rangePayload, null, 2));
    try {
      // Post temperature data
      await axios.post(
        "http://192.168.100.51:8000/api/v1/climate/temperature-range/",
        temperaturePayload
      );

      // Post humidity data
      await axios.post(
        "http://192.168.100.51:8000/api/v1/climate/humidity-range/",
        humidityPayload
      );
      await axios.post(
        "http://192.168.100.51:8000/api/v1/climate/range-start-time/",
        rangePayload
      );
      console.log("Data successfully saved!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  return (
    <Container
      sx={{
        width: "820px",
        height: "750px",
        backgroundColor: "#EDECEC",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "450px",
          height: "131px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={21} color="#3A3A3A">
                بازه ۱
              </Typography>
            </Box>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              color="#000000"
              marginLeft={10}
            >
              {convert(range2)} - {convert(range1)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "69px",
              height: "37px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              alignContent: "center",
            }}
          >
            <input
              type="number"
              min={0}
              max={24}
              value={range1}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= 24) {
                  setRange1(e.target.value);
                } else if (e.target.value === "") {
                  // Allow clearing the input
                  setRange1("");
                }
              }}
              style={{
                width: "69px",
                height: "37px",
                textAlign: "center",
                border: "none",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                fontSize: "19px",
                color: "#000000",
                textAlign: "center",
                alignContent: "center",
                textDecoration: "none",
                MozAppearance: "textfield", // Firefox
                appearance: "textfield", // Standard
              }}
            />
          </Box>
          {/* <Box
            sx={{
              width: "72px",
              height: "37px",
              border: "0.5px solid #9F9F9F",
              borderRadius: "10px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
            }}
          ></Box> */}
        </Box>
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
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={21} color="#3A3A3A">
                بازه ۲
              </Typography>
            </Box>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              color="#000000"
              marginLeft={10}
            >
              {convert(range3)} - {convert(range2)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "69px",
              height: "37px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              alignContent: "center",
            }}
          >
            <input
              type="number"
              min={0}
              max={24}
              value={range2}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= 24) {
                  setRange2(e.target.value);
                } else if (e.target.value === "") {
                  // Allow clearing the input
                  setRange2("");
                }
              }}
              style={{
                width: "69px",
                height: "37px",
                textAlign: "center",
                border: "none",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                fontSize: "19px",
                color: "#000000",
                textAlign: "center",
                alignContent: "center",
                textDecoration: "none",
                MozAppearance: "textfield", // Firefox
                appearance: "textfield", // Standard
              }}
            />
          </Box>
          {/* <Box
            sx={{
              width: "72px",
              height: "37px",
              border: "0.5px solid #9F9F9F",
              borderRadius: "10px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
            }}
          ></Box> */}
        </Box>
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
              }}
            >
              <Typography fontFamily={"IRANSANS"} fontSize={21} color="#3A3A3A">
                بازه ۳
              </Typography>
            </Box>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              color="#000000"
              marginLeft={10}
            >
              {convert(range1)} - {convert(range3)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "69px",
              height: "37px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              alignContent: "center",
            }}
          >
            <input
              type="number"
              min={0}
              max={24}
              value={range3}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= 24) {
                  setRange3(e.target.value);
                } else if (e.target.value === "") {
                  // Allow clearing the input
                  setRange3("");
                }
              }}
              style={{
                width: "69px",
                height: "37px",
                textAlign: "center",
                border: "none",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                fontSize: "19px",
                color: "#000000",
                textAlign: "center",
                alignContent: "center",
                textDecoration: "none",
                MozAppearance: "textfield", // Firefox
                appearance: "textfield", // Standard
              }}
            />
          </Box>
          {/* <Box
            sx={{
              width: "72px",
              height: "37px",
              border: "0.5px solid #9F9F9F",
              borderRadius: "10px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
            }}
          ></Box> */}
        </Box>
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
            width: "327px",
            height: "46px",
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          {buttons.map((label, index) => (
            <Box
              key={index}
              className="button"
              sx={{
                // width: "76px",
                paddingX: "14px",
                marginRight: "14px",
                height: "46px",
                borderRadius: "10px 10px 0 0",
                backgroundColor: selected === label ? "#ffffff" : "#FFCB82",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onClick={() => {
                setSelected(label);
                setPart(index + 1);
                console.log(part);
              }}
            >
              <Typography
                fontSize={36}
                fontFamily={"IRANSANS"}
                color={"#111111"}
                textAlign={"center"}
                className="no-select"
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
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: "20px",
          }}
        >
          <Box
            sx={{
              width: "733px",
              height: "390px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: "356px",
                height: "390px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
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
                  width: "356px",
                  height: "390px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMax1}
                          onChange={(e) => setTempMax1(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMin1}
                          onChange={(e) => setTempMin1(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۱
                    </Typography>
                  </Box>
                </Box>
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMax2}
                          onChange={(e) => setTempMax2(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMin2}
                          onChange={(e) => setTempMin2(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۲
                    </Typography>
                  </Box>
                </Box>
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMax3}
                          onChange={(e) => setTempMax3(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={tempMin3}
                          onChange={(e) => setTempMin3(e.target.value)}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۳
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "320px",
                    height: "110px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_exhaust_fan_1 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          فن ۱
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_exhaust_fan_2 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          فن ۲
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_exhaust_fan_3 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          فن ۳
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_circulating_fan_1 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={10}
                        >
                          فن سیرکوله۱
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_circulating_fan_2 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={10}
                        >
                          فن سیرکوله۲
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_pump_pad ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          پمپ پد
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_heater_1 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          بخاری ۱
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_heater_2 ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          بخاری ۲
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
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
                          }}
                        >
                          <img
                            src={temp_roof_hatch ? assets.svg.done : ""}
                            alt=""
                          />
                        </Box>
                        <Typography
                          fontFamily={"IRANSANS"}
                          color="#9F9F9F"
                          fontSize={12}
                        >
                          دریچه
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                width: "356px",
                height: "390px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
                  width: "356px",
                  height: "390px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMax1}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              sethumMax1(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMin1}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              setHumMin1(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۱
                    </Typography>
                  </Box>
                </Box>
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMax2}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              sethumMax2(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMin2}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              setHumMin2(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۲
                    </Typography>
                  </Box>
                </Box>
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "199px",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
                      حداکثر
                    </Typography>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#9F9F9F"
                    >
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
                        borderRadius: "0 0 10px 10px",
                        display: "flex",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        border: "0.5px solid #9F9F9F",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMax3}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              sethumMax3(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "100px",
                          height: "27px",
                          border: "0.5px solid #9F9F9F",
                          textAlign: "center",
                          fontFamily: "IRANSANS",
                          fontSize: "16px",
                          color: "#000000",
                          alignContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={humMin3}
                          onChange={(e) => {
                            // Parse the value properly (allow empty string or valid numbers)
                            const value = e.target.value;
                            if (value === "" || !isNaN(value)) {
                              setHumMin3(value);
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            padding: "0",
                            fontFamily: "IRANSANS",
                            fontSize: "16px",
                            color: "#000000",
                            textAlign: "center",
                            alignContent: "center",
                            textDecoration: "none",
                            MozAppearance: "textfield", // Firefox
                            appearance: "textfield", // Standard
                          }}
                          // Hide number spinner in WebKit browsers (Chrome, Safari, Edge)
                          onWheel={(e) => e.target.blur()} // Prevents scrolling from changing valuetempMax1
                        />
                      </Box>
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={16}
                      color="#FFFFFF"
                      paddingRight={1}
                    >
                      بازه زمانی ۳
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "320px",
                    height: "110px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      width: "60px",
                      height: "85px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={hum_exhaust_fan_1 ? assets.svg.done : ""}
                        alt=""
                      />
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      color="#9F9F9F"
                      fontSize={14}
                    >
                      فن ۱
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "60px",
                      height: "85px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={hum_exhaust_fan_2 ? assets.svg.done : ""}
                        alt=""
                      />
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      color="#9F9F9F"
                      fontSize={14}
                    >
                      فن ۲
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "60px",
                      height: "85px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={hum_fogger ? assets.svg.done : ""} alt="" />
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      color="#9F9F9F"
                      fontSize={14}
                    >
                      مه پاش
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "60px",
                      height: "85px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={hum_pump_pad_off ? assets.svg.done : ""}
                        alt=""
                      />
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      color="#9F9F9F"
                      fontSize={14}
                    >
                      پمپ پد
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "60px",
                      height: "85px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid #9F9F9F",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={hum_roof_hatch ? assets.svg.done : ""} alt="" />
                    </Box>
                    <Typography
                      fontFamily={"IRANSANS"}
                      color="#9F9F9F"
                      fontSize={14}
                    >
                      دریچه
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            variant="text"
            color="#111111"
            sx={{
              width: "110px",
              height: "56px",
              backgroundColor: "#FFCB82",
              display: "flex",
              justifyContent: "space-around",
              borderRadius: "10px",
            }}
            onClick={handleSave} // Trigger on click
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            tabIndex={0} // Makes the button focusable
          >
            <img src={assets.svg.saveIcon} alt="save" />
            <Typography
              fontFamily={"IRANSANS"}
              color="#111111"
              fontSize={18}
              className="no-select"
            >
              ذخیره
            </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PayeshSetting;
