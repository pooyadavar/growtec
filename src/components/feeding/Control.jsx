import {
  Container,
  Box,
  Typography,
  Modal,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Stack, // از Stack برای چیدمان دکمه‌ها استفاده می‌کنیم
} from "@mui/material";
import * as React from "react";
// import assets from "../../assets"; // این دیگر استفاده نمی‌شود
import IconTextButton from "../../card/IconTextButton"; // ایمپورت دکمه جدید - مسیر اصلاح شد
import assets from "../../assets";

const Control = () => {
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    // ... existing code ...
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };
  const [pomp, setPomp] = React.useState(1);
  // ... existing code ...
  const [selectedPomp, setSelectedPomp] = React.useState(0);

  const handlePompChange = (event) => {
    // ... existing code ...
    event.preventDefault();
    setSelectedPomp(event.target.value);
    setPomp(event.target.value);
  };
  const [zone, setZone] = React.useState(1);
  // ... existing code ...
  const [selectedZone, setSelectedZone] = React.useState(1);
  const handleZoneChange = (event) => {
    // ... existing code ...
    event.preventDefault();
    setSelectedZone(event.target.value);
    setZone(event.target.value);
  };
  const [type, setType] = React.useState(1);
  // ... existing code ...
  const [selectedType, setSelectedType] = React.useState(1);
  const handleTypeChange = (event) => {
    // ... existing code ...
    event.preventDefault();
    setSelectedType(event.target.value);
    setType(event.target.value);
  };
  const [createOpen, setCreateOpen] = React.useState(false);
  const handleCreateClose = () => setCreateOpen(false);
  const handleCreateOpen = () => setCreateOpen(true);
  const [clearOpen, setClearOpen] = React.useState(false);
  // ... existing code ...
  const handleClearClose = () => setClearOpen(false);
  const handleClearOpen = () => setClearOpen(true);
  const [injectionOpen, setInjectionOpen] = React.useState(false);
  const handleInjectionClose = () => setInjectionOpen(false);
  const handleInjectionOpen = () => setInjectionOpen(true);
  return (
    <Container
    disableGutters
      sx={{
        ml:"-1px",
        pxadding: "5px",
        width: "180px",
        height: "auto", // ارتفاع اتوماتیک بر اساس محتوا
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        // boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        padding: "12px 10px", // پدینگ داخلی
      }}
    >
      {/* استفاده از Stack برای چیدمان عمودی دکمه‌ها با فاصله */}
      <Stack spacing={2}>
        <IconTextButton
          text="ساخت محلول دستی"
          icon={assets.svg.chemicalicon} // آیکون خود را جایگزین کنید
          iconPosition="right"
          onClick={handleCreateOpen}
        />

        <IconTextButton
          text="تخلیه مخزن"
          icon={assets.svg.watericon} 
          iconPosition="right"
          // onClick={() => {
          //   /* منطق تخلیه مخزن */
          // }}
        />

        <IconTextButton
          text="تزریق دستی"
          icon={assets.svg.editicon}
          iconPosition="right"
          onClick={handleInjectionOpen}
        />

        <IconTextButton
          text="میکسر"
          icon={assets.svg.mixericon}
          iconPosition="right"
          onClick={() => {
            /* منطق میکسر */
          }}
        />

        <IconTextButton
          text="همزن"
          icon={assets.svg.clockicon}
          iconPosition="right"
          onClick={() => {
            /* منطق همزن */
          }}
        />

        <IconTextButton
          text="توقف"
          icon={assets.svg.stopicon}
          iconPosition="right"
          bgColor="#FED9D9"
          textColor="#CC0000"
          borderColor="#CC0000"
          onClick={() => {
            /* منطق توقف */
          }}
        />
      </Stack>

      {/* مودال تزریق دستی (بدون تغییر در منطق، فقط آیکون بسته شدن) */}
      <Modal
        // ... existing code ...
        className="injection-modal"
        disableAutoFocus
        open={injectionOpen}
        onClose={handleInjectionClose}
        // ... existing code ...
        aria-describedby="modal-modal-description"
      >
        <Box
          // ... existing code ...
          sx={{
            position: "absolute",
            // ... existing code ...
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            // ... existing code ...
            width: "220px",
            height: "240px",
            boxShadow: 24,
            // ... existing code ...
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="modalBox"
        >
          <div
            // ... existing code ...
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
icon={assets.svg.icon} 
              alt="close"
              onClick={handleInjectionClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </div>
          <div
            // ... existing code ...
            style={{
              width: "154px",
              // ... existing code ...
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <FormControl
              // ... existing code ...
              sx={{
                width: "154px",
                // ... existing code ...
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                // border: "0.5px solid #004323",
                // ... existing code ...
              }}
            >
              <InputLabel
                // ... existing code ...
                id="demo-simple-select-label-id"
                sx={{ color: "#004323", fontFamily: "IRANSANS" }}
              >
                // ... existing code ...
              </InputLabel>
              <Select
                // ... existing code ...
                sx={{
                  height: "40px",
                  // ... existing code ...
                }}
                value={selectedPomp}
                onChange={handlePompChange}
                // ... existing code ...
                labelId="select-zone-label"
                label="دوزینگ پمپ ها"
                id="select-zone"
              >
                <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
              </Select>
            </FormControl>
            <input
              // ... existing code ...
              id="volume-input"
              type="number"
              // ... existing code ...
              min={1}
              max={10}
              style={{
                // ... existing code ...
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                // ... existing code ...
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
              }}
            ></input>
            <button // استفاده از Button معمولی mui
              sx={{
                // ... existing code ...
                width: "154px",
                height: "40px",
                // ... existing code ...
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
              }}
            >
              <Typography
                // ... existing code ...
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                // ... existing code ...
              >
                تزریق
              </Typography>
            </button>
          </div>
        </Box>
      </Modal>

      {/* مودال ساخت دستی (بدون تغییر در منطق، فقط آیکون بسته شدن) */}
      <Modal
        // ... existing code ...
        className="create-modal"
        disableAutoFocus
        open={createOpen}
        onClose={handleCreateClose} // <-- اینجا قبلاً اشتباه بود، باید handleCreateClose باشد
        aria-labelledby="modal-modal-title"
        // ... existing code ...
      >
        <Box
          // ... existing code ...
          sx={{
            position: "absolute",
            // ... existing code ...
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            // ... existing code ...
            width: "220px",
            height: "314px",
            boxShadow: 24,
            // ... existing code ...
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // ... existing code ...
          }}
          className="modalBox"
        >
          <div
            // ... existing code ...
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
icon={assets.svg.icon} 
              alt="close"
              onClick={handleCreateClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </div>
          <div
            // ... existing code ...
            style={{
              width: "154px",
              height: "196px",
              // ... existing code ...
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <input
              // ... existing code ...
              id="volume-input"
              type="number"
              // ... existing code ...
              min={1}
              max={10}
              style={{
                // ... existing code ...
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                // ... existing code ...
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
              }}
            ></input>
            <FormControl
              // ... existing code ...
              sx={{
                width: "154px",
                // ... existing code ...
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                // ... existing code ...
              }}
            >
              <InputLabel
                // ... existing code ...
                id="demo-simple-select-label-id"
                sx={{
                  // ... existing code ...
                  fontFamily: "IRANSANS",
                  fontSize: "18px",
                }}
                // ... existing code ...
              >
                زون
              </InputLabel>
              <Select
                // ... existing code ...
                sx={{
                  height: "40px",
                  // ... existing code ...
                }}
                value={selectedZone} // <-- اینجا باید selectedZone باشد
                onChange={handleZoneChange} // <-- اینجا باید handleZoneChange باشد
                inputProps={{ "aria-label": "Without label" }}
                // ... existing code ...
                label="زون"
                id="select-zone"
              >
                <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              // ... existing code ...
              sx={{
                width: "154px",
                // ... existing code ...
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                // ... existing code ...
              }}
            >
              <InputLabel
                // ... existing code ...
                id="demo-simple-select-label-id"
                sx={{
                  // ... existing code ...
                  fontFamily: "IRANSANS",
                  fontSize: "18px",
                }}
                // ... existing code ...
              >
                نوع
              </InputLabel>
              <Select
                // ... existing code ...
                sx={{
                  height: "40px",
                  // ... existing code ...
                }}
                value={selectedType}
                onChange={handleTypeChange}
                // ... existing code ...
                labelId="select-type-label"
                label="نوع"
                id="select-type"
              >
                <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
                <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                  // ... existing code ...
                </MenuItem>
              </Select>
            </FormControl>
            <button // استفاده از Button معمولی mui
              sx={{
                // ... existing code ...
                width: "154px",
                height: "40px",
                // ... existing code ...
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
              }}
            >
              <Typography
                // ... existing code ...
                fontFamily={"IRANSANS"}
                fontSize={18}
                textAlign={"center"}
                // ... existing code ...
              >
                ساخت
              </Typography>
            </button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
};

export default Control;
