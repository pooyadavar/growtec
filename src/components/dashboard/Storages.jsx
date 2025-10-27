import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Modal,
  Button,
  Fade,
  Backdrop,
} from "@mui/material";
import StorageCard from "../../card/StorageCard";
import styled from "styled-components";

const StyledGridItem = styled(Grid)({
  transition: "transform 0.3s ease",
});

const Storages = () => {
  // const apiDomain = "http://192.168.3.47:8000";
  // const [storageObj, setStorageObj] = React.useState(null);
  // const [storagesArr, setStorageArr] = React.useState([]);
  // const [error, setError] = React.useState(null);
  // const [loading, setLoading] = React.useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Replace with your API endpoints
  //       const api = `${apiDomain}/api/v1/info/irrigation-tanks-status/`;
  //       const response = await axios.get(api);
  //       setStorageArr(Object.values(response.data));
  //     } catch (err) {
  //       setError(err.message || "Something went wrong"); // Set error message
  //       console.error("Error fetching data:", err); // Log the error for debugging
  //     } finally {
  //       setLoading(false); // Ensure loading is set to false
  //     }
  //   };
  //   fetchData();
  // }, [apiDomain]); // Add apiDomain as a dependency if it can change

  const storagesArr = [
    {
      filled_value: 50,
      buttom_float_switch: true,
      middle_float_switch: false,
      top_float_switch: true,
    },
    {
      filled_value: 70,
      buttom_float_switch: true,
      middle_float_switch: true,
      top_float_switch: true,
    },
    {
      filled_value: 20,
      buttom_float_switch: false,
      middle_float_switch: true,
      top_float_switch: true,
    },
  ];

  function useScrollBar(l) {
    if (l > 3) {
      return true;
    } else {
      return false;
    }
  }
  // let use = useScrollBar(boxes.length);
  return (
    <Container
      className="storage"
      sx={{
        width: "340px",
        height: "184px",
        backgroundColor: "#ffffff",
        display: "flex",
        direction: "ltr",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        borderRadius: "10px",
        scrollBehavior: "smooth",
        overflow: "scroll",
      }}
    >
      <Box
        mt={"0.5rem"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        mx={"auto"}
      >
        <Grid container width={"60vw"} gap={2}>
          {storagesArr.map((card, index) => (
            <StyledGridItem key={index} item>
              <StorageCard
                capacity={card.filled_value}
                zone={index + 1}
                float1={card.buttom_float_switch}
                float2={card.middle_float_switch}
                float3={card.top_float_switch}
              />
            </StyledGridItem>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Storages;
