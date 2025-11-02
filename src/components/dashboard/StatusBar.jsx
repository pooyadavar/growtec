import React from "react";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import assets from "../../assets";
import { makeStyles } from "@mui/styles";

// --- ۱. Props ها آپدیت شدند ---
// ما حالا به جای ec و ph، مقادیر و آبجکت range آنها را جداگانه می‌گیریم
const StatusBar = ({
  ecValue = 0,
  phValue = 0,
  ecRange,
  phRange,
}) => {
  const useStyle = makeStyles(() => ({
    barContainer: {},
  }));

  const classes = useStyle();
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    if (num === null || num === undefined) return numbers.charAt(0);
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  // --- ۲. تابع کمکی برای انتخاب عکس ---
  /**
   * بر اساس آبجکت range، عکس مناسب را برمی‌گرداند
   * @param {object} range - آبجکتی شامل { higher_than_low, higher_than_high }
   */
  const getStatusImage = (range) => {
    // اگر range وجود نداشته باشد، حالت خوب را برمی‌گردانیم
    if (!range) {
      return assets.svg.goodStatusDashboard;
    }

    const { higher_than_low, higher_than_high } = range;

    // اگر بالاتر از حد بالا بود
    if (higher_than_high) {
      return assets.svg.highStatusDashboard;
    }
    
    // اگر پایین‌تر از حد پایین بود
    if (!higher_than_low) {
      return assets.svg.lowStatusDashboard;
    }

    // در غیر این صورت، در محدوده مجاز (خوب) است
    return assets.svg.goodStatusDashboard;
  };

  // --- ۳. تعیین عکس برای EC و pH ---
  const phStatusImage = getStatusImage(phRange);
  const ecStatusImage = getStatusImage(ecRange);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "350px",
        height: "100px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        backgroundColor: "#ffff",
      }}
    >
      {/* --- بخش EC --- */}
      <div
        className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "300px",
          height: "30px",
          border: "0.5px solid #9F9F9F",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // تغییر به center
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> EC : {convert(ecValue)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // marginBottom: "4px", // حذف شد
          }}
        >
          {/* --- ۴. عکس داینامیک EC جایگزین شد --- */}
          {/* عکس mark حذف شد */}
          <img
            style={{ width: "166px", height: "16px" }}
            src={ecStatusImage} // استفاده از متغیر داینامیک
            alt="ec status bar"
          />
        </div>
      </div>

      {/* --- بخش pH --- */}
      <div
        className={classes.barContainer}
        style={{
          backgroundColor: "#ffff",
          width: "300px",
          height: "30px",
          border: "0.5px solid #9F9F9F",
          marginTop: "10px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // تغییر به center
          justifyContent: "space-around",
          paddingRight: "1rem",
        }}
      >
        <Typography fontFamily={"IRANSANS"}> pH : {convert(phValue)}</Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // marginBottom: "4px", // حذف شد
          }}
        >
          {/* --- ۵. عکس داینامیک pH جایگزین شد --- */}
          {/* عکس mark حذف شد */}
          <img
            style={{ width: "166px", height: "16px" }}
            src={phStatusImage} // استفاده از متغیر داینامیک
            alt="ph status bar"
          />
        </div>
      </div>
    </Container>
  );
};

export default StatusBar;