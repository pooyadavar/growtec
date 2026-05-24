import { Box, Typography } from "@mui/material";
import assets from "../assets";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

const EghlimCard = ({
  zone,
  temp,
  hum,
  fan1,
  fan2,
  bokhari,
  pad,
  parde,
  dariche,
  mehpash,
  isAuto: parentIsAuto = false,
}) => {
  // دریافت وضعیت اتوماتیک/دستی برای هر زون
  const { data: modeData } = useQuery({
    queryKey: ["operatorModeEghlim", zone],
    queryFn: async () => {
      const res = await apiClient.get(`/climate/operators-mode/?zone=${zone}`);
      return res;
    },
    refetchInterval: 5000,
  });

  // استخراج وضعیت is_auto از ریسپانس API (مانند چیزی که در کامپوننت پایش انجام شده)
  const fetchedIsAuto =
    typeof modeData === "object" && modeData !== null && "is_auto" in modeData
      ? modeData.is_auto
      : typeof modeData === "boolean"
      ? modeData
      : null;

  // اگر دیتا فچ شد از آن استفاده می‌کنیم، در غیر این صورت از پراپ والد
  const isAuto = fetchedIsAuto !== null ? fetchedIsAuto : parentIsAuto;

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  return (
    <Box
      sx={{
        width: "300px",
        height: "152px",
        borderRadius: "10px",
        border: "0.5px solid #9F9F9F",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        marginRight: "20px",
        marginLeft: "20px",
      }}
    >
      <Box
        className="top-box"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "152px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFCB82",
            width: "75px",
            height: "37px",
            borderRadius: "5px",
            border: "0.5px solid #9F9F9F",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          <Typography color="initial" fontFamily={"IRANSANS"}>
            زون {convert(zone)}
          </Typography>
        </Box>
        <Box
          className="icon-container"
          sx={{
            display: "flex",
            width: "260px",
            justifyContent: "space-between",
          }}
        >
          <img
            src={
              isAuto
                ? (fan1 ? assets.img.fan1GreenAn : assets.img.fan1RedAn)
                : (fan1 ? assets.img.fan1An : assets.img.fan1)
            }
            alt="fan1"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (pad ? assets.img.padGreenAn : assets.img.padRedAn)
                : (pad ? assets.img.padAN : assets.img.pad)
            }
            alt="pad"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (fan2 ? assets.img.fan2GreenAn : assets.img.fan2RedAn)
                : (fan2 ? assets.img.fan2An : assets.img.fan2)
            }
            alt="fan2"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (dariche ? assets.img.daricheGreenAn : assets.img.daricheRedAn)
                : (dariche ? assets.img.daricheAn : assets.img.dariche)
            }
            alt="dariche"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (mehpash ? assets.img.mehPashGreenAn : assets.img.mehPashRedAn)
                : (mehpash ? assets.img.mehPashAn : assets.img.mehPash)
            }
            alt="mehpash"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (bokhari ? assets.img.bokhariGreenAn : assets.img.bokhariRedAn)
                : (bokhari ? assets.img.bokhariAn : assets.img.bokhari)
            }
            alt="bokhari"
            width={"24px"}
          />
          <img
            src={
              isAuto
                ? (parde ? assets.img.pardeGreenAn : assets.img.pardeRedAn)
                : (parde ? assets.img.pardeAn : assets.img.parde)
            }
            alt="parde"
            width={"24px"}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {temp < 33 && <img src={assets.svg.inBlue} alt="" />}
            {33 <= temp && temp < 66 && <img src={assets.svg.inGreen} alt="" />}
            {66 <= temp && <img src={assets.svg.inRed} alt="" />}
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                width: "64px",
                justifyContent: "space-between",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                color="1e1e1e"
                fontSize={"14px"}
                mt={"6px"}
              >
                دما
              </Typography>
              <Box
                sx={{
                  width: "37px",
                  height: "28px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontFamily: "IRANSANS",
                  alignContent: "center",
                  fontSize: "14px",
                }}
              >
                {temp}
              </Box>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {hum < 33 && <img src={assets.svg.inBlue} alt="" />}
            {33 <= hum && hum < 66 && <img src={assets.svg.inGreen} alt="" />}
            {66 <= hum && <img src={assets.svg.inRed} alt="" />}
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                width: "85px",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                color="#1e1e1e"
                fontSize={"14px"}
                mt={"6px"}
              >
                رطوبت
              </Typography>
              <Box
                sx={{
                  width: "37px",
                  height: "28px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontFamily: "IRANSANS",
                  alignContent: "center",
                  fontSize: "14px",
                }}
              >
                {hum}
              </Box>
            </div>
          </div>
        </Box>
      </Box>
      {/* <Box className="bottom-box" sx={{ overflow: "hidden", display: "flex" }}>
        <Box
          sx={{
            width: "50%",
            height: "27px",
            border: "0.5px solid #9F9F9F",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          {convert(temp)}
        </Box>
        <Box
          sx={{
            width: "50%",
            height: "27px",
            border: "0.5px solid #9F9F9F",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          {convert(hum)}
        </Box>
      </Box> */}
    </Box>
  );
};
export default EghlimCard;
