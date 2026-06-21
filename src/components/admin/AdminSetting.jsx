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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import assets from "../../assets";
import ModalCloseButton from "../common/ModalCloseButton";
import {
  getAllConfig,
  updateIrrigationConfig,
  updateSolubleConfig,
  updateClimateConfig,
  getAccounts,
  createAccount,
  deleteAccount,
} from "../../api/configApi";
import { queryKeys } from "../../api/queryKeys";
import { parseAdminConfig } from "../../lib/configHelpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { showErrorToast } from "../../utils/appToast";
import { toPersianDigits, toEnglishDigits } from "../../utils/persianDigits";

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
      value={toPersianDigits(value)}
      onChange={(e) =>
        onChange({ target: { name, value: toEnglishDigits(e.target.value) } })
      }
      inputProps={{ inputMode: "decimal" }}
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
      value={toPersianDigits(value)}
      onChange={(e) =>
        onChange({ target: { name, value: toEnglishDigits(e.target.value) } })
      }
      inputProps={{ inputMode: "decimal" }}
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

const accountFieldSx = {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: "5px",
  "& .MuiInputBase-input": {
    fontFamily: "IRANSANS",
    textAlign: "right",
    padding: "10px",
  },
  "& .MuiInputLabel-root": {
    fontFamily: "IRANSANS",
    right: 27,
    left: "auto",
    transformOrigin: "top right",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    textAlign: "right",
  },
};


const AccountManagementTab = () => {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);
  const scrollContainerRef = useRef(null);
  const isDown = useRef(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopState = useRef(0);

  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    startY.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollTopState.current = scrollContainerRef.current.scrollTop;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;

    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }

    scrollContainerRef.current.scrollTop = scrollTopState.current - walk;
  };

  const handleTouchStart = (e) => {
    isDragging.current = false;
    startY.current = e.touches[0].pageY;
  };

  const handleTouchMove = (e) => {
    const y = e.touches[0].pageY;
    if (Math.abs(y - startY.current) > 5) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const {
    data: accountsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.configAccounts(),
    queryFn: getAccounts,
  });

  const users = accountsData?.users ?? [];

  useEffect(() => {
    if (isError) {
      showErrorToast(
        `خطا در دریافت حساب‌ها: ${error?.message || "خطای ناشناخته"}`,
        "admin-accounts-error",
      );
    }
  }, [isError, error]);

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success("حساب کاربری با موفقیت ایجاد شد.");
      setUsername("");
      setPassword("");
      setPasswordConfirm("");
      queryClient.invalidateQueries({ queryKey: queryKeys.configAccounts() });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.password?.[0] ||
        "خطا در ایجاد حساب کاربری";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("حساب کاربری حذف شد.");
      setDeleteDialogOpen(false);
      setPendingDeleteUser(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.configAccounts() });
    },
    onError: () => {
      toast.error("خطا در حذف حساب کاربری");
    },
  });

  const handleCreateAccount = () => {
    if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
      toast.error("همه فیلدها را پر کنید.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("رمز عبور و تکرار آن یکسان نیست.");
      return;
    }

    createMutation.mutate({
      username: username.trim(),
      password,
      password_confirm: passwordConfirm,
    });
  };

  const handleDeleteAccount = (userId, userName) => {
    if (isDragging.current) return;
    setPendingDeleteUser({ id: userId, username: userName });
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    if (deleteMutation.isPending) return;
    setDeleteDialogOpen(false);
    setPendingDeleteUser(null);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteUser) return;
    deleteMutation.mutate(pendingDeleteUser.id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        minHeight: 0,
        height: "100%",
        gap: 2,
        overflow: "hidden",
      }}
    >
      <Typography
        fontFamily="IRANSANS"
        fontSize={16}
        fontWeight="bold"
        color="#333"
        flexShrink={0}
      >
        لیست حساب‌های کاربری
      </Typography>

      <Box
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragStart={(e) => e.preventDefault()}
        sx={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#FFFFFF",
          border: "0.5px solid #9F9F9F",
          borderRadius: "10px",
          p: 2,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          userSelect: "none",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            display: "block",
            width: "25px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#EBEBEB",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#6a6a6a",
            borderRadius: "8px",
            border: "4px solid #EBEBEB",
            "&:hover": {
              background: "#444444",
            },
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isError ? (
          <Typography fontFamily="IRANSANS" textAlign="center" color="#777" fontSize={14}>
            امکان بارگذاری لیست وجود ندارد.
          </Typography>
        ) : users.length === 0 ? (
          <Typography fontFamily="IRANSANS" textAlign="center" color="#777">
            حساب کاربری ثبت نشده است.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
              pointerEvents: "none",
            }}
          >
            {users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  px: 2,
                  py: 1.2,
                  backgroundColor: "#FAFAFA",
                  flexShrink: 0,
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={15}>
                  {user.username}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={deleteMutation.isPending}
                  onClick={() => handleDeleteAccount(user.id, user.username)}
                  sx={{
                    fontFamily: "IRANSANS",
                    minWidth: 72,
                    pointerEvents: "auto",
                  }}
                >
                  حذف
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          border: "1px solid #90CAF9",
          borderRadius: "10px",
          p: 2,
          backgroundColor: "inherit",
          flexShrink: 0,
        }}
      >
        <Typography
          fontFamily="IRANSANS"
          fontWeight="bold"
          fontSize={15}
          color="#1565C0"
          mb={2}
        >
          ایجاد حساب جدید
        </Typography>
        <Grid container spacing={2} direction={"rtl"}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={accountFieldSx}
              InputLabelProps={{ sx: { fontFamily: "IRANSANS" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="password"
              label="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={accountFieldSx}
              InputLabelProps={{ sx: { fontFamily: "IRANSANS" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="password"
              label="تکرار رمز عبور"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              sx={accountFieldSx}
              InputLabelProps={{ sx: { fontFamily: "IRANSANS" } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleCreateAccount}
            disabled={createMutation.isPending}
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
            <Typography fontFamily="IRANSANS" fontSize={17} color="#000000">
              {createMutation.isPending ? "در حال ایجاد..." : "ایجاد حساب"}
            </Typography>
          </Button>
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: 320,
            fontFamily: "IRANSANS",
            position: "relative",
            pt: 1,
          },
        }}
      >
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
          <ModalCloseButton onClick={handleCancelDelete} />
        </Box>
        <DialogTitle
          sx={{ fontFamily: "IRANSANS", fontSize: 18, textAlign: "center" }}
        >
          حذف حساب کاربری
        </DialogTitle>
        <DialogContent>
          <Typography
            fontFamily="IRANSANS"
            fontSize={14}
            color="#555"
            textAlign="center"
          >
            آیا مطمئن هستید که حساب «{pendingDeleteUser?.username}» حذف شود؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2, px: 3 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleteMutation.isPending}
            sx={{
              fontFamily: "IRANSANS",
              minWidth: 100,
              borderColor: "#9F9F9F",
              color: "#555",
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{
              fontFamily: "IRANSANS",
              minWidth: 100,
              backgroundColor: "#D32F2F",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            {deleteMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// =====================================================================
// کامپوننت اصلی تنظیمات ادمین
// =====================================================================
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
            Number(currentSettings[`climate_z${i}_number_of_exhaust_fans`]) ||
            0,
          number_of_circulating_fans:
            Number(
              currentSettings[`climate_z${i}_number_of_circulating_fans`],
            ) || 0,
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
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* هدر صفحه ادمین */}
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

        {/* بدنه اصلی تب‌ها */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
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
              <Tab label="مدیریت حساب‌ها" />
            </Tabs>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
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
                    disabled={saveMutation.isPending}
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
                      {saveMutation.isPending
                        ? "در حال ذخیره..."
                        : "ذخیره تنظیمات آبیاری"}
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
                    disabled={saveMutation.isPending}
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
                      {saveMutation.isPending
                        ? "در حال ذخیره..."
                        : "ذخیره تنظیمات تغذیه"}
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
                    disabled={saveMutation.isPending}
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
                      {saveMutation.isPending
                        ? "در حال ذخیره..."
                        : "ذخیره تنظیمات اقلیم"}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            )}

            {activeTab === 3 && <AccountManagementTab />}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminSetting;
