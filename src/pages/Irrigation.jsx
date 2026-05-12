import React, { useState, useEffect } from "react";
import IrrigationManyStorage from "../components/Irrigation/IrrigationManyStorage";
import IrrigationOneStorage from "../components/Irrigation/IrrigationOneStorage";
import { Container, CircularProgress, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getIrrigationTanksStatusLogs } from "../api/irrigationApi";

const Irrigation = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["irrigationTanksStatusLogs"],
    queryFn: getIrrigationTanksStatusLogs,
    staleTime: 60 * 1000, // Data considered fresh for 1 minute
    cacheTime: 5 * 60 * 1000, // Data stays in cache for 5 minutes
    select: (response) => {
      return Array.isArray(response) ? response : [];
    },
  });

  const [singleTankId, setSingleTankId] = useState(null);

  useEffect(() => {
    if (data) {
      const uniqueTanks = new Set(data.map((log) => log.log_data?.number));
      if (uniqueTanks.size === 1) {
        setSingleTankId([...uniqueTanks][0]);
      } else {
        setSingleTankId(null);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Alert severity="error">خطا در بارگیری وضعیت مخازن: {error.message}</Alert>
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
