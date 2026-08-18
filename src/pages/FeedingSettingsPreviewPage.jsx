import React from "react";
import { Box, Modal } from "@mui/material";
import FeedingSettingsPage from "./FeedingSettingsPage";
import ModalCloseButton from "../components/common/ModalCloseButton";

const mockSpecialParameters = {
  maximum_stock_injection_volume: 50000.0,
  maximum_acid_injection_volume: 50000.0,
  maximum_stock_injection_count: 5,
  maximum_acid_injection_count: 0,
  input_waters_maximum_working_duration: 0,
  minimum_stock_injection_volume_per_injection: 500.0,
  minimum_acid_injection_volume_per_injection: 0.5,
  input_water_ratio: 1.0,
  ec_tamcin: 30.0,
  ph_tamcin: 0.05,
  ec_correction_coefficient_over_1000: 0.8,
  ec_correction_coefficient_under_1000: 0.6,
  ec_change_per_ph_injection: -60.0,
};

const settingsModalFrameStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "96vw", md: "88vw" },
  maxWidth: "1280px",
  height: { xs: "88vh", md: "780px" },
  maxHeight: "92vh",
  p: 1.5,
  bgcolor: "#efeeee",
  borderRadius: "15px",
  boxShadow: "0 22px 60px rgba(0, 0, 0, 0.18)",
  border: "1px solid rgba(120, 140, 120, 0.22)",
  overflow: "hidden",
  outline: "none",
};

const FeedingSettingsPreviewPage = () => (
  <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#d8d8d8" }}>
    <Modal open aria-labelledby="feeding-settings-preview-title">
      <Box sx={settingsModalFrameStyle}>
        <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
          <ModalCloseButton onClick={() => {}} />
        </Box>
        <Box sx={{ width: "100%", height: "100%", overflow: "auto", pt: 1 }}>
          <FeedingSettingsPage
            isModal
            mockSpecialParameters={mockSpecialParameters}
          />
        </Box>
      </Box>
    </Modal>
  </Box>
);

export default FeedingSettingsPreviewPage;
