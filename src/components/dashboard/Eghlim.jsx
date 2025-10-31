import React from "react";
import EghlimCard from "../../card/EghlimCard";
import { Container, Box, Grid } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";

const StyledGridItem = styled(Grid)({
  transition: "transform 0.3s ease",
});

const Eghlim = () => {
  // const apiDomain = "http://192.168.3.47:8000";

  // const [temp, setTemp] = React.useState(0);
  // const [hum, setHum] = React.useState(0);
  // const [error, setError] = React.useState(null);
  // const [loading, setLoading] = React.useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let zoneData = []; // Temporary array to collect API data

  //       for (let i = 1; i <= 5; i++) {
  //         const api = `${apiDomain}/api/v1/info/inside-climent/?zone=${i}`;
  //         const response = await axios.get(api);
  //         zoneData.push(response.data); // Collect data in local array
  //       }

  //       setZones(zoneData);
  //     } catch (err) {
  //       setError(err.message || "Something went wrong"); // Set error message
  //     } finally {
  //       setLoading(false); // Ensure loading is set to false
  //     }
  //   };
  //   // Call the API immediately when the component mounts
  //   fetchData();
  // }, [apiDomain]);

  const sampleZones = [
    // زون ۱: گرم و خشک، سیستم خنک‌کننده روشن
    {
      temperature: 28.5,
      humidity: 35.2,
      exhaust_fan: true,
      circulating_fan: true,
      pump_pad: true,
      shade_open: true,
      heater: false,
      roof_hatch_opening: true,
      fogger: true,
    },
    // زون ۲: سرد، سیستم گرمایشی روشن
    {
      temperature: 19.8,
      humidity: 50.0,
      exhaust_fan: false,
      circulating_fan: true,
      pump_pad: false,
      shade_open: false,
      heater: true,
      roof_hatch_opening: false,
      fogger: false,
    },
    // زون ۳: متعادل
    {
      temperature: 24.1,
      humidity: 42.7,
      exhaust_fan: false,
      circulating_fan: true,
      pump_pad: false,
      shade_open: false,
      heater: false,
      roof_hatch_opening: true,
      fogger: false,
    },
    // زون ۴: نمونه دیگر
    {
      temperature: 22.0,
      humidity: 60.5,
      exhaust_fan: true,
      circulating_fan: false,
      pump_pad: true,
      shade_open: false,
      heater: false,
      roof_hatch_opening: true,
      fogger: true,
    },
  ];

  const [zones, setZones] = useState(sampleZones);
  return (
    <Container
      className="eghlim"
      sx={{
        width: "730px",
        height: "210px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        backgroundColor: "#ffffff",
        display: "flex",
        overflow: "scroll",
        direction: "ltr",
        scrollBehavior: "smooth",
        overflowY: "hidden",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        mx={"auto"}
        width={"100%"}
      >
        <Grid
          container
          width={"90vw"}
          gap={1}
          display={"flex"}
          flexWrap={"nowrap"}
        >
          {zones.map((card, index) => (
            <StyledGridItem item key={index}>
              <EghlimCard
                zone={index + 1}
                temp={card.temperature.toFixed(1)}
                hum={card.humidity.toFixed(1)}
                fan1={card.exhaust_fan}
                fan2={card.circulating_fan}
                pad={card.pump_pad}
                parde={card.shade_open}
                bokhari={card.heater}
                dariche={card.roof_hatch_opening}
                mehpash={card.fogger}
              />
            </StyledGridItem>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
export default Eghlim;
