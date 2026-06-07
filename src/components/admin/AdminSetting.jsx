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
import {
  getAllConfig,
  updateIrrigationConfig,
  updateSolubleConfig,
  updateClimateConfig,
} from "../../api/configApi";
import { queryKeys } from "../../api/queryKeys";
import { parseAdminConfig } from "../../lib/configHelpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";

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
      value={toPersianDigits(value)} // همیشه فارسی نمایش می‌دهد
      onChange={(e) =>
        onChange({ target: { name, value: toEnglishDigits(e.target.value) } })
      } // همیشه انگلیسی ذخیره می‌کند
      inputProps={{ inputMode: "decimal" }} // جایگزین type="number"
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
          {toPersianDigits(num)}
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
      value={toPersianDigits(value)} // همیشه فارسی نمایش می‌دهد
      onChange={(e) =>
        onChange({ target: { name, value: toEnglishDigits(e.target.value) } })
      }
      inputProps={{ inputMode: "decimal" }} // جایگزین type="number"
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
    state[`climate_z${i}_number_of_exhaust_fans`] = 0;
    state[`climate_z${i}_number_of_circulating_fans`] = 0;
    state[`climate_z${i}_pump_pad`] = false;
    state[`climate_z${i}_heater`] = false;
    state[`climate_z${i}_roof_hatch`] = false;
    state[`climate_z${i}_fogger`] = false;
    state[`climate_z${i}_shade`] = false;
    state[`climate_z${i}_number_of_sensors`] = "";
  }
  return state;
};

const AdminSetting = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [activeZoneTab, setActiveZoneTab] = useState(0);

  const [settings, setSettings] = useState({
    tank_volume_1: "",
    tank_volume_2: "",
    tank_volume_3: "",
    tank_volume_4: "",
    tank_volume_5: "",
    number_of_sensors_zone_1: "",
    number_of_sensors_zone_2: "",
    number_of_sensors_zone_3: "",
    number_of_sensors_zone_4: "",
    number_of_sensors: "",
    number_of_dosing_pumps: "",
    ...getInitialClimateState(),
  });

  const { data: configData } = useQuery({
    queryKey: queryKeys.adminConfig(),
    queryFn: getAllConfig,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (configData) {
      const newData = parseAdminConfig(configData);
      setSettings((prev) => ({ ...prev, ...newData }));
    }
  }, [configData]);

  const saveMutation = useMutation({
    mutationFn: async ({ tab, settings: currentSettings }) => {
      if (tab === 0) {
        return updateIrrigationConfig({
          tank_volume_1: Number(currentSettings.tank_volume_1) || 0,
          tank_volume_2: Number(currentSettings.tank_volume_2) || 0,
          tank_volume_3: Number(currentSettings.tank_volume_3) || 0,
          tank_volume_4: Number(currentSettings.tank_volume_4) || 0,
          tank_volume_5: Number(currentSettings.tank_volume_5) || 0,
          number_of_sensors_zone_1:
            Number(currentSettings.number_of_sensors_zone_1) || 0,
          number_of_sensors_zone_2:
            Number(currentSettings.number_of_sensors_zone_2) || 0,
          number_of_sensors_zone_3:
            Number(currentSettings.number_of_sensors_zone_3) || 0,
          number_of_sensors_zone_4:
            Number(currentSettings.number_of_sensors_zone_4) || 0,
        });
      }
      if (tab === 1) {
        return updateSolubleConfig({
          number_of_sensors: Number(currentSettings.number_of_sensors) || 0,
          number_of_dosing_pumps:
            Number(currentSettings.number_of_dosing_pumps) || 0,
        });
      }
      const payload = { zones: {} };
      for (let i = 1; i <= 5; i++) {
        payload.zones[i.toString()] = {
          number_of_exhaust_fans:
            Number(currentSettings[`climate_z${i}_number_of_exhaust_fans`]) || 0,
          number_of_circulating_fans:
            Number(currentSettings[`climate_z${i}_number_of_circulating_fans`]) ||
            0,
          pump_pad: Boolean(currentSettings[`climate_z${i}_pump_pad`]),
          heater: Boolean(currentSettings[`climate_z${i}_heater`]),
          roof_hatch: Boolean(currentSettings[`climate_z${i}_roof_hatch`]),
          fogger: Boolean(currentSettings[`climate_z${i}_fogger`]),
          shade: Boolean(currentSettings[`climate_z${i}_shade`]),
          number_of_sensors:
            Number(currentSettings[`climate_z${i}_number_of_sensors`]) || 0,
        };
      }
      return updateClimateConfig(payload);
    },
    onSuccess: (_, { tab }) => {
      const messages = [
        "تنظیمات آبیاری با موفقیت ذخیره شد",
        "تنظیمات تغذیه با موفقیت ذخیره شد",
        "تنظیمات اقلیم با موفقیت ذخیره شد",
      ];
      toast.success(messages[tab]);
      queryClient.invalidateQueries({ queryKey: queryKeys.adminConfig() });
    },
    onError: () => {
      toast.error("خطا در ذخیره تنظیمات");
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ tab: activeTab, settings });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container
      sx={{
        width: "950px",
        height: "600px",
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
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FormRow
                          key={`tank-${num}`}
                          label={`حجم مخزن آبیاری ${toPersianDigits(num)}`}
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
                          label={`تعداد سنسور در زون ${toPersianDigits(num)}`}
                          name={`number_of_sensors_zone_${num}`}
                          value={settings[`number_of_sensors_zone_${num}`]}
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
                      <FormRow
                        label={`تعداد سنسور ecPh`}
                        name={`number_of_sensors`}
                        value={settings.number_of_sensors}
                        onChange={handleChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <FormRow
                        label="تعداد دوزینگ پمپ‌ها"
                        name="number_of_dosing_pumps"
                        value={settings.number_of_dosing_pumps}
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
                    <Tab key={z} label={`زون ${toPersianDigits(z)}`} />
                  ))}
                </Tabs>

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
                      name={`climate_z${activeZoneTab + 1}_number_of_circulating_fans`}
                      value={
                        settings[
                          `climate_z${activeZoneTab + 1}_number_of_circulating_fans`
                        ]
                      }
                      onChange={handleChange}
                      maxCount={2}
                    />
                    <VerticalSelect
                      label=" فن اگزاست"
                      name={`climate_z${activeZoneTab + 1}_number_of_exhaust_fans`}
                      value={
                        settings[
                          `climate_z${activeZoneTab + 1}_number_of_exhaust_fans`
                        ]
                      }
                      onChange={handleChange}
                      maxCount={3}
                    />
                    <VerticalToggle
                      label="بخاری"
                      name={`climate_z${activeZoneTab + 1}_heater`}
                      value={settings[`climate_z${activeZoneTab + 1}_heater`]}
                      onChange={handleChange}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: 1,
                    boxSizing: "border-box",
                  }}
                >
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
                        name={`climate_z${activeZoneTab + 1}_fogger`}
                        value={settings[`climate_z${activeZoneTab + 1}_fogger`]}
                        onChange={handleChange}
                        maxCount={2}
                      />
                      <VerticalToggle
                        label="پمپ پد"
                        name={`climate_z${activeZoneTab + 1}_pump_pad`}
                        value={
                          settings[`climate_z${activeZoneTab + 1}_pump_pad`]
                        }
                        onChange={handleChange}
                      />
                      <VerticalToggle
                        label="دریچه (سقف)"
                        name={`climate_z${activeZoneTab + 1}_roof_hatch`}
                        value={
                          settings[`climate_z${activeZoneTab + 1}_roof_hatch`]
                        }
                        onChange={handleChange}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "220px",
                      backgroundColor: "inherit",
                      p: 2,
                      flex: 0.6,
                      borderRadius: 2,
                      border: "1px solid #BDBDBD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxSizing: "border-box",
                      gap: 3,
                    }}
                  >
                    <VerticalInput
                      label="تعداد سنسور در این زون"
                      name={`climate_z${activeZoneTab + 1}_number_of_sensors`}
                      value={
                        settings[
                          `climate_z${activeZoneTab + 1}_number_of_sensors`
                        ]
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
