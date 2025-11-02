import React from "react";
import EghlimCard from "../../card/EghlimCard";
import {
  Container,
  Box,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import styled from "styled-components";

import { useQueries } from "@tanstack/react-query";
import { getInsideCliment } from "../../api/dashboardApi"; // (مسیر را چک کنید)

const StyledGridItem = styled(Grid)({
  transition: "transform 0.3s ease",
});

const containerStyles = {
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
};

const Eghlim = () => {
  const zoneIds = [1, 2, 3, 4, 5];

  const zoneQueryResults = useQueries({
    queries: zoneIds.map((id) => {
      return {
        queryKey: ["eghlim", id],
        queryFn: () => getInsideCliment(id), 
        // refetchInterval: 10000, 
      };
    }),
  });

  const isLoading = zoneQueryResults.some((query) => query.isLoading);
  const isError = zoneQueryResults.some((query) => query.isError);
  const firstError = zoneQueryResults.find((query) => query.isError)?.error;

  const zones = zoneQueryResults.map((query) => query.data).filter(Boolean); 

  if (isLoading) {
    return (
      <Container
        className="eghlim"
        sx={{
          ...containerStyles,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        className="eghlim"
        sx={{
          ...containerStyles,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Typography fontFamily={"IRANSANS"} color="error">
          خطا: {firstError?.message || "خطا در دریافت اطلاعات اقلیم"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      className="eghlim"
      sx={{
        ...containerStyles,
        display: "flex",
        overflow: "scroll",
        direction: "ltr",
        scrollBehavior: "smooth",
        overflow: "scroll",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mx="auto"
        width="100%"
      >
        <Grid container width="90vw" gap={1} display="flex" flexWrap="nowrap">
          {zones.map((card, index) => (
            <StyledGridItem item key={index}>
              <EghlimCard
                zone={index + 1}
                temp={card.temperature?.toFixed(1) || 0}
                hum={card.humidity?.toFixed(1) || 0}
                fan1={card.exhaust_fan || false}
                fan2={card.circulating_fan || false}
                pad={card.pump_pad || false}
                parde={card.shade_open || false}
                bokhari={card.heater || false}
                dariche={card.roof_hatch_opening || false}
                mehpash={card.fogger || false}
              />
            </StyledGridItem>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Eghlim;
