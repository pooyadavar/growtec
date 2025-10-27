import {
  Container,
  Button,
  Box,
  Typography,
  Modal,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import * as React from "react";
import assets from "../../assets";

const Control = () => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  const [pomp, setPomp] = React.useState(1);
  const [selectedPomp, setSelectedPomp] = React.useState(0);

  const handlePompChange = (event) => {
    event.preventDefault();
    setSelectedPomp(event.target.value);
    setPomp(event.target.value);
  };
  const [zone, setZone] = React.useState(1);
  const [selectedZone, setSelectedZone] = React.useState(1);
  const handleZoneChange = (event) => {
    event.preventDefault();
    setSelectedZone(event.target.value);
    setZone(event.target.value);
  };
  const [type, setType] = React.useState(1);
  const [selectedType, setSelectedType] = React.useState(1);
  const handleTypeChange = (event) => {
    event.preventDefault();
    setSelectedType(event.target.value);
    setType(event.target.value);
  };
  const [createOpen, setCreateOpen] = React.useState(false);
  const handleCreateClose = () => setCreateOpen(false);
  const handleCreateOpen = () => setCreateOpen(true);
  const [clearOpen, setClearOpen] = React.useState(false);
  const handleClearClose = () => setClearOpen(false);
  const handleClearOpen = () => setClearOpen(true);
  const [injectionOpen, setInjectionOpen] = React.useState(false);
  const handleInjectionClose = () => setInjectionOpen(false);
  const handleInjectionOpen = () => setInjectionOpen(true);
  return (
    <Container
      sx={{
        width: "288px",
        height: "310px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0 10px 0",
        }}
      >
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            color: "#1E1E1E",
          }}
          onClick={handleCreateOpen}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>
            ساخت محلول دستی
          </Typography>
        </Button>
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            color: "#1E1E1E",
          }}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>تخلیه مخزن</Typography>
        </Button>
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            color: "#1E1E1E",
          }}
          onClick={handleInjectionOpen}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>تزریق دستی</Typography>
        </Button>
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            color: "#1E1E1E",
          }}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>میکسر</Typography>
        </Button>
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            color: "#1E1E1E",
          }}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>همزن</Typography>
        </Button>
        <Button
          sx={{
            width: "232px",
            height: "36px",
            borderRadius: "10px",
            border: "0.5px solid #CC0000",
            color: "#CC0000",
            bgcolor: "#FED9D9",
          }}
        >
          <Typography sx={{ fontFamily: "IRANSANS" }}>توقف</Typography>
        </Button>
      </div>
      <Modal
        className="injection-modal"
        disableAutoFocus
        open={injectionOpen}
        onClose={handleInjectionClose}
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
            width: "220px",
            height: "240px",
            boxShadow: 24,
            padding: "8px 8px 20px 8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            <Typography fontFamily={"IRANSANS"} fontSize={14}>
              تزریق دستی
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleInjectionClose}
            />
          </div>
          <div
            style={{
              width: "154px",
              height: "148px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                // border: "0.5px solid #004323",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="demo-simple-select-label-id"
                sx={{ color: "#004323", fontFamily: "IRANSANS" }}
              >
                دوزینگ پمپ ها
              </InputLabel>
              <Select
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
                value={selectedPomp}
                onChange={handlePompChange}
                inputProps={{ "aria-label": "Without label" }}
                labelId="select-zone-label"
                label="دوزینگ پمپ ها"
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
            <input
              id="volume-input"
              type="number"
              placeholder="حجم"
              min={1}
              max={10}
              style={{
                paddingRight: "4px",
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
              }}
            ></input>
            <Button
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                color="#004323"
              >
                تزریق
              </Typography>
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        className="create-modal"
        disableAutoFocus
        open={createOpen}
        onClose={handleCreateOpen}
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
            width: "220px",
            height: "314px",
            boxShadow: 24,
            padding: "8px 8px 40px 8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            <Typography fontFamily={"IRANSANS"} fontSize={14}>
              ساخت محلول دستی
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleCreateClose}
            />
          </div>
          <div
            style={{
              width: "154px",
              height: "196px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <input
              id="volume-input"
              type="number"
              placeholder="حجم"
              min={1}
              max={10}
              style={{
                paddingRight: "4px",
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
              }}
            ></input>
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="demo-simple-select-label-id"
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "18px",
                }}
              >
                زون
              </InputLabel>
              <Select
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
                value={selectedPomp}
                onChange={handlePompChange}
                inputProps={{ "aria-label": "Without label" }}
                labelId="select-zone-label"
                label="زون"
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
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="demo-simple-select-label-id"
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "18px",
                }}
              >
                نوع
              </InputLabel>
              <Select
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
                value={selectedType}
                onChange={handleTypeChange}
                inputProps={{ "aria-label": "Without label" }}
                labelId="select-type-label"
                label="نوع"
                id="select-type"
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
            <Button
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                color="#004323"
              >
                ساخت
              </Typography>
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
};

export default Control;
