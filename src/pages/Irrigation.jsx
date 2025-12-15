import React, { useState } from "react";
import IrrigationManyStorage from "../components/Irrigation/IrrigationManyStorage";
import IrrigationOneStorage from "../components/Irrigation/IrrigationOneStorage";
import { Container, Button, Box } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Irrigation = () => {
  const [selectedStorage, setSelectedStorage] = useState(null);

  const handleStorageClick = (id) => {
    setSelectedStorage(id);
  };

  const handleBack = () => {
    setSelectedStorage(null);
  };

  return (
    <Container disableGutters sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {selectedStorage ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', maxWidth: '825px' }}>
             <Button 
                onClick={handleBack} 
                startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ fontFamily: 'IRANSANS', fontSize: '16px' }}
             >
               بازگشت به لیست مخازن
             </Button>
          </Box>
          <IrrigationOneStorage storageNumber={selectedStorage} storageCapacity={321} /> 
        </Box>
      ) : (
        <IrrigationManyStorage onStorageClick={handleStorageClick} />
      )}
    </Container>
  );
};

export default Irrigation;
