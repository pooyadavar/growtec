import * as React from "react";
import { Typography, Box, Modal, CircularProgress } from "@mui/material";
import imgMixerBGImageAsset from "../assets/image/bg-blue.jpg";
import svgTikeAsset from "../assets/svg/tike.svg";
import svgCrossAsset from "../assets/svg/cross.svg";
import ModalCloseButton from "../components/common/ModalCloseButton";
import { useQuery } from "@tanstack/react-query";
import { getIrrigationSchedules } from "../api/irrigationApi";
import { queryKeys } from "../api/queryKeys";
import { toPersianDigits } from "../utils/persianDigits";
import { getIrrigationScheduleDisplayStatus } from "../utils/irrigationScheduleStatus";

const MANUAL_ROW_BG = "#EEEEEE";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "0.5px solid #EBEBEB",
  borderRadius: "15px",
  backgroundColor: "#FFFFFF",
  width: "440px",
  height: "auto",
  maxHeight: "80vh",
  minHeight: "250px",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  p: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const StorageCard = ({
  maxCapacity,
  zone,
  capacity,
  float1,
  float2,
  float3,
  activeIrrigationZones = [],
  tankWidth = "85px",
  tankHeight = "110px",
  headerHeight = "20px",
  bodyHeight = "90px",
  capacityBoxWidth = "40px",
  capacityBoxHeight = "16px",
  tankTitleFontSize = "14px",
  capacityFontSize = "12px",
  unitFontSize = 14,
  floatColumnOffset = "-19px",
}) => {
  let waterHeight = 95 - (capacity / maxCapacity) * 100;
  if (isNaN(waterHeight) || !isFinite(waterHeight)) {
    waterHeight = 100;
  }

  const formattedCapacity = Math.round(Number(capacity || 0));
  const image = `url(${imgMixerBGImageAsset})`;
  const isIrrigating = activeIrrigationZones.length > 0;
  const irrigationHeaderText =
    activeIrrigationZones.length === 1
      ? `آبیاری زون ${activeIrrigationZones[0]}`
      : `آبیاری زون‌های ${activeIrrigationZones.join("،")}`;

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  // --- واکشی دیتای جدول آبیاری ---
  const { data: scheduleItems = [], isLoading } = useQuery({
    queryKey: queryKeys.storageIrrigationSchedule(zone),
    queryFn: async () => {
      const response = await getIrrigationSchedules();
      const data = Array.isArray(response) ? response : response.data || [];

      return data.filter(
        (item) => Number(item.zone) === Number(zone) && item.is_active === true,
      );
    },
    enabled: open,
  });

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.length > 8 ? timeString.substring(0, 8) : timeString;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          width: tankWidth,
          height: tankHeight,
          borderRadius: "10px",
          border: "0.5px solid #9F9F9F",
        }}
      >
        {/* هدر مخزن - رویداد کلیک به اینجا منتقل شد */}
        <Box
          onClick={handleOpen}
          sx={{
            height: headerHeight,
            width: "100%",
            backgroundColor: isIrrigating ? "#2D9AFF" : "#FFCB82",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer", // نشانگر موس برای هدر
            overflow: "hidden",
            position: "relative",
            "&::after": isIrrigating
              ? {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 45%, transparent 80%)",
                  animation: "irrigationHeaderFlow 1.2s linear infinite",
                }
              : {},
            "@keyframes irrigationHeaderFlow": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" },
            },
          }}
        >
          {isIrrigating && (
            <Typography
              component="span"
              sx={{
                color: "#fff",
                fontFamily: "IRANSANS",
                fontSize: "8px",
                fontWeight: 700,
                lineHeight: 1,
                maxWidth: "78px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
                textShadow: "0 1px 2px rgba(0,0,0,0.28)",
                direction: "rtl",
              }}
            >
              {toPersianDigits(irrigationHeaderText)}
            </Typography>
          )}
        </Box>

        {/* بدنه مخزن - رویداد کلیک از اینجا حذف شد */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: bodyHeight,
            borderRadius: "0 0 10px 10px",
            backgroundImage: image,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: `${waterHeight}px`,
            // cursor: "pointer" حذف شد
          }}
        >
          <Typography fontFamily={"IRANSANS"} sx={{ fontSize: tankTitleFontSize }}>
            مخزن {toPersianDigits(zone)}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-around",
              position: "relative",
              right: floatColumnOffset,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "0.5px solid #9F9F9F",
                backgroundColor: float3 ? "#00FF85" : "white",
              }}
            ></div>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "0.5px solid #9F9F9F",
                backgroundColor: float2 ? "#00FF85" : "white",
              }}
            ></div>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "0.5px solid #9F9F9F",
                backgroundColor: float1 ? "#00FF85" : "white",
              }}
            ></div>
          </div>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "2px",
        }}
      >
        <Box
          sx={{
            width: capacityBoxWidth,
            height: capacityBoxHeight,
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="initial" fontSize={capacityFontSize} fontFamily={"IRANSANS"}>
            {toPersianDigits(formattedCapacity)}
          </Typography>
        </Box>
        <Typography color="initial" fontSize={unitFontSize} pl={"6px"}>
          L
        </Typography>
      </Box>

      {/* ===================== مودال ===================== */}
      <Modal
        disableAutoFocus
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style} className="modalBox">
          {/* هدر مودال */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              borderBottom: "1px solid #EBEBEB",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              fontFamily={"IRANSANS"}
              fontSize={"16px"}
              fontWeight="bold"
              color="#333"
              mr={1}
            >
              جدول آبیاری - مخزن زون {toPersianDigits(zone)}
            </Typography>
            <ModalCloseButton onClick={handleClose} />
          </div>

          {/* هدر جدول (با عرض منعطف) */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              direction: "rtl",
              backgroundColor: "#E4E6EB", // پس‌زمینه هدر
              borderRadius: "8px",
              py: 1.5,
              px: 1,
              mb: 0.5,
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={13}
              color="#333"
              fontWeight="bold"
              sx={{ flex: 2, textAlign: "center" }}
            >
              زمان شروع
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={13}
              color="#333"
              fontWeight="bold"
              sx={{ flex: 2, textAlign: "center" }}
            >
              زمان پایان
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={13}
              color="#333"
              fontWeight="bold"
              sx={{ flex: 1, textAlign: "center" }}
            >
              زون
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={13}
              color="#333"
              fontWeight="bold"
              sx={{ flex: 1.5, textAlign: "center" }}
            >
              حجم
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={13}
              color="#333"
              fontWeight="bold"
              sx={{ flex: 1.5, textAlign: "center" }}
            >
              وضعیت
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden", // مسدود کردن اسکرول افقی
              direction: "ltr",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "4px",
              },
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            ) : scheduleItems.length > 0 ? (
              scheduleItems.map((item, index) => {
                const displayStatus = getIrrigationScheduleDisplayStatus(item);

                return (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      py: 1.5,
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      direction: "rtl",
                      borderRadius: "6px",
                      backgroundColor: item.is_manual
                        ? MANUAL_ROW_BG
                        : index % 2 === 0
                          ? "#FFFFFF"
                          : "#F4F5F7",
                      "&:hover": {
                        backgroundColor: item.is_manual ? "#E4E4E4" : "#EAF0F6",
                      },
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={13}
                      color="#444"
                      sx={{ flex: 2, textAlign: "center" }}
                    >
                      {toPersianDigits(formatTime(item.start_time))}
                    </Typography>

                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={13}
                      color="#444"
                      sx={{ flex: 2, textAlign: "center" }}
                    >
                      {toPersianDigits(formatTime(item.end_time))}
                    </Typography>

                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={13}
                      color="#444"
                      sx={{ flex: 1, textAlign: "center" }}
                    >
                      {toPersianDigits(item.zone)}
                    </Typography>

                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={13}
                      color="#444"
                      sx={{ flex: 1.5, textAlign: "center" }}
                    >
                      {toPersianDigits(item.volume)}
                    </Typography>

                    <Box
                      sx={{
                        flex: 1.5,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            displayStatus === "tick"
                              ? "#E8F5E9"
                              : displayStatus === "cross"
                                ? "#FFEBEE"
                                : "transparent",
                        }}
                      >
                        {displayStatus === "tick" && (
                          <img
                            src={svgTikeAsset}
                            alt="Success"
                            style={{ width: "14px", height: "14px" }}
                          />
                        )}
                        {displayStatus === "cross" && (
                          <img
                            src={svgCrossAsset}
                            alt="Error"
                            style={{ width: "14px", height: "14px" }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  direction: "rtl",
                }}
              >
                <Typography
                  fontFamily="IRANSANS"
                  fontSize={14}
                  color="text.secondary"
                >
                  برنامه فعالی موجود نیست
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StorageCard;
