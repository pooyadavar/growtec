import * as React from "react";
import { Typography, Box, Modal, CircularProgress } from "@mui/material";
import assets from "../assets/index";
import { useQuery } from "@tanstack/react-query";
import { getIrrigationSchedules } from "../api/irrigationApi";
import { queryKeys } from "../api/queryKeys";
import { toPersianDigits } from "../utils/persianDigits";

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
}) => {
  let waterHeight = 95 - (capacity / maxCapacity) * 100;
  if (isNaN(waterHeight) || !isFinite(waterHeight)) {
    waterHeight = 100;
  }

  const formattedCapacity = Number(capacity || 0).toFixed(2);
  const image = `url(${assets.img.mixerBGImage})`;

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

  const getDisplayStatus = (startStatus, endStatus) => {
    if (startStatus === 3 && endStatus === 3) {
      return "tick";
    }
    if (startStatus === 4 || endStatus === 4) {
      return "cross";
    }
    return "blank";
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
          width: "85px",
          height: "110px",
          borderRadius: "10px",
          border: "0.5px solid #9F9F9F",
        }}
      >
        <Box
          sx={{
            height: "20px",
            width: "100%",
            backgroundColor: "#FFCB82",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              fontSize: "10px",
            }}
          >
            زون {toPersianDigits(zone)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90px",
            borderRadius: "0 0 10px 10px",
            backgroundImage: image,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: `${waterHeight}px`,
            cursor: "pointer",
          }}
          onClick={handleOpen}
        >
          <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "14px" }}>
            مخزن {toPersianDigits(zone)}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-around",
              position: "relative",
              right: "-19px",
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
            width: "40px",
            height: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="initial" fontSize={"12px"} fontFamily={"IRANSANS"}>
            {toPersianDigits(formattedCapacity)}
          </Typography>
        </Box>
        <Typography color="initial" fontSize={14} pl={"6px"}>
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
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleClose}
              style={{
                cursor: "pointer",
                width: "20px",
                height: "20px",
                opacity: 0.7,
              }}
            />
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
                const displayStatus = getDisplayStatus(
                  item.start_status,
                  item.end_status,
                );

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
                      // یک سطر در میان خاکستری روشن (Zebra Striping)
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F4F5F7",
                      "&:hover": { backgroundColor: "#EAF0F6" }, // افکت هاور یکپارچه
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
                            src={assets.svg.tike}
                            alt="Success"
                            style={{ width: "14px", height: "14px" }}
                          />
                        )}
                        {displayStatus === "cross" && (
                          <img
                            src={assets.svg.cross}
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
