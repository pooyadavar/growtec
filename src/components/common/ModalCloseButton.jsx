import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export const modalCloseButtonSx = {
  color: "#fff",
  bgcolor: "#e57373",
  borderRadius: "4px",
  width: 26,
  height: 26,
  minWidth: 26,
  minHeight: 26,
  padding: "2px",
  flexShrink: 0,
  alignSelf: "center",
  display: "inline-flex",
  "&:hover": { bgcolor: "#ef5350" },
};

const ModalCloseButton = ({ onClick, sx }) => (
  <IconButton
    onClick={onClick}
    aria-label="بستن"
    sx={{ ...modalCloseButtonSx, ...sx }}
  >
    <CloseIcon sx={{ fontSize: "18px" }} />
  </IconButton>
);

export default ModalCloseButton;
