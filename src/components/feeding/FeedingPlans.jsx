import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  Modal,
  Box,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import assets from "../../assets";

const PlanRow = ({ id, onDelete, canBeDeleted, convert }) => {
  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [volume, setVolume] = useState("");

  const handleZoneChange = (event) => setZone(event.target.value);
  const handleTypeChange = (event) => setType(event.target.value);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "10px", // فاصله بین ردیف‌ها
      }}
    >
      {/* دکمه حذف */}
      <Box sx={{ width: "100px" }}>
        <Button
          variant="text"
          onClick={onDelete}
          disabled={!canBeDeleted} // اگر تنها ردیف باشد، غیرفعال می‌شود
          sx={{
            backgroundColor: "#FED9D9",
            border: "0.5px solid #CC0000",
            borderRadius: "10px",
            width: "100px",
            height: "60px",
            color: "#CC0000",
            opacity: canBeDeleted ? 1 : 0.5, // کم‌رنگ شدن دکمه غیرفعال
            mt: "25px",
          }}
        >
          <Typography color="inherit" fontFamily={"IRANSANS"} fontSize={18}>
            حذف
          </Typography>
        </Button>
      </Box>

      {/* وضعیت (باکس خالی) */}
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          وضعیت
        </Typography>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            width: "100px",
            height: "60px",
          }}
        ></Box>
      </Box>

      {/* زون */}
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          زون
        </Typography>
        <FormControl
          sx={{
            width: "100px",
            height: "60px",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              height: "60px",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              fontFamily: "IRANSANS",
            },
          }}
        >
          <Select
            value={zone}
            onChange={handleZoneChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
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
      </Box>

      {/* حجم */}
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          حجم
        </Typography>
        <input
          id={`volume-input-${id}`} // ID منحصر به فرد
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          min={1}
          max={100}
          style={{
            width: "100px",
            height: "60px",
            color: "#1e1e1e",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            fontFamily: "IRANSANS",
            textAlign: "center",
            boxSizing: "border-box", // برای حفظ اندازه
          }}
        />
      </Box>

      {/* نوع */}
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          نوع
        </Typography>
        <FormControl
          sx={{
            width: "100px",
            height: "60px",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              height: "60px",
              borderRadius: "10px",
              border: "0.5px solid #9F9F9F",
              fontFamily: "IRANSANS",
            },
          }}
        >
          <Select
            value={type}
            onChange={handleTypeChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
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
      </Box>

      {/* زمان */}
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          زمان
        </Typography>
        <input
          id={`time-input-${id}`} // ID منحصر به فرد
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: "100px",
            height: "60px",
            color: "#1e1e1e",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            fontFamily: "IRANSANS",
            textAlign: "center",
            padding: "0 5px", // پدینگ برای نمایش بهتر
            boxSizing: "border-box",
          }}
        />
      </Box>
    </Box>
  );
};

// ----------------------------------------------------------------
// کامپوننت اصلی
// ----------------------------------------------------------------
const FeedingPlans = () => {
  // --- State های تمیز شده ---
  const [isChanging, setIsChanging] = React.useState(false);
  const [activity, setActivity] = React.useState(false);
  const [modalPlans, setModalPlans] = React.useState(false);

  // [جدید] - State برای مدیریت لیست ردیف‌ها
  // هر ردیف فقط یک ID منحصر به فرد دارد
  const [planRows, setPlanRows] = React.useState([crypto.randomUUID()]);

  // --- توابع ---
  const handleModalPlansClose = () => setModalPlans(false);
  const handleModalPlansOpen = () => setModalPlans(true);

  const changOnAndOff = () => {
    setIsChanging(true);
    setTimeout(() => {
      setActivity(!activity);
      setIsChanging(false);
    }, 200);
  };

  // [جدید] - تابع افزودن ردیف
  const handleAddRow = () => {
    setPlanRows((prevRows) => [...prevRows, crypto.randomUUID()]);
  };

  // [جدید] - تابع حذف ردیف
  const handleDeleteRow = (idToDelete) => {
    // جلوگیری از حذف آخرین ردیف
    if (planRows.length <= 1) return;
    setPlanRows((prevRows) => prevRows.filter((id) => id !== idToDelete));
  };

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
    <Container
      sx={{
        width: "274px",
        height: "90px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        border: "0.5px solid #008143",
        bgcolor: "#B8FFDD",
        padding: "0 !important",
      }}
    >
      <Button
        sx={{
          color: "#1E1E1E",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
        onClick={handleModalPlansOpen}
      >
        <Typography color="initial" fontFamily={"IRANSANS"}>
          برنامه ساخت محلول غذایی
        </Typography>
      </Button>
      <Modal
        open={modalPlans} // [اصلاح شد] - به state متصل شد
        className="plans-modal"
        disableAutoFocus
        onClose={handleModalPlansClose}
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
            width: "964px",
            height: "414px",
            boxShadow: 24,
            padding: "8px 8px 16px 8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="modalBox"
        >
          {/* هدر مودال */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={18} mr={2} mt={2} mb={2}>
              برنامه زمانی ساخت محلول
            </Typography>
            <img
              className="close-btn"
              src={assets.svg.close}
              alt="close"
              onClick={handleModalPlansClose}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* بدنه مودال (دکمه فعال‌سازی و ردیف‌ها) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Box
              sx={{
                marginLeft: "10px",
              }}
            >
              <img
                onClick={changOnAndOff}
                className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
                src={activity ? assets.svg.buttonOn : assets.svg.buttonOff}
                alt="Toggle Activity"
                style={{ cursor: "pointer" }}
              />
            </Box>

            {/* [جدید] - کانتینر ردیف‌ها با قابلیت اسکرول */}
            <Box
              sx={{
                width: "798px",
                height: "265px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                overflowY: "auto", // فعال کردن اسکرول عمودی
                padding: "10px", // پدینگ داخلی برای ردیف‌ها
              }}
            >
              {planRows.map((id) => (
                <PlanRow
                  key={id}
                  id={id}
                  onDelete={() => handleDeleteRow(id)}
                  canBeDeleted={planRows.length > 1}
                  convert={convert}
                />
              ))}
            </Box>
          </div>

          {/* دکمه افزودن ردیف */}
          <div
            className="add-field-btn"
            onClick={handleAddRow} // [اصلاح شد] - onClick اضافه شد
            style={{
              cursor: "pointer",
              alignSelf: "flex-end",
              paddingLeft: "10px",
              paddingTop: "20px",
              display: "flex",
              paddingBottom:"30px"
            }} // [اصلاح شد] - تراز کردن با جدول
          >
            <p>اضافه کردن ردیف</p>
            <img src={assets.svg.addField} alt="Add Row" style={{scale:"0.7"}} />
          </div>
        </Box>
      </Modal>
    </Container>
  );
};

export default FeedingPlans;
