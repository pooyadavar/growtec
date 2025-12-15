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
import {
  makeManualSoluble,
  emptyingTank,
  manualInjection,
  controlMixer,
  controlStocksMixer,
  emergencyStop, // Import the new API function
} from "../../api/solubleApi"; // Import the new API function
import toast from "react-hot-toast";

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
  const [injectionType, setInjectionType] = React.useState("stock");
  const [selectedPomp, setSelectedPomp] = React.useState(0);
  const [injectionVolume, setInjectionVolume] = React.useState(1); // New state for injection volume

  const handleInjectionVolumeChange = (event) => {
    setInjectionVolume(parseInt(event.target.value, 10));
  };

  // Toggle states for buttons
  const [isMixerOn, setIsMixerOn] = React.useState(false);
  const [isHemzanOn, setIsHemzanOn] = React.useState(false);

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

  const handleInjectionTypeChange = (event) => {
    setInjectionType(event.target.value);
  };

  const [volume, setVolume] = React.useState(1000); // State for volume
  const handleVolumeChange = (event) => {
    setVolume(parseInt(event.target.value, 10));
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

  const [emptyStatusText, setEmptyStatusText] = React.useState("");

  const handleEmptyingSubmit = async () => {
    let status = "";
    if (emptyStatusText === "آغاز") status = "start";
    else if (emptyStatusText === "تمام") status = "finish";
    else {
      toast.error("لطفا وضعیت (آغاز یا تمام) را مشخص کنید");
      return;
    }

    const data = {
      status: status,
      zone: selectedZone,
    };
    try {
      await emptyingTank(data);
      toast.success(status === "start" ? "تخلیه شروع شد" : "تخلیه پایان یافت");
      handleClearClose();
    } catch (error) {
      console.error("Error in emptying tank:", error);
      toast.error("خطا در عملیات تخلیه");
    }
  };
  return (
    <Container
      disableGutters
      sx={{
        width: "250px",
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
          width="195px"
        />

        <IconTextButton
          text="تخلیه مخزن"
          icon={assets.svg.watericon}
          iconPosition="left"
          onClick={handleClearOpen}
          width="195px"     />

        <IconTextButton
          text="تزریق دستی"
          icon={assets.svg.editicon}
          iconPosition="left"
          onClick={handleInjectionOpen}
          width="195px"      />

        <IconTextButton
          text="میکسر"
          icon={assets.svg.mixericon}
          iconPosition="left"
          bgColor={isMixerOn ? "#B8FFDD" : "#FFFFFF"}
          textColor={isMixerOn ? "#004323" : "#1E1E1E"}
          borderColor={isMixerOn ? "#004323" : "#E0E0E0"}
          onClick={async () => {
            const newStatus = isMixerOn ? "off" : "on";
            const data = { status: newStatus };
            try {
              await controlMixer(data);
              setIsMixerOn(!isMixerOn); // Toggle state only on success
              toast.success(`میکسر ${newStatus === "on" ? "روشن شد" : "خاموش شد"}`);
            } catch (error) {
              console.error("Error controlling mixer:", error);
              toast.error("خطا در کنترل میکسر");
            }
          }}
          width="195px"     />

        <IconTextButton
          text="همزن"
          icon={assets.svg.clockicon}
          iconPosition="left"
          bgColor={isHemzanOn ? "#B8FFDD" : "#FFFFFF"}
          textColor={isHemzanOn ? "#004323" : "#1E1E1E"}
          borderColor={isHemzanOn ? "#004323" : "#E0E0E0"}
          onClick={async () => {
            const newStatus = isHemzanOn ? "off" : "on";
            const data = { status: newStatus };
            try {
              await controlStocksMixer(data);
              setIsHemzanOn(!isHemzanOn); // Toggle state only on success
              toast.success(`همزن ${newStatus === "on" ? "روشن شد" : "خاموش شد"}`);
            } catch (error) {
              console.error("Error controlling stocks mixer:", error);
              toast.error("خطا در کنترل همزن");
            }
          }}
          width="195px"      />

        <IconTextButton
          text="توقف"
          icon={assets.svg.stopicon}
          iconPosition="left"
          bgColor="#FED9D9"
          textColor="#CC0000"
          borderColor="#CC0000"
          onClick={async () => {
            try {
              await emergencyStop();
              toast.success("توقف اضطراری ارسال شد");
            } catch (error) {
              console.error("Error executing emergency stop:", error);
              toast.error("خطا در توقف اضطراری");
            }
          }}
          width="195px"      />
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
            {/* 2. سلکت باکس جدید برای انتخاب نوع (اسید/استوک) */}
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
                id="select-type-label-id"
                sx={{
                  color: "#004323",
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
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
                value={injectionType}
                onChange={handleInjectionTypeChange}
                labelId="select-type-label-id"
                label="نوع"
                id="select-type"
              >
                <MenuItem value="stock" sx={{ fontFamily: "IRANSANS" }}>
                  استوک
                </MenuItem>
                <MenuItem value="acid" sx={{ fontFamily: "IRANSANS" }}>
                  اسید
                </MenuItem>
              </Select>
            </FormControl>

            {/* 3. شرط نمایش دوزینگ پمپ: فقط اگر استوک انتخاب شده باشد نشان بده */}
            {injectionType === "stock" && (
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
                  شماره دوزینگ پمپ
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
                  label="شماره دوزینگ پمپ"
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
                  <MenuItem value={7} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(7)}
                  </MenuItem>
                  <MenuItem value={8} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(8)}
                  </MenuItem>
                  <MenuItem value={9} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(9)}
                  </MenuItem>
                  <MenuItem value={10} sx={{ fontFamily: "IRANSANS" }}>
                    {convert(10)}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            <input
              id="volume-input-injection"
              type="number"
              placeholder="حجم"
              min={1}
              max={10}
              value={injectionVolume}
              onChange={handleInjectionVolumeChange}
              style={{
                paddingRight: "8px",
                width: "154px",
                height: "40px",
                color: "#1e1e1e",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
                boxSizing: "border-box",
              }}
            ></input>

            <Button
              variant="contained"
              onClick={async () => {
                const data = {
                  dosing_pump: injectionType, // "stock" or "acid"
                  volume: injectionVolume,
                };

                // Only add dosing_pump_number if injectionType is 'stock'
                if (injectionType === "stock") {
                  data.dosing_pump_number = selectedPomp;
                } else {
                  // If 'acid' is selected, ensure dosing_pump_number is not sent or is null
                  // Depending on backend, either omit or set to null/0. Omitting is generally safer.
                }

                try {
                  const response = await manualInjection(data);
                  console.log("Manual injection successful:", response);
                  toast.success("تزریق دستی با موفقیت انجام شد");
                  handleInjectionClose();
                } catch (error) {
                  console.error("Error during manual injection:", error);
                  toast.error("خطا در تزریق دستی");
                }
              }}
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
                  backgroundColor: "#a0eed0",
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
              max={10000} // Increased max for better flexibility
              value={volume}
              onChange={handleVolumeChange}
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
              onClick={async () => {
                const data = {
                  soluble_type: selectedType,
                  volume: volume,
                  zone: selectedZone,
                };
                try {
                  const response = await makeManualSoluble(data);
                  console.log("Manual soluble creation successful:", response);
                  toast.success("محلول با موفقیت ساخته شد");
                  handleCreateClose();
                } catch (error) {
                  console.error("Error creating manual soluble:", error);
                  toast.error("خطا در ساخت محلول");
                }
              }}
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
            p: 3,
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
                value={emptyStatusText}
                onChange={(e) => setEmptyStatusText(e.target.value)}
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
                  onClick={() => setEmptyStatusText("آغاز")}
                  sx={{
                    color: "green",
                    fontSize: "22px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                />
                <HighlightOffIcon
                  onClick={() => setEmptyStatusText("تمام")}
                  sx={{
                    color: "red",
                    fontSize: "22px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                    cursor: "pointer",
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
              onClick={handleEmptyingSubmit}
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
