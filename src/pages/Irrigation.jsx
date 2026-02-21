import React, { useState, useEffect } from "react";
import IrrigationManyStorage from "../components/Irrigation/IrrigationManyStorage";
import IrrigationOneStorage from "../components/Irrigation/IrrigationOneStorage";
import { Container, CircularProgress } from "@mui/material";
import apiClient from "../api/apiClient";

const Irrigation = () => {
  const [loading, setLoading] = useState(true);
  const [singleTankId, setSingleTankId] = useState(null);

  useEffect(() => {
    const checkTankCount = async () => {
      try {
        const response = await apiClient.post("/log/irrigation/irrigation-tanks-status/");
        const data = Array.isArray(response) ? response : [];
        
        const uniqueTanks = new Set(data.map(log => log.log_data?.number));
        
        if (uniqueTanks.size === 1) {
          setSingleTankId([...uniqueTanks][0]);
        } else {
          setSingleTankId(null);
        }
      } catch (error) {
        console.error("Error checking tank count:", error);
        setSingleTankId(null);
      } finally {
        setLoading(false);
      }
    };

    checkTankCount();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container disableGutters sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {singleTankId ? (
         <IrrigationOneStorage storageNumber={singleTankId} /> 
      ) : (
        <IrrigationManyStorage />
      )}
    </Container>
  );
};

export default Irrigation;
