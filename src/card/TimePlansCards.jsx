import React from "react";
import {
  Typography,
  Box,
  Container,
  Divider,
} from "@mui/material";
import assets from "../assets"; // مسیردهی از src/card/ به src/assets/
import IconTextButton from "./IconTextButton"; // ایمپورت دکمه جدید
const TimePlansCards = ({ fan, float1, float2, float3 }) => {

  return (
    <Container
      sx={{
        margin: "0",
        padding: "0",
        width: "293px",
        height: "564px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {/* ... (بخش عنوان و نمودار بدون تغییر) ... */}
      <Box
        className="irrigation-card-title"
        sx={{
          width: "220px",
          height: "37px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "102px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            backgroundColor: "#FFCB82",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"}
          >
            فن {fan}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          نمودار وضعیت عملگر
        </Typography>
      </Box>
      <Box
        sx={{
          width: "259px",
          height: "113px",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-around",
          marginX: "10px",
        }}
      >
        <Box
          sx={{
            width: "237px",
            height: "113px",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
          }}
        >
          {/* Placeholder for Chart */}
        </Box>
        <div
          style={{
            width: "14px",
            height: "61px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: "10px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float3 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float2 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float1 ? "#00FF85" : "white",
            }}
          ></div>
        </div>
      </Box>
      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
        >
          تاریخچه وضعیت عملگر
        </Typography>
      </Box>
      <Box
        className="irrigation-card-table"
        sx={{
          width: "280px",
          height: "283px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* ... (بخش جدول تاریخچه بدون تغییر) ... */}
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>
        <Divider
          sx={{
            width: "100%",
            backgroundColor: "#9F9F9F",
          }}
        />
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {/* ... (ردیف دوم جدول) ... */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>
        <Divider
          sx={{
            width: "100%",
            backgroundColor: "#9F9F9F",
          }}
        />
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {/* ... (ردیف سوم جدول) ... */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان شروع
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زمان پایان
            </Typography>
            <Box
              sx={{
                width: "65px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              زون
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography color="initial" fontFamily={"IRANSANS"} fontSize={14}>
              وضعیت
            </Typography>
            <Box
              sx={{
                width: "35px",
                height: "35px",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
              }}
            ></Box>
          </div>
        </Box>

        {/* --- دکمه تعویض شده --- */}
        <Box sx={{ width: "246px", marginX: "auto" , display: "flex", justifyContent: "center" }}>
          <IconTextButton
            text="تغییر تنظیمات"
            icon={assets.svg.setting2}
            iconPosition="left" // آیکون در سمت چپ است (بر اساس کد اصلی شما)
            bgColor="#FFCB82"
            textColor="#000000"
            width="246px"
            height="56px"
            borderColor="#FFCB82" // کادر همرنگ پس‌زمینه
            sx={{
              justifyContent: "center", // بازنویسی برای وسط‌چین کردن (چون UI اصلی اینطور بود)
              gap: 2, // ایجاد فاصله بین آیکون و متن
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
export default TimePlansCards;