import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import React from "react";
import assets from "../../assets";

const AdminSetting = () => {
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
          }}
        >
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
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز اسید"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حجم مخازن"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="مدت زمان روشن بودن پمپ‌ها"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر زمان روشن بودن ورودی آب"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="EC بهینه"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="pH بهینه"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              {/* Right column */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز استوک"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر تعداد مجاز اسید"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حجم مخازن"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="مدت زمان روشن بودن پمپ‌ها"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="حداکثر زمان روشن بودن ورودی آب"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="EC بهینه"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="pH بهینه"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "246px", height: "56px" }}>
        <Button
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#6CCDB0",
            display: "flex",
            justifyContent: "space-around",
            paddingX: "10px",
            borderRadius: "10px",
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
