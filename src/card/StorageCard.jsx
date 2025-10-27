import * as React from "react";
import {
  Typography,
  Box,
  Modal,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import assets from "../assets/index";
import StorageStatus from "./StorageStatus";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "0.5px solid #9F9F9F",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  width: "393px",
  height: "470px",
  boxShadow: 24,
  p: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const StorageCard = ({ storage, zone, capacity, float1, float2, float3 }) => {

  let waterHeight = 100 - capacity;
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const image = `url(${assets.img.mixerBGImage})`;
  const [zonee, setZonee] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [selectedZone, setSelectedZone] = React.useState(1);

  const handleZoneChange = (event) => {
    event.preventDefault();
    setSelectedZone(event.target.value);
    setZonee(event.target.value);
  };

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
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            width: "393px",
            height: "470px",
            boxShadow: 24,
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="modalBox"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                fontFamily={"IRANSANS"}
                fontSize={"16px"}
              >
                وضعیت آبیاری زون
              </Typography>
              <FormControl
                sx={{ width: "60px", height: "24px", fontFamily: "IRANSANS" }}
              >
                <Select
                  sx={{ height: "24px", fontFamily: "IRANSANS" }}
                  value={selectedZone}
                  onChange={handleZoneChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="select-zone-label"
                  id="select-zone"
                >
                  <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(1)}
                  </MenuItem>
                  <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(2)}
                  </MenuItem>
                  <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(3)}
                  </MenuItem>
                  <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(4)}
                  </MenuItem>
                  <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(5)}
                  </MenuItem>
                  <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(6)}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <img src={assets.svg.close} alt="close" onClick={handleClose} />
          </div>
          <div
            style={{
              width: "330px",
              marginTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "86px",
                height: "24px",
                backgroundColor: "#FFCB82",
                borderRadius: "5px",
                border: "0.5px solid #9F9F9F",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={"10px"}
                textAlign={"center"}
              >
                شروع آبیاری
              </Typography>
            </div>
            <div
              style={{
                width: "86px",
                height: "24px",
                backgroundColor: "#FFCB82",
                borderRadius: "5px",
                border: "0.5px solid #9F9F9F",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={"10px"}
                textAlign={"center"}
              >
                پایان آبیاری
              </Typography>
            </div>
            <div
              style={{
                width: "86px",
                height: "24px",
                backgroundColor: "#FFCB82",
                borderRadius: "5px",
                border: "0.5px solid #9F9F9F",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={"10px"}
                textAlign={"center"}
              >
                حجم آبیاری
              </Typography>
            </div>
            <div style={{ width: "24px", height: "24px" }}>
              <Typography></Typography>
            </div>
          </div>
          <Box
            className="statusBox"
            sx={{
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            {/* {storageTimeLine[zonee - 1].map((obj) => (
              <StorageStatus
                start={obj.start}
                end={obj.end}
                size={obj.size}
                status={obj.status}
              />
            ))} */}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StorageCard;
