import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import wifiOffIcon from "../../assets/svg/wifi-off.svg";
import {
  getNetworkStatus,
  subscribeNetworkStatus,
} from "../../lib/networkStatus";
import { toPersianDigits } from "../../utils/persianDigits";

const formatClock = (date) =>
  toPersianDigits(
    [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
  );

const formatPersianDate = (date) =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const NetworkStatusBar = () => {
  const [now, setNow] = useState(() => new Date());
  const [networkStatus, setNetworkStatus] = useState(() => getNetworkStatus());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => subscribeNetworkStatus(setNetworkStatus), []);

  const hasConnectionIssue = networkStatus.hasConnectionIssue;

  const barSx = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100vw",
      height: "24px",
      bgcolor: hasConnectionIssue ? "#D93025" : "#D9D9D9",
      color: hasConnectionIssue ? "#FFFFFF" : "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "IRANSANS",
      borderRadius: 0,
      boxShadow: hasConnectionIssue
        ? "0 2px 8px rgba(217, 48, 37, 0.22)"
        : "none",
      transition: "background-color 0.25s ease, color 0.25s ease",
      zIndex: 1100,
    }),
    [hasConnectionIssue],
  );

  return (
    <Box sx={barSx}>
      {hasConnectionIssue && (
        <>
          <Box
            component="img"
            src={wifiOffIcon}
            alt=""
            sx={{
              width: 13,
              height: 13,
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography
            fontFamily="IRANSANS"
            fontSize={12}
            fontWeight={700}
            lineHeight={1}
          >
            اینترنت خود را بررسی کنید
          </Typography>
        </>
      )}

      <Box
        sx={{
          position: "absolute",
          right: 18,
          display: "flex",
          alignItems: "center",
          gap: 1,
          direction: "rtl",
        }}
      >
        <Typography
          fontFamily="IRANSANS"
          fontSize={13}
          fontWeight={700}
          lineHeight={1}
          color={hasConnectionIssue ? "#FFFFFF" : "#1f1e1e"}
        >
          {formatClock(now)} - 
        </Typography>
        <Typography
          fontFamily="IRANSANS"
          fontSize={13}
          fontWeight={700}
          lineHeight={1}
          color={hasConnectionIssue ? "#FFFFFF" : "#1f1e1e"}
        >
          {formatPersianDate(now)}
        </Typography>
      </Box>
    </Box>
  );
};

export default NetworkStatusBar;
