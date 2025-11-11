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
  Button,
  TextField,
} from "@mui/material";
import * as React from "react";
import IconTextButton from "../../card/IconTextButton"; // ایمپورت دکمه جدید - مسیر اصلاح شد
import assets from "../../assets";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

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
        width: "175px",
        height: "auto", 
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        padding: "12px 10px", 
      }}
    >
      {/* استفاده از Stack برای چیدمان عمودی دکمه‌ها با فاصله */}
      <Stack spacing={2}>
        <IconTextButton
          text="ساخت محلول دستی"
          icon={assets.svg.chemicalicon}
          iconPosition="left"
          onClick={handleCreateOpen}
          width="120px"
        />

        <IconTextButton
          text="تخلیه مخزن"
          icon={assets.svg.watericon}
          iconPosition="left"
          onClick={handleClearOpen}
          width="120px"
        />

        <IconTextButton
          text="تزریق دستی"
          icon={assets.svg.editicon}
          iconPosition="left"
          onClick={handleInjectionOpen}
          width="120px"
        />

        <IconTextButton
          text="میکسر"
          icon={assets.svg.mixericon}
          iconPosition="left"
          onClick={() => {
            /* منطق میکسر */
          }}
          width="120px"
        />

        <IconTextButton
          text="همزن"
          icon={assets.svg.clockicon}
          iconPosition="left"
          onClick={() => {
            /* منطق همزن */
          }}
          width="120px"
        />

        <IconTextButton
          text="توقف"
          icon={assets.svg.stopicon}
          iconPosition="left"
          bgColor="#FED9D9"
          textColor="#CC0000"
          borderColor="#CC0000"
          onClick={() => {
            /* منطق توقف */
          }}
          width="120px"
        />
      </Stack>

      {/* مودال تزریق دستی (بدون تغییر در منطق، فقط آیکون بسته شدن) */}
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
            height: "auto",
            boxShadow: 24,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
          className="modalBox"
        >
          {/* هدر مودال */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={14} fontWeight="bold">
              تزریق دستی
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleInjectionClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </Box>

          {/* بدنه مودال */}
          <Box
            style={{
              width: "154px",
              height: "auto", 
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 17,
            }}
          >
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="select-pomp-label-id" 
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "14px", 
                  lineHeight: "unset",
                }}
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
                labelId="select-pomp-label-id"
                label="دوزینگ پمپ ها"
                id="select-pomp"
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
              id="volume-input-injection" // [اصلاح شد] - ID باید منحصر به فرد باشد
              type="number"
              placeholder="حجم"
              min={1}
              max={10}
              style={{
                paddingRight: "8px", // [اصلاح شد]
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
                boxSizing: "border-box", // [جدید]
              }}
            ></input>

            {/* [اصلاح شد] - تبدیل به دکمه MUI */}
            <Button
              variant="contained"
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
                fontFamily: "IRANSANS",
                fontSize: 18,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#a0eed0", // رنگ هاور ملایم
                },
              }}
            >
              تزریق
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* مودال ساخت دستی (بدون تغییر در منطق، فقط آیکون بسته شدن) */}
      <Modal
        className="create-modal"
        disableAutoFocus
        open={createOpen}
        onClose={handleCreateClose} // [اصلاح شد] - باید تابع بستن را صدا بزند
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
            height: "auto", // [اصلاح شد] - ارتفاع خودکار بر اساس محتوا
            boxShadow: 24,
            padding: "16px", // [اصلاح شد] - پدینگ یکنواخت
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2, // [اصلاح شد] - فاصله بین عناصر
          }}
          className="modalBox"
        >
          {/* هدر مودال */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={14} fontWeight="bold">
              ساخت محلول دستی
            </Typography>
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleCreateClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </Box>

          {/* بدنه مودال */}
          <Box
            style={{
              width: "154px",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 17,
            }}
          >
            <input
              id="volume-input"
              type="number"
              placeholder="حجم"
              min={1}
              max={10}
              style={{
                paddingRight: "8px", // [اصلاح شد]
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
                boxSizing: "border-box", // [جدید] - برای جلوگیری از سرریز
              }}
            ></input>

            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="select-zone-label-id" // [اصلاح شد] - ID باید منحصر به فرد باشد
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "14px", // [اصلاح شد] - فونت کوچکتر
                  lineHeight: "unset", // [جدید]
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
                value={selectedZone} // [اصلاح شد] - باید selectedZone باشد
                onChange={handleZoneChange} // [اصلاح شد] - باید handleZoneChange باشد
                inputProps={{ "aria-label": "Without label" }}
                labelId="select-zone-label-id" // [اصلاح شد]
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
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                id="select-type-label-id" // [اصلاح شد] - ID باید منحصر به فرد باشد
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "14px", // [اصلاح شد]
                  lineHeight: "unset", // [جدید]
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
                labelId="select-type-label-id" // [اصلاح شد]
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
              variant="contained"
              sx={{
                width: "154px",
                height: "40px",
                color: "#004323",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "0.5px solid #004323",
                fontFamily: "IRANSANS",
                fontSize: 18,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#a0eed0", // رنگ هاور ملایم
                },
              }}
            >
              ساخت
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ========= [جدید] - مودال تخلیه مخزن ========= */}
      <Modal
        className="clear-modal"
        disableAutoFocus
        open={clearOpen}
        onClose={handleClearClose}
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
            width: "280px", 
            height: "auto",
            boxShadow: 24,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5, 
            fontFamily: "IRANSANS",
            p:3,
          }}
          className="modalBox"
        >
          {/* هدر مودال */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={16} fontWeight="bold">
              تخلیه دستی مخزن
            </Typography>
            <img
              src={assets.svg.close} // فرض می‌کنیم آیکون بستن شما در این مسیر است
              alt="close"
              onClick={handleClearClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </Box>

          {/* بدنه مودال */}
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* ردیف اول: تیک‌ها و ورودی */}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                variant="outlined"
                sx={{
                  width: "calc(100% - 40px)", // عرض تطبیقی
                  height: "50px",
                  "& .MuiOutlinedInput-root": {
                    height: "70px",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  },
                }}
              />
              <Stack spacing={0.25}>
                <CheckCircleOutlineIcon
                  sx={{
                    color: "green",
                    fontSize: "22px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                  }}
                />
                <HighlightOffIcon
                  sx={{
                    color: "red",
                    fontSize: "22px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                  }}
                />
              </Stack>
            </Box>

            {/* ردیف دوم: انتخاب‌گر زون */}
            <FormControl
              variant="outlined"
              sx={{
                width: "100%",
                height: "56px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "56px",
                  fontFamily: "IRANSANS",
                },
              }}
            >
              <InputLabel id="clear-zone-label" sx={{ fontFamily: "IRANSANS" }}>
                زون
              </InputLabel>
              <Select
                labelId="clear-zone-label"
                value={selectedZone}
                onChange={handleZoneChange}
                label="زون"
                sx={{
                  fontFamily: "IRANSANS",
                  textAlign: "right", // متن در سمت راست
                  "& .MuiSelect-icon": {
                    left: 7, // آیکون در سمت چپ
                    right: "auto",
                  },
                }}
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

            {/* ردیف سوم: دکمه تخلیه */}
            <Button
              variant="outlined" // دکمه فقط با کادر
              sx={{
                width: "100%",
                height: "56px",
                color: "#000000",
                backgroundColor: "#B8FFDD",
                borderRadius: "10px",
                border: "1px solid #9F9F9F",
                fontFamily: "IRANSANS",
                fontSize: 18,   
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  border: "1px solid #000000",
                },
              }}
            >
              تخلیه
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Control;
