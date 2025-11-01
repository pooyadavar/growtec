import * as React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import StorageCard from "../../card/StorageCard";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getIrrigationTanksStatus } from "../../api/dashboardApi"; // (مسیر را چک کنید)

const StyledGridItem = styled(Grid)({
  transition: "transform 0.3s ease",
});

const Storages = () => {
  const {
    data: storagesList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["irrigationTanks"],
    queryFn: getIrrigationTanksStatus,

    // تبدیل آبجکت پاسخ به آرایه
    // ریسپانس جدید شما شامل `contents` کامل است
    select: (data) => {
      if (!data || typeof data !== "object") return [];
      return Object.entries(data).map(([key, value]) => ({
        id: key, // "1", "2", "3"
        ...value.contents, // { filled_value, ec, ph, ... }
      }));
    },
  });

  // مدیریت وضعیت Loading
  if (isLoading) {
    return (
      <Container
        className="storage"
        sx={{
          width: "340px",
          height: "184px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontFamily={"IRANSANS"}>
          در حال بارگذاری مخازن...
        </Typography>
      </Container>
    );
  }

  // مدیریت وضعیت Error
  if (isError) {
    return (
      <Container
        className="storage"
        sx={{
          width: "340px",
          height: "184px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontFamily={"IRANSANS"} color="error">
          خطا: {error.message}
        </Typography>
      </Container>
    );
  }

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
          {/* --- رندر کردن لیست با props کامل --- */}
          {storagesList.map((card) => (
            <StyledGridItem key={card.id} item>
              <StorageCard
                maxCapacity={card.max_volume}
                zone={card.id}
                capacity={card.filled_volume}
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
