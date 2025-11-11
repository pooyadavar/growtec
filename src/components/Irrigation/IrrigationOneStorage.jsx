import * as React from "react";
import { Typography, Box, Container, Divider, Modal } from "@mui/material";
import IconTextButton from "../../card/IconTextButton"; // ایمپورت دکمه

// [جدید] - ایمپورت آیکون‌های تیک و ضربدر
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import assets from "../../assets";

const IrrigationOneStorage = ({ storageNumber, storageCapacity }) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = String(num || 0);
    for (let c of str) {
      if (!isNaN(parseInt(c, 10))) {
        res += numbers.charAt(c);
      } else {
        res += c;
      }
    }
    return res;
  };

  // استایل اصلی مودال
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700, // عرض تقریبی مودال بر اساس تصویر
    height: 500, // ارتفاع تقریبی مودال
    bgcolor: "#F0F0F0", // رنگ پس‌زمینه آبی/خاکستری
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 2, // پدینگ داخلی
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "IRANSANS",
  };

  // [جدید] - State برای مدیریت باز و بسته بودن مودال
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // داده‌های ساختگی برای جدول (مثال)
  const tableData = [
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "green",
    },
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "red",
    },
    {
      startTime: "۰۰:۰۰:۰۰",
      endTime: "۰۰:۰۰:۰۰",
      zone: 1,
      volume: "",
      status: "green",
    },
  ];

  return (
    <Container
      sx={{
        width: "825px",
        height: "max-content",
        paddingY: "20px",
        bgcolor: "#F0F0F0",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        py:6
      }}
    >
      {/* بخش بالای کارت: حجم مخزن */}
      <Box
        className="irrigation-card-header"
        sx={{
          width: "95%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "250px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            flexDirection: "row-reverse",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"}
            flexGrow={1}
          >
            {convert(storageCapacity || 321)}
          </Typography>
          <Box
            sx={{
              width: "170px",
              height: "37px",
              borderRadius: "10px",
              borderLeft: "0.5px solid #9F9F9F",
              backgroundColor: "#FFCB82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={18}
              textAlign={"center"}
            >
              حجم فعلی مخزن
            </Typography>
          </Box>
        </Box>
        <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
          لیتر
        </Typography>
      </Box>

      {/* Placeholder برای نمودار سطح مخزن */}
      <Box
        sx={{
          width: "95%",
          height: "113px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          bgcolor: "#FFFFFF",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "60px",
            position: "relative",
            left: "20px",
          }}
        >
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: "#FFFFFF",
            }}
          ></Box>
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: "#FFFFFF",
            }}
          ></Box>
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: "#00FF85",
            }}
          ></Box>
        </Box>
        <Box sx={{ width: "calc(100% - 40px)", height: "100%" }}></Box>
      </Box>

      {/* [اصلاح شد] - بخش جدول آبیاری */}
      <Box
        className="irrigation-card-table-container"
        sx={{
          width: "95%",
          bgcolor: "#FFFFFF",
          borderRadius: "10px",
          border: "0.5px solid #9F9F9F",
          padding: "10px 0",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
        }}
      >
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          marginBottom={"10px"}
        >
          جدول آبیاری
        </Typography>
        <Divider
          sx={{ width: "100%", backgroundColor: "#9F9F9F", mb: "10px" }}
        />

        {/* [اصلاح شد] - سربرگ جدول */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // استفاده از space-between
            width: "100%", // عرض کامل
            marginBottom: "5px",
            px: "15px", // پدینگ داخلی
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="25%"
            textAlign={"center"}
          >
            زمان شروع
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="25%"
            textAlign={"center"}
          >
            زمان پایان
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            زون
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            حجم
          </Typography>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={14}
            width="15%"
            textAlign="center"
          >
            وضعیت
          </Typography>
        </Box>

        {/* [اصلاح شد] - ردیف‌های جدول */}
        {tableData.map((row, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", // استفاده از space-between
                alignItems: "center",
                width: "100%", // عرض کامل
                height: "50px",
                px: "15px", // پدینگ داخلی
              }}
            >
              {/* ستون زمان شروع */}
              <Box
                sx={{
                  width: "25%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {convert(row.startTime)}
                </Typography>
              </Box>
              {/* ستون زمان پایان */}
              <Box
                sx={{
                  width: "25%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {convert(row.endTime)}
                </Typography>
              </Box>
              {/* ستون زون */}
              <Box
                sx={{
                  width: "15%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {convert(row.zone)}
                </Typography>
              </Box>
              {/* ستون حجم */}
              <Box
                sx={{
                  width: "15%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14}>
                  {convert(row.volume)}
                </Typography>
              </Box>
              {/* [جدید] - ستون وضعیت (آیکون‌ها) */}
              <Box
                sx={{
                  width: "15%", // عرض ستون با سربرگ یکسان است
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.status === "green" && (
                  <CheckCircleIcon sx={{ color: "#00FF85" }} />
                )}
                {row.status === "red" && (
                  <CancelIcon sx={{ color: "#F44336" }} />
                )}
              </Box>
            </Box>
            {index < tableData.length - 1 && (
              <Divider
                sx={{ width: "100%", backgroundColor: "#E0E0E0", my: "5px" }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* دکمه‌های پایین کارت */}
      <Box
        sx={{
          width: "95%",
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          gap: 6,
        }}
      >
        <IconTextButton
          text="ماشین حساب آبیاری"
          icon="https://placehold.co/24x24/FFFFFF/000000?text=Calc"
          bgColor="#00FF85"
          textColor="#000000"
          width="30%"
          height="30px"
          borderColor="#00FF85"
          sx={{
            justifyContent: "space-evenly",
            "& .MuiTypography-root": {
              fontSize: "14px",
              marginLeft: "0px",
            },
          }}
        />
        <IconTextButton
          text="تغییر تنظیمات"
          icon={assets.svg.setting}
          bgColor="#FFCB82"
          textColor="#000000"
          width="30%"
          height="30px"
          borderColor="#FFCB82"
          onClick={handleModalOpen} // باز کردن مودال
          sx={{
            justifyContent: "space-evenly",
            "& .MuiTypography-root": {
              fontSize: "14px",
              marginLeft: "0px",
            },
          }}
        />
      </Box>

      {/* ========= [جدید] - مودال تنظیمات ========= */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="settings-modal-title"
      >
        <Box sx={modalStyle}>
          {/* ستون سمت راست مودال (دکمه‌ها) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "200px", // عرض ثابت برای ستون دکمه‌ها
              pt: 2,
              justifyContent: "space-between"
            }}
          >
            {/* نام برنامه */}
            <Box
              sx={{
                width: "180px",
                height: "37px",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#FFFFFF",
                flexDirection: "row-reverse", // "دستی ۱" سمت چپ، "نام برنامه" سمت راست
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                flexGrow={1}
              >
                دستی ۱
              </Typography>
              <Box
                sx={{
                  width: "100px",
                  height: "37px",
                  borderRadius: "10px",
                  borderLeft: "0.5px solid #9F9F9F",
                  backgroundColor: "#FFCB82",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={16}
                  textAlign={"center"}
                >
                  نام برنامه
                </Typography>
              </Box>
            </Box>

            <Box sx={{display:"flex" , flexDirection:"column", mb:5, gap:5}}>
              {/* دکمه ذخیره */}
              <IconTextButton
                text="ذخیره"
                icon="https://placehold.co/24x24/FFFFFF/000000?text=Save" // Placeholder
                iconPosition="right"
                bgColor="#86CCB2" // سبز
                textColor="#FFFFFF"
                width="160px"
                height="40px"
                borderColor="#86CCB2"
                sx={{ "& .MuiTypography-root": { fontSize: "18px" } }}
              />

              {/* دکمه بارگذاری */}
              <IconTextButton
                text="بارگذاری"
                icon="https://placehold.co/24x24/FFFFFF/000000?text=Load" // Placeholder
                iconPosition="right"
                bgColor="#FFCB82" // زرد
                textColor="#000000"
                width="160px"
                height="40px"
                borderColor="#FFCB82"
                sx={{ "& .MuiTypography-root": { fontSize: "18px" } }}
              />
            </Box>
          </Box>

          {/* ستون سمت چپ مودال (جدول و اسکرول) */}
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              height: "100%",
              justifyContent: "flex-end", // چسبیده به راست
            }}
          >
            {/* کانتینر جدول */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "calc(100% - 40px)", // عرض جدول (منهای اسکرول)
                alignItems: "center",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={18}
                fontWeight="bold"
              >
                ۱
              </Typography>
              <Typography fontFamily={"IRANSANS"} fontSize={16} mb={1}>
                جدول آبیاری
              </Typography>

              {/* سربرگ جدول مودال */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "5px",
                  px: "10px",
                }}
              >
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  width="25%"
                  textAlign={"center"}
                >
                  زمان شروع
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  width="25%"
                  textAlign={"center"}
                >
                  زمان پایان
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  width="15%"
                  textAlign="center"
                >
                  زون
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  width="15%"
                  textAlign="center"
                >
                  حجم
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  width="15%"
                  textAlign="center"
                >
                  وضعیت
                </Typography>
              </Box>

              {/* بخش اسکرول ردیف‌ها مودال */}
              <Box sx={{ width: "96%", flexGrow: 1, overflowY: "auto" }}>
                {tableData.concat(tableData).map(
                  (
                    row,
                    index // داده‌ها را تکرار کردم تا اسکرول دیده شود
                  ) => (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          height: "50px",
                          px: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            width: "25%",
                            height: "35px",
                            border: "0.5px solid #9F9F9F",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography fontFamily={"IRANSANS"} fontSize={12}>
                            {convert(row.startTime)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "25%",
                            height: "35px",
                            border: "0.5px solid #9F9F9F",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography fontFamily={"IRANSANS"} fontSize={12}>
                            {convert(row.endTime)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "15%",
                            height: "35px",
                            border: "0.5px solid #9F9F9F",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography fontFamily={"IRANSANS"} fontSize={12}>
                            {convert(row.zone)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "15%",
                            height: "35px",
                            border: "0.5px solid #9F9F9F",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography fontFamily={"IRANSANS"} fontSize={12}>
                            {convert(row.volume)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "15%",
                            height: "35px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {row.status === "green" && (
                            <CheckCircleIcon sx={{ color: "#00FF85" }} />
                          )}
                          {row.status === "red" && (
                            <CancelIcon sx={{ color: "#F44336" }} />
                          )}
                        </Box>
                      </Box>
                      <Divider
                        sx={{
                          width: "100%",
                          backgroundColor: "#E0E0E0",
                          my: "5px",
                        }}
                      />
                    </React.Fragment>
                  )
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* ========= پایان مودال ========= */}
    </Container>
  );
};

export default IrrigationOneStorage;
