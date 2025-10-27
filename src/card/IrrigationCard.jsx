import * as React from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from "@mui/material";
import assets from "../assets/index";

const IrrigationCard = ({
  storage,
  capacity,
  table,
  float1,
  float2,
  float3,
}) => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  const tableArray = Array.isArray(table) ? table : [];
  const [zone, setZone] = React.useState(1);
  const [selectedZone, setSelectedZone] = React.useState(0);
  const handleZoneChange = (event) => {
    event.preventDefault();
    setSelectedZone(event.target.value);
    setZone(event.target.value);
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
              {/* {storage}
               */}
              مخزن ۱
            </Typography>
          </Box>
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={21}
            textAlign={"end"}
            marginLeft={"20px"}
            alignContent={"center"}
          >
            {convert(231)}
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
        ></Box>
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
              // justifyContent: "space-between",
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
            // marginBottom: "1rem",
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
            // marginBottom: "1rem",
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
        <Button
          sx={{
            width: "246px",
            height: "56px",
            backgroundColor: "#FFCB82",
            color: "#000000",
            borderRadius: "10px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginX: "auto",
          }}
        >
          <img src={assets.svg.setting2} alt="" />
          <Typography
            color="#000000"
            fontFamily={"IRANSANS"}
            fontSize={18}
            marginLeft={5}
          >
            تغییر تنظیمات
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};

export default IrrigationCard;
