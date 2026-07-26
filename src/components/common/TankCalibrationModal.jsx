import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import ModalCloseButton from "./ModalCloseButton";
import { calibratePressureSensor } from "../../api/calibrationApi";
import { getIrrigationTanksStatus } from "../../api/dashboardApi";
import { queryKeys } from "../../api/queryKeys";
import toast from "react-hot-toast";
import { toPersianDigits } from "../../utils/persianDigits";

const TankCalibrationModal = ({
  open,
  onClose,
  displayNumber,
  apiTankNumber,
  float1 = false,
  float2 = false,
  float3 = false,
  fallbackVolume = 0,
  fallbackMaxVolume = 100,
  externalContents = null,
}) => {
  const [lowConfirmed, setLowConfirmed] = React.useState(false);
  const [highConfirmed, setHighConfirmed] = React.useState(false);

  const { data: realTimeTanksData } = useQuery({
    queryKey: queryKeys.irrigationTanksStatusCalib(),
    queryFn: getIrrigationTanksStatus,
    refetchInterval: 5000,
    enabled: open && !externalContents,
  });

  const tankRealTimeData = externalContents
    ? externalContents
    : realTimeTanksData?.[apiTankNumber]?.contents ??
      realTimeTanksData?.[String(apiTankNumber)]?.contents ??
      null;

  const realTimeVolume = tankRealTimeData?.filled_volume ?? fallbackVolume;
  const realTimeMax = tankRealTimeData?.max_volume ?? fallbackMaxVolume;
  const displayRealTimeVolume = Math.round(Number(realTimeVolume || 0));

  const realTimeFillPercentage = Math.max(
    0,
    Math.min(100, (realTimeVolume / (realTimeMax || 100)) * 100),
  );

  const realTimeLevel =
    tankRealTimeData?.level ??
    tankRealTimeData?.water_level ??
    `${realTimeFillPercentage.toFixed(0)} %`;

  React.useEffect(() => {
    if (!open) {
      setLowConfirmed(false);
      setHighConfirmed(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (lowConfirmed && highConfirmed) {
      toast.success("کالیبراسیون مخزن به طور کامل با موفقیت انجام شد.");
      const timer = setTimeout(() => {
        onClose?.();
        setLowConfirmed(false);
        setHighConfirmed(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [lowConfirmed, highConfirmed, onClose]);

  const { mutate: calibrateTankMutation } = useMutation({
    mutationFn: calibratePressureSensor,
    onSuccess: (_data, variables) => {
      if (variables.status === "empty") {
        toast.success("حجم پایین مخزن با موفقیت ثبت شد.");
        setLowConfirmed(true);
      } else if (variables.status === "full") {
        toast.success("حجم بالای مخزن با موفقیت ثبت شد.");
        setHighConfirmed(true);
      }
    },
    onError: (error) => {
      console.error("Calibration Error:", error);
      toast.error("خطا در کالیبراسیون مخزن");
    },
  });

  const handleCalibrateStep1 = (e) => {
    e?.stopPropagation?.();
    calibrateTankMutation({
      tank: "irrigation",
      tank_number: Number(apiTankNumber),
      status: "empty",
    });
  };

  const handleCalibrateStep2 = (e) => {
    e?.stopPropagation?.();
    calibrateTankMutation({
      tank: "irrigation",
      tank_number: Number(apiTankNumber),
      status: "full",
    });
  };

  const handleClose = (e) => {
    e?.stopPropagation?.();
    onClose?.();
    setLowConfirmed(false);
    setHighConfirmed(false);
  };

  return (
    <Modal disableAutoFocus open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          width: "550px",
          height: "auto",
          maxHeight: "90vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
          boxShadow: 24,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography fontFamily="IRANSANS" fontSize={18} fontWeight="bold">
            کالیبراسیون سطح مخزن {toPersianDigits(displayNumber)}
          </Typography>
          <ModalCloseButton onClick={handleClose} />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            mt: 1,
            mb: 1,
          }}
        >
          <Typography fontFamily="IRANSANS" fontSize={16}>
            حجم مخزن:{" "}
            <strong style={{ color: "#004323" }}>
              {toPersianDigits(displayRealTimeVolume)}
            </strong>{" "}
            لیتر
          </Typography>
          <Typography fontFamily="IRANSANS" fontSize={16}>
            سطح مخزن:{" "}
            <strong style={{ color: "#004323" }}>
              {toPersianDigits(realTimeLevel)}
            </strong>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <Box
            sx={{
              width: "280px",
              height: "140px",
              borderRadius: "10px",
              border: "2px solid #9F9F9F",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: `${realTimeFillPercentage}%`,
                backgroundColor: "#2196F3",
                borderRadius:
                  realTimeFillPercentage > 95 ? "8px" : "0 0 8px 8px",
                transition: "height 0.5s ease-in-out",
                opacity: 0.8,
              }}
            />
            <Typography
              fontFamily="IRANSANS"
              sx={{
                position: "absolute",
                top: "10px",
                fontSize: "16px",
                zIndex: 2,
                color: realTimeFillPercentage > 80 ? "#fff" : "#333",
              }}
            >
              مخزن
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-around",
                position: "absolute",
                right: "-26px",
                top: "-10px",
                py: 1.5,
                zIndex: 3,
              }}
            >
              {[float3, float2, float1].map((active, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "1px solid #9F9F9F",
                    backgroundColor: active ? "#00FF85" : "white",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", width: "80%", gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            disabled={highConfirmed}
            onClick={handleCalibrateStep2}
            sx={{
              flex: 1,
              height: "40px",
              fontSize: "14px",
              color: "#000",
              backgroundColor: "#FFCB82",
              borderRadius: "10px",
              fontFamily: "IRANSANS",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#ffb74d", boxShadow: "none" },
              "&.Mui-disabled": {
                backgroundColor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            {highConfirmed ? "تایید شد ✓" : "تایید حجم بالای مخزن"}
          </Button>

          <Button
            variant="contained"
            disabled={lowConfirmed}
            onClick={handleCalibrateStep1}
            sx={{
              flex: 1,
              height: "40px",
              fontSize: "14px",
              color: "#000",
              backgroundColor: "#FFCB82",
              borderRadius: "10px",
              fontFamily: "IRANSANS",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#ffb74d", boxShadow: "none" },
              "&.Mui-disabled": {
                backgroundColor: "#E0E0E0",
                color: "#9E9E9E",
              },
            }}
          >
            {lowConfirmed ? "تایید شد ✓" : "تایید حجم پایین مخزن"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TankCalibrationModal;
