import React from "react";
import { Box, Typography } from "@mui/material";
import assets from "../assets";
import { toPersianDigits } from "../utils/persianDigits";

const StorageStatus = ({ start, end, size, status }) => {
  return (
    <Box
      sx={{
        width: "330px",
        height: "24px",
        display: "flex",
        justifyContent: "space-between",
        mt: "0.5rem",
        mr: "12px",
      }}
    >
      <div
        style={{
          width: "86px",
          height: "24px",
          backgroundColor: "#D2D2D2",
          border: "0.5px solid #9F9F9F",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <Typography>{toPersianDigits(start)}</Typography>
      </div>
      <div
        style={{
          width: "86px",
          height: "24px",
          backgroundColor: "#D2D2D2",
          border: "0.5px solid #9F9F9F",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <Typography>{toPersianDigits(end)}</Typography>
      </div>
      <div
        style={{
          width: "86px",
          height: "24px",
          backgroundColor: "#D2D2D2",
          border: "0.5px solid #9F9F9F",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <Typography style={{ direction: "ltr" }} fontFamily={"IRANSANS"}>
          {toPersianDigits(size)} L
        </Typography>
      </div>
      <div
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#D2D2D2",
          border: "0.5px solid #9F9F9F",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={status == "done" ? assets.svg.done : assets.svg.unDone}
          alt={status}
        />
      </div>
    </Box>
  );
};
export default StorageStatus;
