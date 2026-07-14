import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalCloseButton from "./common/ModalCloseButton";
import lockIcon from "../assets/svg/Locked 1.svg";

const getAvatarLetter = (username) => {
  if (!username) return "?";
  return username.trim().charAt(0);
};

const UserAccountMenu = ({ classes }) => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleCloseMenu();
    setLogoutDialogOpen(true);
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/Home", { replace: true });
  };

  return (
    <>
      <Button
        onClick={handleOpenMenu}
        variant="text"
        className={classes.navItem}
        sx={{
          marginRight: "2rem",
          borderRadius: "4px",
          maxWidth: 120,
        }}
      >
        <img
          src={lockIcon}
          alt="account"
          className={classes.iconImage}
        />
        <Typography
          component="span"
          sx={{
            fontFamily: "IRANSANS",
            fontSize: 14,
            maxWidth: 90,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {username}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 2,
              minWidth: 180,
              borderRadius: "12px",
              boxShadow: "rgba(100, 100, 111, 0.25) 0px 8px 24px 4px",
              overflow: "visible",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 2,
            pt: 1.5,
            pb: 1,
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              backgroundColor: "#379E79",
              color: "#FFFFFF",
              fontFamily: "IRANSANS",
              fontSize: 22,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {getAvatarLetter(username)}
          </Avatar>
          <Typography
            fontFamily="IRANSANS"
            fontSize={14}
            color="#333"
            textAlign="center"
            sx={{ wordBreak: "break-word", maxWidth: 160 }}
          >
            {username}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Button
          fullWidth
          onClick={handleLogoutClick}
          sx={{
            justifyContent: "center",
            color: "#D32F2F",
            fontFamily: "IRANSANS",
            fontSize: 13,
            py: 1.2,
            borderRadius: 0,
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.08)",
            },
          }}
        >
          خروج از حساب کاربری
        </Button>
      </Menu>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleCancelLogout}
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
          <ModalCloseButton onClick={handleCancelLogout} />
        </Box>
        <DialogTitle
          sx={{ fontFamily: "IRANSANS", fontSize: 18, textAlign: "center" }}
        >
          خروج از حساب
        </DialogTitle>
        <DialogContent>
          <Typography
            fontFamily="IRANSANS"
            fontSize={14}
            color="#555"
            textAlign="center"
          >
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2, px: 3 }}>
          <Button
            onClick={handleCancelLogout}
            variant="outlined"
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
            onClick={handleConfirmLogout}
            variant="contained"
            sx={{
              fontFamily: "IRANSANS",
              minWidth: 100,
              backgroundColor: "#D32F2F",
              "&:hover": { backgroundColor: "#B71C1C" },
            }}
          >
            خروج
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const LoginNavButton = ({ isActive, classes, onClick }) => (
  <Button
    onClick={onClick}
    variant="text"
    className={classes.navItem}
    sx={{
      marginRight: "2rem",
      borderRadius: "4px",
      ...(isActive && {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "scale(1.05)",
        transition: "all 0.3s ease-in-out",
      }),
    }}
  >
    <img src={lockIcon} alt="Sign" className={classes.iconImage} />
    ورود
  </Button>
);

export { UserAccountMenu, LoginNavButton };
