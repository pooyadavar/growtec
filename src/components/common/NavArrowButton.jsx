import React from "react";
import { IconButton } from "@mui/material";
import svgNextBtnAsset from "../../assets/svg/nextBTN.svg";
import svgPrevBtnAsset from "../../assets/svg/prevBTN.svg";
const NavArrowButton = ({ direction = "next", ...props }) => (
  <IconButton {...props}>
    <img
      src={direction === "next" ? svgNextBtnAsset : svgPrevBtnAsset}
      alt=""
      style={{ width: 20, height: 20, display: "block" }}
    />
  </IconButton>
);

export default NavArrowButton;
