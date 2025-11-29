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

import { useQuery } from "@tanstack/react-query"; // تغییر به useQuery
import { getInsideCliment } from "../../api/dashboardApi";

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
  // یک درخواست واحد برای دریافت کل اطلاعات
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["insideClimentAll"], // کلید کوئری را تغییر دادیم
    queryFn: getInsideCliment,

    // refetchInterval: 10000, // اگر نیاز به آپدیت خودکار دارید آنکامنت کنید
  });

  // تبدیل فرمت دیتای دریافتی به آرایه برای نمایش در کارت‌ها
  // ریسپانس شامل کلیدهای "1", "2", "3", "4", "5" است.
  const zones = React.useMemo(() => {
    if (!data) return [];

    const zoneList = [];
    const zoneIds = [1, 2, 3, 4, 5]; // تعداد زون‌های مورد نظر

    zoneIds.forEach((id) => {
      // دسترسی به کلید استرینگ در آبجکت ریسپانس (مثلا data["1"])
      const zoneData = data[String(id)];
      if (zoneData) {
        zoneList.push(zoneData);
      }
    });
    return zoneList;
  }, [data]);

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
          خطا: {error?.message || "خطا در دریافت اطلاعات اقلیم"}
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
        overflowX: "scroll",
        overflowY: "hidden",
        direction: "ltr",
        scrollBehavior: "smooth",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mx="auto"
        width="100%"
      >
        <Grid
          container
          width="100%"
          gap={1}
          display="flex"
          flexWrap="nowrap"
          overflowX="auto"
          flexDirection="row"
        >
          {zones.map((card, index) => (
            <StyledGridItem
              item
              key={index}
              sx={{
                flexShrink: 0,
                width: "auto",
                "&:hover": {
                  transform: "scale(1.05)", // Optional hover effect
                },
              }}
            >
              <EghlimCard
                zone={index + 1}
                // نگاشت فیلدهای جدید طبق JSON ارسالی شما:
                temp={card.temperature?.toFixed(1) || 0}
                hum={card.humidity?.toFixed(1) || 0}
                // طبق JSON: "exhaust_fan"
                fan1={card.exhaust_fan || false}
                // طبق JSON: "circule_fan" (توجه: در قبلی circulating_fan بود، اینجا circule_fan است)
                fan2={card.circule_fan || false}
                // طبق JSON: "pump_pad"
                pad={card.pump_pad || false}
                // طبق JSON: "shade_opening" (قبلی shade_open بود)
                parde={card.shade_opening || false}
                // طبق JSON: "heater"
                bokhari={card.heater || false}
                // طبق JSON: "hatch_opening" (قبلی roof_hatch_opening بود)
                dariche={card.hatch_opening || false}
                // طبق JSON: "fogger"
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
