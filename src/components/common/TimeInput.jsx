import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import assets from "../../assets";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";

const normalizeTimeValue = (value, withSeconds = false) => {
  let en = toEnglishDigits(String(value ?? ""));
  if (!en) return withSeconds ? "00:00:00" : "00:00";

  if (en.includes("T")) {
    en = en.split("T")[1] || "";
  }

  if (withSeconds) {
    if (en.length === 5) return `${en}:00`;
    return en.substring(0, 8) || "00:00:00";
  }

  return en.substring(0, 5) || "00:00";
};

const TimeInput = ({
  value,
  onChange,
  step,
  style = {},
  wrapperSx = {},
  inputStyle = {},
  showIcon = true,
  iconSize = 16,
}) => {
  const pickerRef = useRef(null);
  const withSeconds = step !== undefined;
  const pickerValue = normalizeTimeValue(value, withSeconds);
  const displayValue = toPersianDigits(pickerValue);

  const handleTextChange = (e) => {
    onChange(toEnglishDigits(e.target.value));
  };

  const handlePickerChange = (e) => {
    onChange(e.target.value);
  };

  const openPicker = () => {
    try {
      pickerRef.current?.showPicker?.();
    } catch {
      pickerRef.current?.click?.();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        ...wrapperSx,
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleTextChange}
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          minWidth: 0,
          height: "100%",
          textAlign: "center",
          fontFamily: "IRANSANS",
          userSelect: "text",
          WebkitUserSelect: "text",
          ...style,
          ...inputStyle,
        }}
      />
      <input
        ref={pickerRef}
        type="time"
        step={step}
        value={pickerValue}
        onChange={handlePickerChange}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      />
      {showIcon && (
        <IconButton
          size="small"
          onClick={openPicker}
          sx={{ p: 0.25, flexShrink: 0 }}
          tabIndex={-1}
        >
          <img
            src={assets.svg.clockiconorange}
            alt=""
            width={iconSize}
            height={iconSize}
            draggable={false}
          />
        </IconButton>
      )}
    </Box>
  );
};

export default TimeInput;
