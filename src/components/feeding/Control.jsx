import {
  Container,
  Box,
  Typography,
  Modal,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import * as React from "react";
import IconTextButton from "../../card/IconTextButton";
import assets from "../../assets";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useMutation } from "@tanstack/react-query";
import {
  makeManualSoluble,
  emptyingTank,
  manualInjection,
  controlMixer,
  controlStocksMixer,
  emergencyStop,
} from "../../api/solubleApi";
import toast from "react-hot-toast";

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
  const [injectionType, setInjectionType] = React.useState("stock");
  const [selectedPomp, setSelectedPomp] = React.useState(0);
  const [injectionVolume, setInjectionVolume] = React.useState(1);

  const handleInjectionVolumeChange = (event) => {
    setInjectionVolume(parseInt(event.target.value, 10));
  };

  const [isMixerOn, setIsMixerOn] = React.useState(false);
  const [isHemzanOn, setIsHemzanOn] = React.useState(false);

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

  const handleInjectionTypeChange = (event) => {
    setInjectionType(event.target.value);
  };

  const [volume, setVolume] = React.useState(1000);
  const handleVolumeChange = (event) => {
    setVolume(parseInt(event.target.value, 10));
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

  // --- استیت‌های مربوط به مودال کالیبراسیون جدید ---
  const [calibrationOpen, setCalibrationOpen] = React.useState(false);
  const [calibSelectedPump, setCalibSelectedPump] = React.useState(1);
  const [calibInjectedVolume, setCalibInjectedVolume] = React.useState("");

  const handleCalibrationClose = () => {
    setCalibrationOpen(false);
  };
  const handleCalibrationOpen = () => {
    setCalibrationOpen(true);
  };

  const [emptyStatusText, setEmptyStatusText] = React.useState("");

  const { mutate: emptyTankMutation } = useMutation({
    mutationFn: emptyingTank,
    onSuccess: (data, variables) => {
      toast.success(
        variables.status === "start" ? "تخلیه شروع شد" : "تخلیه پایان یافت",
      );
      handleClearClose();
    },
    onError: (error) => {
      console.error("Error in emptying tank:", error);
      toast.error("خطا در عملیات تخلیه");
    },
  });

  const { mutate: manualInjectionMutation } = useMutation({
    mutationFn: manualInjection,
    onSuccess: () => {
      toast.success("تزریق دستی با موفقیت انجام شد");
      handleInjectionClose();
    },
    onError: (error) => {
      console.error("Error during manual injection:", error);
      toast.error("خطا در تزریق دستی");
    },
  });

  const { mutate: makeManualSolubleMutation } = useMutation({
    mutationFn: makeManualSoluble,
    onSuccess: () => {
      toast.success("محلول با موفقیت ساخته شد");
      handleCreateClose();
    },
    onError: (error) => {
      console.error("Error creating manual soluble:", error);
      toast.error("خطا در ساخت محلول");
    },
  });

  const { mutate: controlMixerMutation } = useMutation({
    mutationFn: controlMixer,
    onSuccess: (data, variables) => {
      setIsMixerOn(variables.status === "on");
      toast.success(
        `میکسر ${variables.status === "on" ? "روشن شد" : "خاموش شد"}`,
      );
    },
    onError: (error) => {
      console.error("Error controlling mixer:", error);
      toast.error("خطا در کنترل میکسر");
    },
  });

  const { mutate: controlStocksMixerMutation } = useMutation({
    mutationFn: controlStocksMixer,
    onSuccess: (data, variables) => {
      setIsHemzanOn(variables.status === "on");
      toast.success(
        `همزن ${variables.status === "on" ? "روشن شد" : "خاموش شد"}`,
      );
    },
    onError: (error) => {
      console.error("Error controlling stocks mixer:", error);
      toast.error("خطا در کنترل همزن");
    },
  });

  const { mutate: emergencyStopMutation } = useMutation({
    mutationFn: emergencyStop,
    onSuccess: () => {
      toast.success("توقف اضطراری ارسال شد");
    },
    onError: (error) => {
      console.error("Error executing emergency stop:", error);
      toast.error("خطا در توقف اضطراری");
    },
  });

  const handleEmptyingSubmit = () => {
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
    emptyTankMutation(data);
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
          width="195px"
        />

        <IconTextButton
          text="تزریق دستی و کالیبره دوزینگ پمپ"
          icon={assets.svg.editicon}
          iconPosition="left"
          onClick={handleInjectionOpen}
          width="195px"
        />

        <IconTextButton
          text="میکسر"
          icon={assets.svg.mixericon}
          iconPosition="left"
          bgColor={isMixerOn ? "#B8FFDD" : "#FFFFFF"}
          textColor={isMixerOn ? "#004323" : "#1E1E1E"}
          borderColor={isMixerOn ? "#004323" : "#E0E0E0"}
          onClick={() => {
            const newStatus = isMixerOn ? "off" : "on";
            controlMixerMutation({ status: newStatus });
          }}
          width="195px"
        />

        <IconTextButton
          text="همزن"
          icon={assets.svg.clockicon}
          iconPosition="left"
          bgColor={isHemzanOn ? "#B8FFDD" : "#FFFFFF"}
          textColor={isHemzanOn ? "#004323" : "#1E1E1E"}
          borderColor={isHemzanOn ? "#004323" : "#E0E0E0"}
          onClick={() => {
            const newStatus = isHemzanOn ? "off" : "on";
            controlStocksMixerMutation({ status: newStatus });
          }}
          width="195px"
        />

        <IconTextButton
          text="توقف"
          icon={assets.svg.stopicon}
          iconPosition="left"
          bgColor="#FED9D9"
          textColor="#CC0000"
          borderColor="#CC0000"
          onClick={() => emergencyStopMutation()}
          width="195px"
        />
      </Stack>

      {/* مودال تزریق دستی */}
      <Modal
        className="injection-modal"
        disableAutoFocus
        open={injectionOpen}
        onClose={handleInjectionClose}
        aria-labelledby="modal-modal-title"
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
        >
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
                  labelId="select-pomp-label-id"
                  label="شماره دوزینگ پمپ"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                    <MenuItem
                      key={num}
                      value={num}
                      sx={{ fontFamily: "IRANSANS" }}
                    >
                      {convert(num)}
                    </MenuItem>
                  ))}
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
              onClick={() => {
                const data = {
                  dosing_pump: injectionType,
                  volume: injectionVolume,
                };
                if (injectionType === "stock") {
                  data.dosing_pump_number = selectedPomp;
                }
                manualInjectionMutation(data);
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
                "&:hover": { backgroundColor: "#a0eed0" },
              }}
            >
              تزریق
            </Button>

            <hr
              style={{
                border: "0.5px solid #9F9F9F",
                width: "100%",
                margin: "4px 0",
              }}
            />

            {/* دکمه باز کردن مودال کالیبراسیون */}
            <Button
              variant="contained"
              onClick={handleCalibrationOpen}
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
                "&:hover": { backgroundColor: "#a0eed0" },
              }}
            >
              کالیبراسیون
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* مودال ساخت دستی */}
      <Modal open={createOpen} onClose={handleCreateClose}>
        {/* این بخش همانطور که قبلا بود دست نخورده باقی ماند، برای جلوگیری از شلوغی اینجا کوتاه شده ولی شما کد قبلی را دارید */}
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
            p: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
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
          <Box
            style={{
              width: "154px",
              display: "flex",
              flexDirection: "column",
              gap: 17,
            }}
          >
            <input
              type="number"
              placeholder="حجم"
              min={1}
              max={10000}
              value={volume}
              onChange={handleVolumeChange}
              style={{
                paddingRight: "8px",
                width: "154px",
                height: "40px",
                borderRadius: "10px",
                border: "0.5px solid #9F9F9F",
                fontFamily: "IRANSANS",
                boxSizing: "border-box",
              }}
            />
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
                }}
              >
                زون
              </InputLabel>
              <Select
                value={selectedZone}
                onChange={handleZoneChange}
                label="زون"
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem
                    key={num}
                    value={num}
                    sx={{ fontFamily: "IRANSANS" }}
                  >
                    {convert(num)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: "154px",
                height: "40px",
                borderRadius: "10px",
                fontFamily: "IRANSANS",
              }}
            >
              <InputLabel
                sx={{
                  fontFamily: "IRANSANS",
                  fontSize: "14px",
                  lineHeight: "unset",
                }}
              >
                نوع
              </InputLabel>
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                label="نوع"
                sx={{
                  height: "40px",
                  fontFamily: "IRANSANS",
                  borderRadius: "10px",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem
                    key={num}
                    value={num}
                    sx={{ fontFamily: "IRANSANS" }}
                  >
                    {convert(num)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() =>
                makeManualSolubleMutation({
                  soluble_type: selectedType,
                  volume: volume,
                  zone: selectedZone,
                })
              }
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
              }}
            >
              ساخت
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* مودال تخلیه مخزن */}
      <Modal open={clearOpen} onClose={handleClearClose}>
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
            p: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
            fontFamily: "IRANSANS",
            p: 3,
          }}
        >
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
              src={assets.svg.close}
              alt="close"
              onClick={handleClearClose}
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
          </Box>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
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
                  width: "calc(100% - 40px)",
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
              <InputLabel sx={{ fontFamily: "IRANSANS" }}>زون</InputLabel>
              <Select
                value={selectedZone}
                onChange={handleZoneChange}
                label="زون"
                sx={{ fontFamily: "IRANSANS", textAlign: "right" }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem
                    key={num}
                    value={num}
                    sx={{ fontFamily: "IRANSANS" }}
                  >
                    {convert(num)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
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
              }}
            >
              تخلیه
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ========= مودال جدید کالیبراسیون دوزینگ پمپ بر اساس عکس ========= */}
      <Modal
        disableAutoFocus
        open={calibrationOpen}
        onClose={handleCalibrationClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px solid #E0E0E0",
            borderRadius: "15px",
            backgroundColor: "#FFFFFF",
            width: "280px",
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          {/* Header - مشابه عکس */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            <img
              src={assets.svg.close}
              alt="close"
              onClick={handleCalibrationClose}
              style={{ cursor: "pointer", width: "24px", height: "24px" }}
            />
            <Typography fontFamily={"IRANSANS"} fontSize={16} fontWeight="bold">
              کالیبراسیون دوزینگ پمپ
            </Typography>
          </Box>

          {/* Select: دوزینگ پمپ‌ها */}
          <FormControl sx={{ width: "70%" }}>
            <Select
              value={calibSelectedPump}
              onChange={(e) => setCalibSelectedPump(e.target.value)}
              displayEmpty
              sx={{
                fontFamily: "IRANSANS",
                borderRadius: "10px",
                textAlign: "center",
                "& .MuiSelect-select": { py: 1.5 },
              }}
            >
              <MenuItem disabled value="">
                <Typography fontFamily={"IRANSANS"}>دوزینگ پمپ‌ها</Typography>
              </MenuItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <MenuItem
                  key={num}
                  value={num}
                  sx={{ fontFamily: "IRANSANS", justifyContent: "center" }}
                >
                  {convert(num)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Button: تزریق */}
          <Button
            variant="contained"
            onClick={() =>
              console.log("Inject Clicked for pump", calibSelectedPump)
            }
            sx={{
              width: "70%",
              backgroundColor: "#B8FFDD",
              color: "#3c3c3c",
              borderRadius: "10px",
              fontFamily: "IRANSANS",
              fontSize: "18px",
              py: 1,
              boxShadow: "none",
              border: "1px solid #46735d",
              "&:hover": { backgroundColor: "#6BAE8E", boxShadow: "none" },
            }}
          >
            تزریق
          </Button>

          {/* Input: حجم تزریق شده */}
          <TextField
            placeholder="حجم تزریق شده"
            value={calibInjectedVolume}
            onChange={(e) => setCalibInjectedVolume(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontFamily: "IRANSANS",
                "& input": {
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                },
              },
              width: "70%",
            }}
          />

          {/* Button: تایید حجم تزریق شده */}
          <Button
            variant="contained"
            onClick={() => console.log("Confirm Clicked", calibInjectedVolume)}
            sx={{
              width: "70%",
              backgroundColor: "#B8FFDD",
              color: "#3c3c3c",
              borderRadius: "10px",
              fontFamily: "IRANSANS",
              fontSize: "18px",
              fontWeight: "bold",
              py: 1,
              boxShadow: "none",
              border: "1px solid #46735d",
              "&:hover": { backgroundColor: "#6BAE8E", boxShadow: "none" },
            }}
          >
            تایید حجم تزریق شده
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Control;

// =========================================================================
// Modal A: این همون مودال مخزن است که اشتباهی اینجا گذاشته بودی.
// کشیدمش بیرون. کپی کن و در همون فایلی که واقعاً بهش نیاز داری استفاده کن.
// =========================================================================

export const ModalA = ({ open, onClose }) => {
  const dummyCapacity = 50;
  const dummyMaxCapacity = 100;
  const float1 = true;
  const float2 = false;
  const float3 = false;
  const fillPercentage = Math.max(
    0,
    Math.min(100, (dummyCapacity / dummyMaxCapacity) * 100),
  );

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const [calibBtn1Disabled, setCalibBtn1Disabled] = React.useState(false);
  const [calibBtn2Disabled, setCalibBtn2Disabled] = React.useState(false);

  return (
    <Modal disableAutoFocus open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          width: "300px",
          height: "auto",
          boxShadow: 24,
          p: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography fontFamily={"IRANSANS"} fontSize={16} fontWeight="bold">
            کالیبراسیون سطح
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: "120px",
              height: "160px",
              borderRadius: "10px",
              border: "2px solid #9F9F9F",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: `${fillPercentage}%`,
                backgroundColor: "#2196F3",
                borderRadius: fillPercentage > 95 ? "8px" : "0 0 8px 8px",
                transition: "height 0.5s ease-in-out",
                opacity: 0.8,
              }}
            />
            <Typography
              fontFamily={"IRANSANS"}
              sx={{
                position: "absolute",
                top: "10px",
                fontSize: "14px",
                zIndex: 2,
                color: fillPercentage > 80 ? "#fff" : "#333",
              }}
            >
              مخزن
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                position: "absolute",
                right: "-12px",
                py: 2,
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "1px solid #9F9F9F",
                  backgroundColor: float3 ? "#00FF85" : "white",
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                }}
              />
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "1px solid #9F9F9F",
                  backgroundColor: float2 ? "#00FF85" : "white",
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                }}
              />
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "1px solid #9F9F9F",
                  backgroundColor: float1 ? "#00FF85" : "white",
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Box
              sx={{
                width: "60px",
                height: "24px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                border: "0.5px solid #9F9F9F",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography fontSize={"14px"} fontFamily={"IRANSANS"}>
                {convert(dummyCapacity)}
              </Typography>
            </Box>
            <Typography fontSize={14} pl={"6px"}>
              L
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", width: "100%", gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            disabled={calibBtn1Disabled}
            onClick={() => setCalibBtn1Disabled(true)}
            sx={{
              flex: 1,
              height: "40px",
              color: "#004323",
              backgroundColor: "#B8FFDD",
              borderRadius: "10px",
              border: "0.5px solid #004323",
              fontFamily: "IRANSANS",
            }}
          >
            عملیات ۱
          </Button>
          <Button
            variant="contained"
            disabled={calibBtn2Disabled}
            onClick={() => setCalibBtn2Disabled(true)}
            sx={{
              flex: 1,
              height: "40px",
              color: "#004323",
              backgroundColor: "#B8FFDD",
              borderRadius: "10px",
              border: "0.5px solid #004323",
              fontFamily: "IRANSANS",
            }}
          >
            عملیات ۲
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
