import React from "react";
import EghlimCard from "../../card/EghlimCard";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import styled from "styled-components";

import { useQueries, useQuery } from "@tanstack/react-query";
import { getInsideCliment } from "../../api/dashboardApi";
import { getHumidityPart, getTemperaturePart } from "../../api/climateApi";
import { queryKeys } from "../../api/queryKeys";

const StyledScrollItem = styled(Box)({
  transition: "transform 0.3s ease",
  flexShrink: 0,
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
});

const Eghlim = () => {
  const scrollContainerRef = React.useRef(null);

  const isDown = React.useRef(false);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftState = React.useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftState.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }

    scrollContainerRef.current.scrollLeft = scrollLeftState.current - walk;
  };

  const handleTouchStart = (e) => {
    isDragging.current = false;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX;
    if (Math.abs(x - startX.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const { data, isLoading, isError, isRefetchError, error } = useQuery({
    queryKey: ["insideClimentAll"],
    queryFn: getInsideCliment,
    refetchInterval: 5000,
  });

  const fetchFailed = (isError || isRefetchError) && !data;
  const initialLoading = isLoading && !data;

  const zones = React.useMemo(() => {
    if (!data) return [];
    const zoneList = [];
    const zoneIds = [1, 2, 3, 4, 5];

    zoneIds.forEach((id) => {
      const zoneData = data[String(id)];
      if (zoneData) {
        zoneList.push({ ...zoneData, zoneId: id });
      }
    });
    return zoneList;
  }, [data]);

  const temperaturePartQueries = useQueries({
    queries: zones.map((card) => ({
      queryKey: queryKeys.payesh.temperaturePart(card.zoneId),
      queryFn: () => getTemperaturePart(card.zoneId),
      enabled: Boolean(card.zoneId),
      staleTime: 20_000,
      gcTime: 5 * 60_000,
      refetchInterval: 30_000,
    })),
  });

  const humidityPartQueries = useQueries({
    queries: zones.map((card) => ({
      queryKey: queryKeys.payesh.humidityPart(card.zoneId),
      queryFn: () => getHumidityPart(card.zoneId),
      enabled: Boolean(card.zoneId),
      staleTime: 20_000,
      gcTime: 5 * 60_000,
      refetchInterval: 30_000,
    })),
  });

  const baseStyles = {
    width: "730px",
    height: "210px",
    borderRadius: "10px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  if (initialLoading) {
    return (
      <Container className="eghlim" sx={baseStyles}>
        <CircularProgress />
      </Container>
    );
  }

  if (fetchFailed) {
    return (
      <Container className="eghlim" sx={baseStyles}>
        <Typography fontFamily={"IRANSANS"} color="error">
          خطا: {error?.message || "خطا در دریافت اطلاعات اقلیم"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      ref={scrollContainerRef}
      className="eghlim"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={(e) => e.preventDefault()}
      sx={{
        width: "730px",
        height: "210px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        direction: "ltr",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        borderRadius: "10px",
        p: "0 12px 14px 12px !important",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },

        overflowX: "auto",
        scrollPaddingLeft: "12px",
        userSelect: "none",
        touchAction: "pan-x",
        WebkitOverflowScrolling: "touch",

        "&::-webkit-scrollbar": {
          display: "block",
          height: "25px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#EBEBEB",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#6a6a6a",
          borderRadius: "8px",
          border: "4px solid #EBEBEB",
          "&:hover": {
            background: "#444444",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "max-content",
          pointerEvents: "none",
        }}
      >
        {zones.map((card, index) => (
          <StyledScrollItem key={index}>
            <EghlimCard
              zone={card.zoneId}
              temp={card.temperature?.toFixed(1) || 0}
              hum={card.humidity?.toFixed(1) || 0}
              temperatureRange={temperaturePartQueries[index]?.data}
              humidityRange={humidityPartQueries[index]?.data}
              fan1={card.exhaust_fan || false}
              fan2={card.circule_fan || false}
              pad={card.pump_pad || false}
              parde={card.shade_opening || false}
              bokhari={card.heater || false}
              dariche={card.hatch_opening || false}
              mehpash={card.fogger || false}
              isAuto={card.is_auto || false}
            />
          </StyledScrollItem>
        ))}
      </Box>
    </Container>
  );
};

export default Eghlim;
