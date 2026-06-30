import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { resolveMixTankProcessStatus } from "../../utils/mixTankStatus";

const MixTankProcessStatus = ({ mixTankData, iconBoxSize = 80 }) => {
  const processStatus = useMemo(
    () => resolveMixTankProcessStatus(mixTankData),
    [mixTankData],
  );

  const showFooter =
    processStatus.footerLabel || processStatus.footerValue;

  const footerText = processStatus.footerLabel
    ? `${processStatus.footerLabel}: ${processStatus.footerValue}`
    : processStatus.footerValue;

  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          border: "0.5px solid gray",
          mt: 0,
          p: 0.5,
          borderRadius: "15px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
            borderRadius: "50%",
            width: iconBoxSize,
            height: iconBoxSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={processStatus.icon}
            alt=""
            style={{
              width: processStatus.iconWidth,
              height: processStatus.iconHeight,
              objectFit: "contain",
            }}
          />
        </Box>
        <Typography
          variant="body2"
          fontFamily="IRANSANS"
          sx={{ mt: 1, color: "#555", mb: 0.5, fontSize: "11px" }}
        >
          وضعیت سیستم:
        </Typography>
        <Box
          sx={{
            backgroundColor: processStatus.bgColor,
            borderRadius: "10px",
            padding: "4px 10px",
            textAlign: "center",
            border: "0.5px solid gray",
            width: "fit-content",
            minWidth: "72px",
            maxWidth: "100px",
            alignSelf: "center",
            mb: 0.5,
          }}
        >
          <Typography
            variant="caption"
            fontFamily="IRANSANS"
            sx={{
              color: processStatus.textColor,
              fontWeight: "800",
              fontSize: "9px",
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            {processStatus.title}
          </Typography>
        </Box>
      </Box>

      {showFooter ? (
        <Typography
          fontFamily="IRANSANS"
          sx={{
            color: "#403f3f",
            fontWeight: "bold",
            fontSize: "12px",
            display: "block",
            mt: 1,
            textAlign: "center",
            width: "100%",
            lineHeight: 1.4,
          }}
        >
          {footerText}
        </Typography>
      ) : null}
    </Box>
  );
};

export default MixTankProcessStatus;
