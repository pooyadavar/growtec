import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import assets from "../../assets";
import apiClient from "../../api/apiClient";

// تابع تبدیل اعداد انگلیسی به فارسی
const convert = (num) => {
  if (num === null || num === undefined || num === "") return "";
  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  let res = "";
  const str = num.toString();
  for (let c of str) {
    res += numbers.charAt(c) || c;
  }
  return res;
};

// =====================================================================
// کامپوننت‌های ردیفی (برای تب‌های آبیاری و تغذیه)
// =====================================================================
const FormRow = ({ label, name, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      mb: 2.5,
      gap: 2.5,
    }}
  >
    <Typography fontFamily={"IRANSANS"} fontSize={15} color="#333">
      {label}
    </Typography>
    <TextField
      variant="outlined"
      size="small"
      name={name}
      value={value}
      onChange={onChange}
      type="number"
      sx={{
        width: "120px",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        "& .MuiInputBase-input": {
          fontFamily: "IRANSANS",
          textAlign: "center",
          padding: "8px",
        },
      }}
    />
  </Box>
);

// =====================================================================
// کامپوننت‌های افقی/ستونی (مخصوص تب اقلیم)
// =====================================================================
const VerticalSelect = ({ label, name, value, onChange, maxCount }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Typography
      fontFamily={"IRANSANS"}
      fontSize={14}
      color="#555"
      fontWeight="bold"
    >
      {label}
    </Typography>
    <Select
      size="small"
      name={name}
      value={value === "" ? 0 : value}
      onChange={onChange}
      sx={{
        width: "90px",
        height: "40px",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        fontFamily: "IRANSANS",
        textAlign: "center",
      }}
    >
      {Array.from({ length: maxCount + 1 }, (_, i) => i).map((num) => (
        <MenuItem
          key={num}
          value={num}
          sx={{ fontFamily: "IRANSANS", justifyContent: "center" }}
        >
          {convert(num)}
        </MenuItem>
      ))}
    </Select>
  </Box>
);

const VerticalToggle = ({ label, name, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Typography
      fontFamily={"IRANSANS"}
      fontSize={14}
      color="#555"
      fontWeight="bold"
    >
      {label}
    </Typography>
    <Box
      sx={{
        display: "flex",
        width: "110px",
        border: "1px solid #C4C4C4",
        borderRadius: "8px",
        overflow: "hidden",
        height: "40px",
      }}
    >
      <Button
        disableElevation
        variant={value ? "contained" : "text"}
        onClick={() => onChange({ target: { name, value: true } })}
        sx={{
          flex: 1,
          borderRadius: 0,
          fontFamily: "IRANSANS",
          minWidth: "auto",
          fontSize: "13px",
          bgcolor: value ? "#B8FFDD" : "transparent",
          color: value ? "#004323" : "#333",
          p: 0,
          "&:hover": { bgcolor: value ? "#B8FFDD" : "#f0f0f0" },
        }}
      >
        دارد
      </Button>
      <Button
        disableElevation
        variant={!value ? "contained" : "text"}
        onClick={() => onChange({ target: { name, value: false } })}
        sx={{
          flex: 1,
          borderRadius: 0,
          fontFamily: "IRANSANS",
          minWidth: "auto",
          fontSize: "13px",
          bgcolor: !value ? "#FED9D9" : "transparent",
          color: !value ? "#CC0000" : "#333",
          p: 0,
          borderRight: "1px solid #C4C4C4",
          "&:hover": { bgcolor: !value ? "#FED9D9" : "#f0f0f0" },
        }}
      >
        ندارد
      </Button>
    </Box>
  </Box>
);

// کامپوننت جدید برای ورودی متنی/عددی در تب اقلیم
const VerticalInput = ({ label, name, value, onChange }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Typography
      fontFamily={"IRANSANS"}
      fontSize={12}
      color="#555"
      fontWeight="bold"
      textAlign="center"
    >
      {label}
    </Typography>
    <TextField
      variant="outlined"
      size="small"
      name={name}
      value={value}
      onChange={onChange}
      type="number"
      sx={{
        width: "90px",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        "& .MuiInputBase-root": { height: "40px", borderRadius: "8px" },
        "& .MuiInputBase-input": {
          fontFamily: "IRANSANS",
          textAlign: "center",
          padding: "0 8px",
        },
      }}
    />
  </Box>
);

// تولید استیت‌های پیش‌فرض برای ۵ زون اقلیم
const getInitialClimateState = () => {
  let state = {};
  for (let i = 1; i <= 5; i++) {
    state[`climate_z${i}_temp_circ_fan`] = 0;
    state[`climate_z${i}_temp_fan`] = 0;
    state[`climate_z${i}_temp_heater`] = 0;
    state[`climate_z${i}_temp_pad`] = false;
    state[`climate_z${i}_temp_vent`] = false;
    state[`climate_z${i}_hum_mist`] = 0;
    state[`climate_z${i}_hum_pad`] = false;
    state[`climate_z${i}_hum_vent`] = false;
    state[`climate_z${i}_sensor_count`] = "";
  }
  return state;
};

const AdminSetting = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeZoneTab, setActiveZoneTab] = useState(0);

  const [settings, setSettings] = useState({
    tank_volume_1: "",
    tank_volume_2: "",
    tank_volume_3: "",
    tank_volume_4: "",
    sensors_zone_1: "",
    sensors_zone_2: "",
    sensors_zone_3: "",
    sensors_zone_4: "",
    ec_ph_sensors_zone_1: "",
    ec_ph_sensors_zone_2: "",
    ec_ph_sensors_zone_3: "",
    ec_ph_sensors_zone_4: "",
    ec_ph_sensors_zone_5: "",
    dosing_pumps_count: "",
    ...getInitialClimateState(),
  });

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get("/admin/setting/");
      const data = response.data || response;
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching admin settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await apiClient.post("/admin/setting/", settings);
      alert("تنظیمات با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error saving admin settings:", error);
      alert("خطا در ذخیره تنظیمات");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container
      sx={{
        width: "950px",
        height: "568px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* هدر */}
        <Box
          sx={{
            width: "246px",
            height: "58px",
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#FFCB82",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            margin: "0 auto",
            flexShrink: 0,
          }}
        >
          <img src={assets.svg.person} alt="" />
          <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
            تنظیمات ادمین
          </Typography>
        </Box>

        {/* بدنه اصلی */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#F5F5F5",
            borderRadius: "10px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* نوار تب‌های اصلی */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              direction: "rtl",
              width: "100%",
              flexShrink: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                minHeight: "50px",
                "& .MuiTab-root": {
                  fontFamily: "IRANSANS",
                  fontSize: "16px",
                  fontWeight: "bold",
                  minHeight: "50px",
                  py: 0,
                },
              }}
            >
              <Tab label="آبیاری" />
              <Tab label="تغذیه" />
              <Tab label="اقلیم" />
            </Tabs>
          </Box>

          {/* محتوای تب‌ها */}
          <Box
            sx={{
              flex: 1,
              px: 4,
              py: 3,
              display: "flex",
              flexDirection: "column",
              direction: "rtl",
              overflow: "hidden",
            }}
          >
            {/* ================= تب آبیاری ================= */}
            {activeTab === 0 && (
              <>
                <Grid
                  container
                  spacing={8}
                  sx={{ flex: 1, alignContent: "flex-start" }}
                >
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {[1, 2, 3, 4 ,5].map((num) => (
                        <FormRow
                          key={`tank-${num}`}
                          label={`حجم مخزن آبیاری ${convert(num)}`}
                          name={`tank_volume_${num}`}
                          value={settings[`tank_volume_${num}`]}
                          onChange={handleChange}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {[1, 2, 3, 4].map((num) => (
                        <FormRow
                          key={`sensor-${num}`}
                          label={`تعداد سنسور در زون ${convert(num)}`}
                          name={`sensors_zone_${num}`}
                          value={settings[`sensors_zone_${num}`]}
                          onChange={handleChange}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "auto",
                    flexShrink: 0,
                  }}
                >
                  <Button
                    onClick={handleSave}
                    sx={{
                      width: "246px",
                      height: "50px",
                      backgroundColor: "#6CCDB0",
                      display: "flex",
                      justifyContent: "space-around",
                      paddingX: "10px",
                      borderRadius: "10px",
                      "&:hover": { backgroundColor: "#5bbd9e" },
                    }}
                  >
                    <img src={assets.svg.setting2} alt="" />
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={17}
                      color="#000000"
                    >
                      ذخیره تنظیمات آبیاری
                    </Typography>
                  </Button>
                </Box>
              </>
            )}

            {/* ================= تب تغذیه ================= */}
            {activeTab === 1 && (
              <>
                <Grid
                  container
                  spacing={8}
                  sx={{ flex: 1, alignContent: "flex-start" }}
                >
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {[1].map((num) => (
                        <FormRow
                          key={`ecph-sensor-${num}`}
                          // label={`تعداد سنسور ecPh زون ${convert(num)}`}
                          label={`تعداد سنسور ecPh  `}
                          name={`ec_ph_sensors_zone_${num}`}
                          value={settings[`ec_ph_sensors_zone_${num}`]}
                          onChange={handleChange}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <FormRow
                        label="تعداد دوزینگ پمپ‌ها"
                        name="dosing_pumps_count"
                        value={settings.dosing_pumps_count}
                        onChange={handleChange}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "auto",
                    flexShrink: 0,
                  }}
                >
                  <Button
                    onClick={handleSave}
                    sx={{
                      width: "246px",
                      height: "50px",
                      backgroundColor: "#6CCDB0",
                      display: "flex",
                      justifyContent: "space-around",
                      paddingX: "10px",
                      borderRadius: "10px",
                      "&:hover": { backgroundColor: "#5bbd9e" },
                    }}
                  >
                    <img src={assets.svg.setting2} alt="" />
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={17}
                      color="#000000"
                    >
                      ذخیره تنظیمات تغذیه
                    </Typography>
                  </Button>
                </Box>
              </>
            )}

            {/* ================= تب اقلیم ================= */}
            {activeTab === 2 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                {/* تب‌های انتخاب زون */}
                <Tabs
                  value={activeZoneTab}
                  onChange={(e, v) => setActiveZoneTab(v)}
                  variant="fullWidth"
                  sx={{
                    minHeight: "36px",
                    mb: 2,
                    borderBottom: "1px solid #ddd",
                    "& .MuiTab-root": {
                      fontFamily: "IRANSANS",
                      minHeight: "36px",
                      py: 0,
                      fontSize: "15px",
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5].map((z) => (
                    <Tab key={z} label={`زون ${convert(z)}`} />
                  ))}
                </Tabs>

                {/* پنل دما */}
                <Box
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "inherit",
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    border: "1px solid #90CAF9",
                  }}
                >
                  <Typography
                    fontFamily={"IRANSANS"}
                    fontWeight="bold"
                    fontSize="15px"
                    color="#1565C0"
                    mb={2}
                  >
                    تنظیمات دما
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <VerticalSelect
                      label="فن سیرکوله"
                      name={`climate_z${activeZoneTab + 1}_temp_circ_fan`}
                      value={
                        settings[`climate_z${activeZoneTab + 1}_temp_circ_fan`]
                      }
                      onChange={handleChange}
                      maxCount={2}
                    />
                    <VerticalSelect
                      label=" فن اگزاست"
                      name={`climate_z${activeZoneTab + 1}_temp_fan`}
                      value={settings[`climate_z${activeZoneTab + 1}_temp_fan`]}
                      onChange={handleChange}
                      maxCount={3}
                    />
                    <VerticalSelect
                      label="بخاری"
                      name={`climate_z${activeZoneTab + 1}_temp_heater`}
                      value={
                        settings[`climate_z${activeZoneTab + 1}_temp_heater`]
                      }
                      onChange={handleChange}
                      maxCount={2}
                    />
                    <VerticalToggle
                      label="پمپ پد"
                      name={`climate_z${activeZoneTab + 1}_temp_pad`}
                      value={settings[`climate_z${activeZoneTab + 1}_temp_pad`]}
                      onChange={handleChange}
                    />
                    <VerticalToggle
                      label="دریچه"
                      name={`climate_z${activeZoneTab + 1}_temp_vent`}
                      value={
                        settings[`climate_z${activeZoneTab + 1}_temp_vent`]
                      }
                      onChange={handleChange}
                    />
                  </Box>
                </Box>

                {/* پنل‌های ردیف پایین: رطوبت و سنسورها - جایگزین Grid با Flexbox برای جلوگیری از باگ عرضی */}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: 1,
                    boxSizing: "border-box",
                  }}
                >
                  {/* پنل رطوبت */}
                  <Box
                    sx={{
                      flex: 0.8,
                      backgroundColor: "inherit",
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #A5D6A7",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontWeight="bold"
                      fontSize="15px"
                      color="#2E7D32"
                      mb={2}
                    >
                      تنظیمات رطوبت
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <VerticalSelect
                        label="مه پاش"
                        name={`climate_z${activeZoneTab + 1}_hum_mist`}
                        value={
                          settings[`climate_z${activeZoneTab + 1}_hum_mist`]
                        }
                        onChange={handleChange}
                        maxCount={2}
                      />
                      <VerticalToggle
                        label="پمپ پد"
                        name={`climate_z${activeZoneTab + 1}_hum_pad`}
                        value={
                          settings[`climate_z${activeZoneTab + 1}_hum_pad`]
                        }
                        onChange={handleChange}
                      />
                      <VerticalToggle
                        label="دریچه"
                        name={`climate_z${activeZoneTab + 1}_hum_vent`}
                        value={
                          settings[`climate_z${activeZoneTab + 1}_hum_vent`]
                        }
                        onChange={handleChange}
                      />
                    </Box>
                  </Box>

                  {/* پنل تنظیمات سنسور (باکس خاکستری) */}
                  <Box
                    sx={{
                      width: "220px",
                      backgroundColor: "inherit",
                      p: 2,
                      flex:0.6,
                      borderRadius: 2,
                      border: "1px solid #BDBDBD",
                      display: "flex",
                      // flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      boxSizing: "border-box",
                      gap: 3, // فاصله بین اینپوت سنسور و دکمه شید
                      
                    }}
                  >
                    <VerticalInput
                      label="تعداد سنسور در این زون"
                      name={`climate_z${activeZoneTab + 1}_sensor_count`}
                      value={
                        settings[`climate_z${activeZoneTab + 1}_sensor_count`]
                      }
                      onChange={handleChange}
                    />

                    <VerticalToggle
                      label="شید"
                      name={`climate_z${activeZoneTab + 1}_shade`}
                      value={settings[`climate_z${activeZoneTab + 1}_shade`]}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "auto",
                    pt: 2,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    onClick={handleSave}
                    sx={{
                      width: "246px",
                      height: "50px",
                      backgroundColor: "#6CCDB0",
                      display: "flex",
                      justifyContent: "space-around",
                      paddingX: "10px",
                      borderRadius: "10px",
                      "&:hover": { backgroundColor: "#5bbd9e" },
                    }}
                  >
                    <img src={assets.svg.setting2} alt="" />
                    <Typography
                      fontFamily={"IRANSANS"}
                      fontSize={17}
                      color="#000000"
                    >
                      ذخیره تنظیمات اقلیم
                    </Typography>
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminSetting;
