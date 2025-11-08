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
import IrrigationCard from "../../card/IrrigationCard";

const IrrigationManyStorage = () => {
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
        <img src={assets.svg.nextBtn} alt="" className="button" />
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
        <IrrigationCard IrrigationCard={1} storageCapacity float1={true} float2={true} float3={false} />
        <IrrigationCard IrrigationCard={2} storageCapacity float1={true} float2={false} float3={false} />
        <IrrigationCard IrrigationCard={3} storageCapacity float1={false} float2={false} float3={false} />
      </Box>
      <Box>
        <img src={assets.svg.prevBtn} alt="" className="button" />
      </Box>
    </Container>
  );
};

export default IrrigationManyStorage;
