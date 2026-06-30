import React from "react";
import { IconButton } from "@mui/material";
import assets from "../../assets";

const NavArrowButton = ({ direction = "next", ...props }) => (
  <IconButton {...props}>
    <img
      src={direction === "next" ? assets.svg.nextBtn : assets.svg.prevBtn}
      alt=""
      style={{ width: 20, height: 20, display: "block" }}
    />
  </IconButton>
);

export default NavArrowButton;
