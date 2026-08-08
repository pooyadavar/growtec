import { Box, Typography } from "@mui/material";
import imgFan1GreenAnAsset from "../assets/image/ICONS/fan1Green.png";
import imgColorGreenFan1Asset from "../assets/image/COLOR-ICONS/green-icons/fan1.png";
import imgFan1AnAsset from "../assets/image/ICONS/fan1.png";
import imgFan1Asset from "../assets/image/ICONS/Fan/fan3.png";
import imgPadGreenAnAsset from "../assets/image/ICONS/padGreen.png";
import imgColorGreenPadAsset from "../assets/image/COLOR-ICONS/green-icons/پد سلولزی.png";
import imgPadANAsset from "../assets/image/ICONS/پد سلولزی.png";
import imgPadAsset from "../assets/image/ICONS/پد سلولزی/mesh.png";
import imgFan2GreenAnAsset from "../assets/image/ICONS/fan2Green.png";
import imgColorGreenFan2Asset from "../assets/image/COLOR-ICONS/green-icons/fan2.png";
import imgFan2AnAsset from "../assets/image/ICONS/fan2.png";
import imgFan2Asset from "../assets/image/ICONS/Fan2/fan.png";
import imgDaricheGreenAnAsset from "../assets/image/ICONS/daricheGreen.png";
import imgColorGreenDaricheAsset from "../assets/image/COLOR-ICONS/green-icons/دریچه سقفی.png";
import imgDaricheAnAsset from "../assets/image/ICONS/دریچه سقفی.png";
import imgDaricheAsset from "../assets/image/ICONS/دریچه سقفی/window5.png";
import imgMehPashGreenAnAsset from "../assets/image/ICONS/mehpashGreen.png";
import imgColorGreenMehPashAsset from "../assets/image/COLOR-ICONS/green-icons/مه پاش.png";
import imgMehPashAnAsset from "../assets/image/ICONS/مه پاش.png";
import imgMehPashAsset from "../assets/image/ICONS/مه پاش/sprinkler4.png";
import imgBokhariGreenAnAsset from "../assets/image/ICONS/bokhariGreen.png";
import imgColorGreenBokhariAsset from "../assets/image/COLOR-ICONS/green-icons/بخاری.png";
import imgBokhariAnAsset from "../assets/image/ICONS/بخاری.png";
import imgBokhariAsset from "../assets/image/ICONS/بخاری/blaze.png";
import imgPardeGreenAnAsset from "../assets/image/ICONS/pardehGreen.png";
import imgColorGreenPardeAsset from "../assets/image/COLOR-ICONS/green-icons/پرده شید.png";
import imgPardeAnAsset from "../assets/image/ICONS/پرده شید.png";
import imgPardeAsset from "../assets/image/ICONS/پرده شید/curtain.png";
import svgInBlueAsset from "../assets/svg/inBlue.svg";
import svgInGreenAsset from "../assets/svg/inGreen.svg";
import svgInRedAsset from "../assets/svg/inRed.svg";
import { useQuery } from "@tanstack/react-query";
import { getOperatorMode } from "../api/climateApi";
import { queryKeys } from "../api/queryKeys";
import { toPersianDigits } from "../utils/persianDigits";

const EghlimCard = ({
  zone,
  temp,
  hum,
  temperatureRange,
  humidityRange,
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
    queryKey: queryKeys.operatorModeEghlim(zone),
    queryFn: () => getOperatorMode(zone),
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

  const getDeviceIcon = (isOn, greenAn, colorGreen, manualOn, manualOff) =>
    isAuto ? (isOn ? greenAn : colorGreen) : isOn ? manualOn : manualOff;

  const getRangeIcon = (value, minimum, maximum) => {
    const numericValue = Number(value);
    const numericMin = Number(minimum);
    const numericMax = Number(maximum);

    if (Number.isFinite(numericMin) && numericValue < numericMin) {
      return svgInBlueAsset;
    }

    if (Number.isFinite(numericMax) && numericValue > numericMax) {
      return svgInRedAsset;
    }

    if (Number.isFinite(numericMin) && Number.isFinite(numericMax)) {
      return svgInGreenAsset;
    }

    if (numericValue < 33) return svgInBlueAsset;
    if (numericValue < 66) return svgInGreenAsset;
    return svgInRedAsset;
  };

  const tempIcon = getRangeIcon(
    temp,
    temperatureRange?.minimum_temperature,
    temperatureRange?.maximum_temperature,
  );
  const humIcon = getRangeIcon(
    hum,
    humidityRange?.minimum_humidity,
    humidityRange?.maximum_humidity,
  );

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
            زون {toPersianDigits(zone)}
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
            src={getDeviceIcon(
              fan1,
              imgFan1GreenAnAsset,
              imgColorGreenFan1Asset,
              imgFan1AnAsset,
              imgFan1Asset,
            )}
            alt="fan1"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              pad,
              imgPadGreenAnAsset,
              imgColorGreenPadAsset,
              imgPadANAsset,
              imgPadAsset,
            )}
            alt="pad"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              fan2,
              imgFan2GreenAnAsset,
              imgColorGreenFan2Asset,
              imgFan2AnAsset,
              imgFan2Asset,
            )}
            alt="fan2"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              dariche,
              imgDaricheGreenAnAsset,
              imgColorGreenDaricheAsset,
              imgDaricheAnAsset,
              imgDaricheAsset,
            )}
            alt="dariche"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              mehpash,
              imgMehPashGreenAnAsset,
              imgColorGreenMehPashAsset,
              imgMehPashAnAsset,
              imgMehPashAsset,
            )}
            alt="mehpash"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              bokhari,
              imgBokhariGreenAnAsset,
              imgColorGreenBokhariAsset,
              imgBokhariAnAsset,
              imgBokhariAsset,
            )}
            alt="bokhari"
            width={"24px"}
          />
          <img
            src={getDeviceIcon(
              parde,
              imgPardeGreenAnAsset,
              imgColorGreenPardeAsset,
              imgPardeAnAsset,
              imgPardeAsset,
            )}
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
            <img src={tempIcon} alt="" />
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
                {toPersianDigits(temp)}
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
            <img src={humIcon} alt="" />
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
                {toPersianDigits(hum)}
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
