import { Box, Typography } from "@mui/material";
import assets from "../assets";

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
            src={fan1 ? assets.img.fan1An : assets.img.fan1}
            alt=""
            width={"24px"}
          />
          <img
            src={pad ? assets.img.padAN : assets.img.pad}
            alt=""
            width={"24px"}
          />
          <img
            src={fan2 ? assets.img.fan2An : assets.img.fan2}
            alt=""
            width={"24px"}
          />
          <img
            src={dariche ? assets.img.daricheAn : assets.img.dariche}
            alt=""
            width={"24px"}
          />
          <img
            src={mehpash ? assets.img.mehPashAn : assets.img.mehPash}
            alt=""
            width={"24px"}
          />
          <img
            src={bokhari ? assets.img.bokhariAn : assets.img.bokhari}
            alt=""
            width={"24px"}
          />
          <img
            src={parde ? assets.img.pardeAn : assets.img.parde}
            alt=""
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
