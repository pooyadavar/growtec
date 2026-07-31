import React from "react";
import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import svgVerticalEcMehvarAsset from "../../assets/svg/vertical-ec-mehvar.svg";
import svgVerticalPhMehvarAsset from "../../assets/svg/vertical-ph-mehvar.svg";
import svgNeshangarAsset from "../../assets/svg/neshangar.svg";
import { toPersianDigits } from "../../utils/persianDigits";

const AXIS_WIDTH = 166;
const AXIS_HEIGHT = 14;
const AXIS_SCALE = 1.05;
const INDICATOR_SCALE = 1.25;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatSensorValue = (value) => {
  if (value === null || value === undefined || value === "") return "۰";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return toPersianDigits(value);

  const formatted =
    Number.isInteger(numberValue) || numberValue >= 100
      ? String(Math.round(numberValue))
      : numberValue.toFixed(1);

  return toPersianDigits(formatted);
};

const getDesiredRange = (data, type) => {
  const program = data?.foodstuff_preparation_program || {};
  const ecPh = data?.ec_ph || {};
  const target = program[`target_${type}`] ?? ecPh[`target_${type}`];
  const acceptableError =
    program[`${type}_acceptable_error`] ?? ecPh[`${type}_acceptable_error`];

  const targetNumber = Number(target);
  const errorNumber = Number(acceptableError);

  if (Number.isNaN(targetNumber) || Number.isNaN(errorNumber)) return null;

  return {
    low: targetNumber - errorNumber,
    high: targetNumber + errorNumber,
  };
};

const isInDesiredRange = (value, desiredRange) => {
  if (!desiredRange) return false;

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return false;

  return numberValue >= desiredRange.low && numberValue <= desiredRange.high;
};

const getMarkerLeft = (value, min, max, desiredRange) => {
  if (isInDesiredRange(value, desiredRange)) return "50%";

  const numberValue = Number(value);
  const safeValue = Number.isNaN(numberValue)
    ? min
    : clamp(numberValue, min, max);
  const ratio = (safeValue - min) / (max - min);
  return `${ratio * 100}%`;
};

const HorizontalSensorGauge = ({
  label,
  value,
  min,
  max,
  axisSrc,
  desiredRange,
}) => (
  <Box
    className="status-bar-row"
    sx={{
      backgroundColor: "#ffff",
      width: "300px",
      height: "30px",
      border: "0.5px solid #9F9F9F",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      pr: "1rem",
    }}
  >
    <Typography fontFamily="IRANSANS" fontSize={13}>
      {label} : {formatSensorValue(value)}
    </Typography>

    <Box
      sx={{
        position: "relative",
        width: AXIS_WIDTH,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      <Box
        component="img"
        src={axisSrc}
        alt={`${label} axis`}
        sx={{
          width: AXIS_HEIGHT,
          height: AXIS_WIDTH,
          display: "block",
          transform: `rotate(-90deg) scale(${AXIS_SCALE})`,
          transformOrigin: "center",
        }}
      />
      <Box
        component="img"
        src={svgNeshangarAsset}
        alt={`${label} indicator`}
        sx={{
          position: "absolute",
          left: getMarkerLeft(value, min, max, desiredRange),
          top: "50%",
          width: 15,
          height: 7,
          transform: `translate(-50%, -50%) rotate(-90deg) scale(${INDICATOR_SCALE})`,
          transformOrigin: "center",
          transition: "left 0.25s ease",
        }}
      />
    </Box>
  </Box>
);

const StatusBar = ({ ecValue = 0, phValue = 0, mixTankData }) => {
  const ecDesiredRange = getDesiredRange(mixTankData, "ec");
  const phDesiredRange = getDesiredRange(mixTankData, "ph");

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "350px",
        height: "100px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        backgroundColor: "#ffff",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <HorizontalSensorGauge
        label="EC"
        value={ecValue}
        min={500}
        max={2000}
        axisSrc={svgVerticalEcMehvarAsset}
        desiredRange={ecDesiredRange}
      />
      <Box sx={{ height: 10 }} />
      <HorizontalSensorGauge
        label="pH"
        value={phValue}
        min={4}
        max={8}
        axisSrc={svgVerticalPhMehvarAsset}
        desiredRange={phDesiredRange}
      />
    </Container>
  );
};

export default StatusBar;
