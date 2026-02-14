import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import assets from "../../assets";
import apiClient from "../../api/apiClient";

const AdminSetting = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    max_stock: "",
    max_acid: "",
    tank_volume: "",
    pump_duration: "",
    max_water_input_time: "",
    optimal_ec: "",
    optimal_ph: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/setting/");
      const data = response.data || response; // Handle response.data or direct data
      if (data) {
        setSettings({
          max_stock: data.max_stock || "",
          max_acid: data.max_acid || "",
          tank_volume: data.tank_volume || "",
          pump_duration: data.pump_duration || "",
          max_water_input_time: data.max_water_input_time || "",
          optimal_ec: data.optimal_ec || "",
          optimal_ph: data.optimal_ph || "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      // alert("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
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
        width: "858px",
        height: "568px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      <Box
        sx={{
          width: "858px",
          height: "492px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "246px",
            height: "58px",
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#FFCB82",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img src={assets.svg.person} alt="" />
          <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
            تنظیمات ادمین
          </Typography>
        </Box>
        <Box
          sx={{
            width: "858px",
            height: "434px",
            backgroundColor: "#F5F5F5",
            borderRadius: "5px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 3,
              borderRadius: 2,
              maxWidth: 900,
              mx: "auto",
              textAlign: "left",
              direction: "rtl",
            }}
          >
            <Grid container spacing={3}>
              {/* Left column */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز استوک"
                  variant="outlined"
                  size="small"
                  name="max_stock"
                  value={settings.max_stock}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز اسید"
                  variant="outlined"
                  size="small"
                  name="max_acid"
                  value={settings.max_acid}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حجم مخازن"
                  variant="outlined"
                  size="small"
                  name="tank_volume"
                  value={settings.tank_volume}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="مدت زمان روشن بودن پمپ‌ها"
                  variant="outlined"
                  size="small"
                  name="pump_duration"
                  value={settings.pump_duration}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر زمان روشن بودن ورودی آب"
                  variant="outlined"
                  size="small"
                  name="max_water_input_time"
                  value={settings.max_water_input_time}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="EC بهینه"
                  variant="outlined"
                  size="small"
                  name="optimal_ec"
                  value={settings.optimal_ec}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="pH بهینه"
                  variant="outlined"
                  size="small"
                  name="optimal_ph"
                  value={settings.optimal_ph}
                  onChange={handleChange}
                />
              </Grid>

              {/* Right column */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز استوک"
                  variant="outlined"
                  size="small"
                  name="max_stock"
                  value={settings.max_stock}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز اسید"
                  variant="outlined"
                  size="small"
                  name="max_acid"
                  value={settings.max_acid}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حجم مخازن"
                  variant="outlined"
                  size="small"
                  name="tank_volume"
                  value={settings.tank_volume}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="مدت زمان روشن بودن پمپ‌ها"
                  variant="outlined"
                  size="small"
                  name="pump_duration"
                  value={settings.pump_duration}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر زمان روشن بودن ورودی آب"
                  variant="outlined"
                  size="small"
                  name="max_water_input_time"
                  value={settings.max_water_input_time}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="EC بهینه"
                  variant="outlined"
                  size="small"
                  name="optimal_ec"
                  value={settings.optimal_ec}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="pH بهینه"
                  variant="outlined"
                  size="small"
                  name="optimal_ph"
                  value={settings.optimal_ph}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "246px", height: "56px" }}>
        <Button
          onClick={handleSave}
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#6CCDB0",
            display: "flex",
            justifyContent: "space-around",
            paddingX: "10px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#5bbd9e" },
          }}
          color="#000000"
        >
          <img src={assets.svg.setting2} alt="" />
          <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
            ذخیره تنظیمات
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};

export default AdminSetting;
