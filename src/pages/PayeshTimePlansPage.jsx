import React, { useState } from "react";
import PayeshManyTimePlans from "../components/payesh/PayeshManyTimePlans";
import PayeshOneTimePlan from "../components/payesh/PayeshOneTimePlan";
import { Container, Button, Box } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PayeshTimePlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCardClick = (id) => {
    setSelectedPlan(id);
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };

  return (
    <Container disableGutters sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {selectedPlan ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', maxWidth: '825px' }}>
             <Button 
                onClick={handleBack} 
                startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ fontFamily: 'IRANSANS', fontSize: '16px' }}
             >
               بازگشت به لیست
             </Button>
          </Box>
          <PayeshOneTimePlan fanNumber={selectedPlan} /> 
        </Box>
      ) : (
        <PayeshManyTimePlans onCardClick={handleCardClick} />
      )}
    </Container>
  );
};

export default PayeshTimePlansPage;