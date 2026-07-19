import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Calculator from "../components/tools/Calculator";
import ModalCloseButton from "../components/common/ModalCloseButton";

const calculatorModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  bgcolor: "#F0F0F0",
  border: "0.5px solid #000",
  boxShadow: 24,
  p: 2,
  borderRadius: "15px",
  display: "block",
  overflow: "hidden",
  fontFamily: "IRANSANS",
};

const CalculatorPreviewPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate("/Home");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="irrigation-calculator-preview"
      disableScrollLock
    >
      <Box sx={calculatorModalStyle} onClick={(e) => e.stopPropagation()}>
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
          <ModalCloseButton onClick={handleClose} />
        </Box>
        <Calculator onClose={handleClose} operatorsCount={10} />
      </Box>
    </Modal>
  );
};

export default CalculatorPreviewPage;
