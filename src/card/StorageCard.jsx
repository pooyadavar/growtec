import * as React from "react";
import {
  Typography,
  Box,
  Modal,
} from "@mui/material";
import assets from "../assets/index";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  width: "393px",
  height: "auto", 
  minHeight: "250px",
  boxShadow: 24,
  p: "8px",
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
  let waterHeight = 95 - (capacity / maxCapacity *100)
  if (isNaN(waterHeight) || !isFinite(waterHeight)) {
    waterHeight = 100;
  }
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = String(num); 
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const image = `url(${assets.img.mixerBGImage})`;

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

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
            زون {convert(zone)}
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
          }}
          onClick={handleOpen}
        >
          <Typography fontFamily={"IRANSANS"} sx={{ fontSize: "14px" }}>
            مخزن {convert(zone)}
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
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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
            {capacity}
          </Typography>
        </Box>
        <Typography color="initial" fontSize={14} pl={"6px"}>
          {" "}
          L{" "}
        </Typography>
      </Box>


      <Modal
        disableAutoFocus
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style} 
          className="modalBox"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              fontFamily={"IRANSANS"}
              fontSize={"16px"}
              mr={1}
            >
              وضعیت مخزن زون {convert(zone)} 
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleClose}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default StorageCard;