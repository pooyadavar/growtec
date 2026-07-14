import React, { useMemo, useState } from "react";
import { Box, IconButton, Popover } from "@mui/material";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";
import clockIconOrange from "../../assets/svg/clockicon.svg";

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

const twoDigitOptions = (count) =>
  Array.from({ length: count }, (_, index) => String(index).padStart(2, "0"));

const clampTimePart = (value, max) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return "00";
  return String(Math.min(Math.max(numberValue, 0), max)).padStart(2, "0");
};

const getTimeParts = (value, withSeconds) => {
  const [hour = "00", minute = "00", second = "00"] = normalizeTimeValue(
    value,
    withSeconds
  ).split(":");

  return {
    hour: clampTimePart(hour, 23),
    minute: clampTimePart(minute, 59),
    second: clampTimePart(second, 59),
  };
};

const TimePartDropdown = ({
  part,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}) => {
  return (
    <Box sx={{ position: "relative", width: 58 }}>
      <Box
        component="button"
        type="button"
        onClick={() => onToggle(part)}
        sx={{
          width: "100%",
          height: 34,
          border: "1px solid #c4c4c4",
          borderRadius: "4px",
          backgroundColor: "#fff",
          color: "#1e1e1e",
          fontFamily: "IRANSANS",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          p: 0,
        }}
      >
        <Box component="span">{value}</Box>
        <Box
          component="span"
          sx={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "5px solid #555",
          }}
        />
      </Box>
      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            maxHeight: 180,
            overflowY: "auto",
            bgcolor: "#fff",
            border: "1px solid #c4c4c4",
            borderRadius: "4px",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.16)",
            zIndex: 1,
          }}
        >
          {options.map((option) => (
            <Box
              component="button"
              type="button"
              key={option}
              onClick={() => onChange(part, option)}
              sx={{
                width: "100%",
                height: 30,
                border: 0,
                borderBottom: "1px solid #eee",
                bgcolor: option === value ? "#f5f5f5" : "#fff",
                color: "#1e1e1e",
                fontFamily: "IRANSANS",
                fontSize: 14,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#f7f7f7",
                },
              }}
            >
              {option}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPart, setOpenPart] = useState("hour");
  const withSeconds = step !== undefined;
  const pickerValue = normalizeTimeValue(value, withSeconds);
  const displayValue = toPersianDigits(pickerValue);
  const timeParts = getTimeParts(value, withSeconds);
  const hourOptions = useMemo(() => twoDigitOptions(24), []);
  const minuteOptions = useMemo(() => twoDigitOptions(60), []);
  const secondOptions = minuteOptions;

  const handleTextChange = (e) => {
    onChange(toEnglishDigits(e.target.value));
  };

  const handlePartChange = (part, selectedValue) => {
    const nextParts = {
      ...timeParts,
      [part]: selectedValue,
    };
    const nextValue = `${nextParts.hour}:${nextParts.minute}${
      withSeconds ? `:${nextParts.second}` : ""
    }`;

    onChange(nextValue);
    setOpenPart(null);
  };

  const openPicker = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenPart("hour");
  };

  const closePicker = () => {
    setAnchorEl(null);
    setOpenPart("hour");
  };
  const isPickerOpen = Boolean(anchorEl);

  const toggleOpenPart = (part) => {
    setOpenPart((current) => (current === part ? null : part));
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
      {showIcon && (
        <IconButton
          size="small"
          onClick={openPicker}
          sx={{ p: 0.25, flexShrink: 0 }}
          tabIndex={-1}
        >
          <img
            src={clockIconOrange}
            alt=""
            width={iconSize}
            height={iconSize}
            draggable={false}
          />
        </IconButton>
      )}
      <Popover
        open={isPickerOpen}
        anchorEl={anchorEl}
        onClose={closePicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              p: 1,
              borderRadius: "8px",
              direction: "ltr",
              overflow: "visible",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
          <TimePartDropdown
            part="hour"
            value={timeParts.hour}
            options={hourOptions}
            isOpen={openPart === "hour"}
            onToggle={toggleOpenPart}
            onChange={handlePartChange}
          />
          <Box component="span" sx={{ fontWeight: 700, pt: "7px" }}>
            :
          </Box>
          <TimePartDropdown
            part="minute"
            value={timeParts.minute}
            options={minuteOptions}
            isOpen={openPart === "minute"}
            onToggle={toggleOpenPart}
            onChange={handlePartChange}
          />
          {withSeconds && (
            <>
              <Box component="span" sx={{ fontWeight: 700, pt: "7px" }}>
                :
              </Box>
              <TimePartDropdown
                part="second"
                value={timeParts.second}
                options={secondOptions}
                isOpen={openPart === "second"}
                onToggle={toggleOpenPart}
                onChange={handlePartChange}
              />
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default TimeInput;
