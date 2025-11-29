import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Modal,
  MenuItem,
  FormControl,
  Select,
  Button,
  Collapse, // اضافه شده برای انیمیشن
} from "@mui/material";
import { TransitionGroup } from "react-transition-group"; // اضافه شده برای مدیریت انیمیشن لیست
import IconTextButton from "../../card/IconTextButton";
import assets from "../../assets";

// داده‌های نمایشی برای لیست اصلی (بیرون مودال)
const scheduleData = [
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "A", volume: "۵۰", status: "فعال" },
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "B", volume: "۳۰", status: "غیرفعال" },
  { time: "۰۰:۰۰:۰۰", zone: "۱", type: "A", volume: "۲۰", status: "فعال" },
];

// کامپوننت سطر (الان یک کامپوننت کنترل‌شده است و استیت داخلی ندارد)
const PlanRow = ({ id, data, onChange, onDelete, canBeDeleted, convert }) => {
  const [isChanging, setIsChanging] = useState(false);

  // هندل کردن تغییر وضعیت دکمه
  const handleToggleActive = () => {
    setIsChanging(true);
    setTimeout(() => {
      onChange(id, "isActive", !data.isActive);
      setIsChanging(false);
    }, 200);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "10px",
      }}
    >
      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          وضعیت
        </Typography>
        <Box
          sx={{
            width: "100px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            onClick={handleToggleActive}
            className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
            src={data.isActive ? assets.svg.buttonOn : assets.svg.buttonOff}
            alt="Toggle Activity"
            style={{
              cursor: "pointer",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ width: "100px" }}>
        <Button
          variant="text"
          onClick={onDelete}
          disabled={!canBeDeleted}
          sx={{
            backgroundColor: "#FED9D9",
            border: "0.5px solid #CC0000",
            borderRadius: "10px",
            width: "100px",
            height: "60px",
            color: "#CC0000",
            opacity: canBeDeleted ? 1 : 0.5,
            mt: "25px",
          }}
        >
          <Typography color="inherit" fontFamily={"IRANSANS"} fontSize={18}>
            حذف
          </Typography>
        </Button>
      </Box>

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
            value={data.zone}
            onChange={(e) => onChange(id, "zone", e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontFamily: "IRANSANS" }}>
                {convert(n)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          حجم
        </Typography>
        <input
          type="number"
          value={data.volume}
          onChange={(e) => onChange(id, "volume", e.target.value)}
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
            boxSizing: "border-box",
          }}
        />
      </Box>

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
            value={data.type}
            onChange={(e) => onChange(id, "type", e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <em>انتخاب</em>
            </MenuItem>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontFamily: "IRANSANS" }}>
                {convert(n)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100px" }}>
        <Typography fontFamily={"IRANSANS"} textAlign="center" mb={0.5}>
          زمان
        </Typography>
        <input
          type="time"
          value={data.time}
          onChange={(e) => onChange(id, "time", e.target.value)}
          style={{
            width: "100px",
            height: "60px",
            color: "#1e1e1e",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            fontFamily: "IRANSANS",
            textAlign: "center",
            padding: "0 5px",
            boxSizing: "border-box",
          }}
        />
      </Box>
    </Box>
  );
};

const FeedingStatusBar = () => {
  const [modalPlans, setModalPlans] = useState(false);

  // استیت کلی: حالا شامل آبجکت‌های کامل است، نه فقط ID
  const [planRows, setPlanRows] = useState([
    {
      id: crypto.randomUUID(),
      zone: "",
      type: "",
      time: "",
      volume: "",
      isActive: false,
    },
  ]);

  const handleModalPlansOpen = () => setModalPlans(true);
  const handleModalPlansClose = () => setModalPlans(false);

  // اضافه کردن سطر جدید با مقادیر خالی
  const handleAddRow = () => {
    setPlanRows((prevRows) => [
      ...prevRows,
      {
        id: crypto.randomUUID(),
        zone: "",
        type: "",
        time: "",
        volume: "",
        isActive: false,
      },
    ]);
  };

  // حذف سطر
  const handleDeleteRow = (idToDelete) => {
    if (planRows.length <= 1) return;
    setPlanRows((prevRows) => prevRows.filter((row) => row.id !== idToDelete));
  };

  // آپدیت کردن مقادیر هر سطر در استیت پدر
  const handleRowChange = (id, field, value) => {
    setPlanRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // تابع دکمه ثبت نهایی
  const handleSave = () => {
    console.log("داده‌های نهایی برای ارسال به بکند:", planRows);
    // اینجا می‌توانید عملیات ارسال به سرور را انجام دهید
    handleModalPlansClose();
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

  // رندرهای نمایشی جدول اصلی (بدون تغییر)
  const renderScheduleRow = (row, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 0",
        borderBottom:
          index < scheduleData.length - 1 ? "1px solid #E0E0E0" : "none",
      }}
    >
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.time}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.zone}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.type}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.volume}</Typography>
      </Box>
      <Box sx={cellStyle}>
        <Typography sx={textStyle}>{row.status}</Typography>
      </Box>
    </Box>
  );

  const headerStyle = {
    fontFamily: "IRANSANS",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#555",
    textAlign: "center",
    flex: 1,
  };

  const cellStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = {
    fontFamily: "IRANSANS",
    fontSize: "12px",
    color: "#333",
    backgroundColor: "#F5F5F5",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "3px",
    width: "38px",
    textAlign: "center",
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          /* استایل‌های قبلی Paper */ width: 240,
          height: "auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "16px",
          pb: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ... محتوای جدول اصلی همانند قبل ... */}
        <Box
          sx={{
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 0 8px 0",
              borderBottom: "2px solid #E0E0E0",
            }}
          >
            <Typography sx={headerStyle}>زمان</Typography>
            <Typography sx={headerStyle}>زون</Typography>
            <Typography sx={headerStyle}>نوع</Typography>
            <Typography sx={headerStyle}>حجم</Typography>
            <Typography sx={headerStyle}>وضعیت</Typography>
          </Box>
          <Stack spacing={1} sx={{ width: "100%", marginTop: "8px" }}>
            {scheduleData.map(renderScheduleRow)}
          </Stack>
        </Box>
        <Box
          sx={{
            width: "105%",
            marginTop: "15px",
            justifyContent: "right",
            display: "flex",
          }}
        >
          <IconTextButton
            text="تنظیمات ساخت محلول"
            icon={assets.svg.setting2}
            iconPosition="left"
            bgColor="#F7C98C"
            textColor="#333"
            borderColor="#F7C98C"
            onClick={handleModalPlansOpen}
          />
        </Box>
      </Paper>

      <Modal
        open={modalPlans}
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
            height: "460px", // ارتفاع کمی بیشتر شد تا دکمه ثبت جا شود
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
              width: "95%",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={18}
              mr={2}
              mt={2}
              mb={2}
            >
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

          {/* محتوای لیست سطرها */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "90%",
                maxWidth: "850px",
                height: "265px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {/* استفاده از TransitionGroup برای انیمیشن لیست */}
              <TransitionGroup>
                {planRows.map((row) => (
                  <Collapse key={row.id}>
                    <PlanRow
                      id={row.id}
                      data={row} // ارسال کل داده‌های سطر
                      onChange={handleRowChange} // ارسال تابع تغییر
                      onDelete={() => handleDeleteRow(row.id)}
                      canBeDeleted={planRows.length > 1}
                      convert={convert}
                    />
                  </Collapse>
                ))}
              </TransitionGroup>
            </Box>
          </div>

          {/* فوتر مودال: دکمه افزودن و دکمه ثبت */}
          <div
            style={{
              width: "90%",
              maxWidth: "850px",
              display: "flex",
              justifyContent: "space-between", // فاصله بین دکمه افزودن و ثبت
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            {/* دکمه ثبت */}
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "#4CAF50", // رنگ سبز برای ثبت
                "&:hover": { backgroundColor: "#45a049" },
                borderRadius: "10px",
                padding: "8px 24px",
                fontFamily: "IRANSANS",
                fontSize: "16px",
              }}
            >
              ثبت تغییرات
            </Button>

            {/* دکمه افزودن سطر */}
            <div
              className="add-field-btn"
              onClick={handleAddRow}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography fontFamily="IRANSANS" sx={{ ml: 1 }}>
                اضافه کردن ردیف
              </Typography>
              <img
                src={assets.svg.addField}
                alt="Add Row"
                style={{ scale: "1.3" }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default FeedingStatusBar;
