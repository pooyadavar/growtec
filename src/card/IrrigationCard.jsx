import * as React from "react";
import {
  Typography,
  Box,
  Container,
  Divider,
} from "@mui/material";
import assets from "../assets/index"; // مسیر `src/card` به `src/assets`
import IconTextButton from "./IconTextButton"; // ایمپورت دکمه از فایل هم‌جوار

// کامپوننت تمیز شده:
// - ایمپورت‌های استفاده‌نشده (Button, MenuItem, FormControl, ...) حذف شدند.
// - منطق استفاده‌نشده (tableArray, zone, handleZoneChange) حذف شد.
// - پراپ‌های ثابت با پراپ‌های داینامیک (storageNumber, storageCapacity) جایگزین شدند.
const IrrigationCard = ({
  storageNumber,
  storageCapacity,
  float1,
  float2,
  float3,
}) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = String(num || 0); // اطمینان از اینکه ورودی رشته است
    for (let c of str) {
      // فقط اعداد را تبدیل کن
      if (!isNaN(parseInt(c, 10))) {
        res += numbers.charAt(c);
      } else {
        res += c; // کاراکترهای دیگر (مانند "/") را حفظ کن
      }
    }
    return res;
  };

  return (
    <Container
      sx={{
        width: "293px",
        height: "640px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        className="irrigation-card-title"
        sx={{
          width: "220px",
          height: "37px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "180px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // اضافه شد برای تراز عمودی
          }}
        >
          <Box
            sx={{
              width: "102px",
              height: "37px",
              borderRadius: "10px", // اصلاح شد (قبلاً 10px 0 0 10px بود)
              borderRight: "0.5px solid #9F9F9F", // کادر جداکننده
              backgroundColor: "#FFCB82",
              display: "flex", // اضافه شد
              alignItems: "center", // اضافه شد
              justifyContent: "center", // اضافه شد
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              textAlign={"center"}
            >
              مخزن {convert(storageNumber)}
            </Typography>
          </Box>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"center"} // وسط‌چین شد
            flexGrow={1} // فضای باقی‌مانده را پر می‌کند
            alignContent={"center"}
          >
            {convert(storageCapacity)}
          </Typography>
        </Box>
        <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
          لیتر
        </Typography>
      </Box>
      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          نمودار سطح مخزن در طول روز
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
          marginRight: "10px",
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
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-around",
            position: "relative",
            right: "-19px",
          }}
        >
          {/* ... فلوترها بدون تغییر ... */}
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
          جدول آبیاری
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
        {/* ... جدول خالی (بدون تغییر) ... */}
        <Box
          sx={{
            width: "280px",
            height: "79",
            display: "flex",
            justifyContent: "space-between",
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
              حجم
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
            justifyContent: "space-between",
          }}
        >
          {/* ... ردیف دوم ... */}
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
              حجم
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
            justifyContent: "space-between",
          }}
        >
          {/* ... ردیف سوم ... */}
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
              حجم
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
            icon={assets.svg.setting2} // استفاده از asset
            iconPosition="left" // آیکون در سمت چپ بود
            bgColor="#FFCB82"
            textColor="#000000"
            width="246px"
            height="56px"
            borderColor="#FFCB82" // کادر همرنگ پس‌زمینه
            sx={{
              justifyContent: "center", // بازنویسی برای وسط‌چین کردن
              gap: 2, // ایجاد فاصله بین آیکون و متن
              // بازنویسی فونت برای مطابقت با دکمه اصلی
              '& .MuiTypography-root': {
                fontSize: '18px',
                marginLeft: '20px' // شبیه‌سازی marginLeft={5} اصلی
              }
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default IrrigationCard;