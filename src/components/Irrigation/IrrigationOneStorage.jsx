import * as React from "react";
import { Typography, Box, Container, Divider } from "@mui/material";
import IconTextButton from "../../card/IconTextButton"; // ایمپورت دکمه

// [جدید] - ایمپورت آیکون‌های تیک و ضربدر
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>
            زمان شروع
          </Typography>
          <Typography fontFamily={"IRANSANS"} fontSize={14} width="25%" textAlign={"center"}>
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
                  <CheckCircleIcon sx={{ color: '#00FF85' }} />
                )}
                {row.status === "red" && (
                  <CancelIcon sx={{ color: '#F44336' }} />
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
          gap: "20px",
        }}
      >
        <IconTextButton
          text="ماشین حساب آبیاری"
          icon="https://placehold.co/24x24/FFFFFF/000000?text=Calc" 
          bgColor="#00FF85"
          textColor="#000000"
          width="130px" 
          height="56px"
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
          width="130px" 
          height="56px"
          borderColor="#FFCB82"
          sx={{
            justifyContent: "space-evenly",
            "& .MuiTypography-root": {
              fontSize: "14px",
              marginLeft: "0px",
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default IrrigationOneStorage;