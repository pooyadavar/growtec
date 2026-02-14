import React, { useMemo } from "react";
import { Typography, Box, Container, Divider } from "@mui/material";
import assets from "../assets"; // مسیردهی از src/card/ به src/assets/
import IconTextButton from "./IconTextButton"; // ایمپورت دکمه جدید
import { AgCharts } from "ag-charts-react";

const TimePlansCards = ({ fan, float1, float2, float3, data }) => {
  const chartOptions = useMemo(
    () => ({
      data: data || [],
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "value",
          yName: fan,
          stroke: "#007bff", // Blue color for visibility
          strokeWidth: 3,
          marker: {
            enabled: true,
            size: 5,
            fill: "#007bff",
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            enabled: false,
          },
          // title: { text: "زمان" } // Removed title to save space
        },
        {
          type: "number",
          position: "left",
          min: 0,
          max: 1,
          nice: false, // Prevent auto-padding the range
          tick: {
            values: [0, 1], // Strict ticks
            count: 2,
          },
          label: {
            formatter: (params) => {
              if (params.value === 1) return "روشن";
              if (params.value === 0) return "خاموش";
              return ""; // Hide other values
            },
            fontSize: 10,
          },
          gridStyle: [
            {
              stroke: "#e2e2e2",
              lineDash: [4, 2],
            },
          ],
        },
      ],
      background: {
        fill: "transparent",
      },
      padding: {
        top: 5,
        right: 10,
        bottom: 20,
        left: 5,
      },
    }),
    [data, fan],
  );

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

        transition: "transform 0.2s",
        p: 2,
        transform: "scale(1)",
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
          justifyContent: "center",
          marginX: "10px",
        }}
      >
        <Box
          sx={{
            width: "237px",
            height: "113px", // ارتفاع مورد نظر شما
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            paddingTop: "15px",
            paddingRight:"15px"
          }}
        >
          <Box sx={{ width: "calc(100% - 10px)", height: "calc(100% - 10px)" }}>
            <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
          </Box>
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
        <Box
          sx={{
            width: "246px",
            marginLeft: "17px",
            display: "flex",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <IconTextButton
            text="تغییر تنظیمات"
            icon={assets?.svg?.setting2} // استفاده ایمن از asset
            iconPosition="left" // آیکون در سمت چپ بود
            bgColor="#FFCB82"
            textColor="#000000"
            width="246px"
            height="30px"
            borderColor="#FFCB82" // کادر همرنگ پس‌زمینه
            sx={{
              justifyContent: "center", // بازنویسی برای وسط‌چین کردن
              gap: 2, // ایجاد فاصله بین آیکون و متن
              // بازنویسی فونت برای مطابقت با دکمه اصلی
              "& .MuiTypography-root": {
                fontSize: "18px",
                marginLeft: "20px", // شبیه‌سازی marginLeft={5} اصلی
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
export default TimePlansCards;
