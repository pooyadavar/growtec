import React, { useState } from "react";
import PayeshManyTimePlans from "../components/payesh/PayeshManyTimePlans";
import PayeshOneTimePlan from "../components/payesh/PayeshOneTimePlan";
import { Container, Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const PayeshTimePlansPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCardClick = (id) => {
    setSelectedPlan(id);
  };

  const handleBack = () => {
    if (selectedPlan) {
      setSelectedPlan(null);
      return;
    }
    navigate("/payesh");
  };

  return (
    <Container
      disableGutters
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          maxWidth: "970px",
          mb: 2,
          px: 1,
        }}
      >
        <Button
          onClick={handleBack}
          endIcon={
            <ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />
          }
          sx={{ fontFamily: "IRANSANS", fontSize: "16px" , gap: 2 }}
        >
          {selectedPlan ? "بازگشت به لیست" : "بازگشت به اقلیم"}
        </Button>
      </Box>

      {selectedPlan ? (
        <PayeshOneTimePlan fanNumber={selectedPlan} />
      ) : (
        <PayeshManyTimePlans onCardClick={handleCardClick} />
      )}
    </Container>
  );
};

export default PayeshTimePlansPage;
