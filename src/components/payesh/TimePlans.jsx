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
import svgNextBtnAsset from "../../assets/svg/nextBTN.svg";
import svgPrevBtnAsset from "../../assets/svg/prevBTN.svg";
import axios from "axios";
import { AgCharts } from "ag-charts-react";
import TimePlansCards from "../../card/TimePlansCards";

const TimePlans = () => {
  return (
    <Container
      sx={{
        width: "1004px",
        height: "564px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      <Box>
        <img src={svgNextBtnAsset} alt="" className="button" />
      </Box>
      <Box
        sx={{
          width: "901px",
          height: "564px",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TimePlansCards fan={1} float1={true} float2={true} float3={false} />
        <TimePlansCards fan={2} float1={true} float2={false} float3={false} />
        <TimePlansCards fan={3} float1={false} float2={false} float3={false} />
      </Box>
      <Box>
        <img src={svgPrevBtnAsset} alt="" className="button" />
      </Box>
    </Container>
  );
};

export default TimePlans;
