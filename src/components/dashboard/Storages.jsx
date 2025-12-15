import * as React from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import StorageCard from "../../card/StorageCard";
import styled from "styled-components";

const StyledGridItem = styled(Grid)({
  transition: "transform 0.3s ease",
});

const Storages = ({ storagesList = [] }) => {
  if (!storagesList || storagesList.length === 0) {
    return (
      <Container
        className="storage"
        sx={{
          width: "340px",
          height: "184px",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
          borderRadius: "10px",
        }}
      >
        <Typography fontFamily={"IRANSANS"} fontSize={12} color="textSecondary">
          مخزنی یافت نشد
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
