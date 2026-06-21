import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import assets from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserAccountMenu, LoginNavButton } from "./UserAccountMenu";

const LOGIN_REQUIRED_TOOLTIP = "ابتدا باید وارد شوید";

const useStyles = makeStyles(() => ({
  appBar: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    borderRadius: "10px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff !important",
    textDecoration: "none",
    minWidth: "100px",
    fontFamily: "IRANSANS !important",
  },
  iconImage: {
    marginBottom: "8px",
  },
  itemHandler: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "75%",
    alignItems: "center",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
  },
}));

const NavTab = ({
  to,
  label,
  icon,
  alt,
  isActive,
  requiresAuth = true,
  classes,
}) => {
  const { isAuthenticated } = useAuth();
  const canAccess = !requiresAuth || isAuthenticated;

  const activeSx = isActive
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "scale(1.05)",
        transition: "all 0.3s ease-in-out",
        borderRadius: "8px",
      }
    : {};

  if (canAccess) {
    return (
      <Button
        component={Link}
        to={to}
        variant="text"
        className={classes.navItem}
        sx={activeSx}
      >
        <img src={icon} alt={alt} className={classes.iconImage} />
        {label}
      </Button>
    );
  }

  return (
    <Tooltip title={LOGIN_REQUIRED_TOOLTIP} arrow placement="bottom">
      <span>
        <Button
          variant="text"
          className={classes.navItem}
          disabled
          sx={{
            opacity: 0.55,
            cursor: "not-allowed",
          }}
        >
          <img src={icon} alt={alt} className={classes.iconImage} />
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Container
      sx={{ display: "flex", justifyContent: "center", height: "6rem" }}
    >
      <AppBar
        position="static"
        className={classes.appBar}
        sx={{ backgroundColor: "#379E79" }}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoSection}>
            <img
              src={assets.svg.logoType}
              alt="Growtec"
              style={{ scale: "1.3" }}
            />
            {isAuthenticated ? (
              <UserAccountMenu classes={classes} />
            ) : (
              <LoginNavButton
                isActive={isActive("/login")}
                classes={classes}
                onClick={handleLoginClick}
              />
            )}
          </div>
          <div className={classes.itemHandler}>
            <NavTab
              to="/Home"
              label="خانه"
              icon={assets.svg.homeIcon}
              alt="home"
              isActive={isActive("/Home")}
              requiresAuth={false}
              classes={classes}
            />
            <NavTab
              to="/Feeding"
              label="تغذیه"
              icon={assets.svg.feeding}
              alt="feeding"
              isActive={isActive("/Feeding")}
              classes={classes}
            />
            <NavTab
              to="/irrigation"
              label="آبیاری"
              icon={assets.svg.water}
              alt="water"
              isActive={isActive("/irrigation")}
              classes={classes}
            />
            <NavTab
              to="/payesh"
              label="اقلیم"
              icon={assets.svg.monitoring}
              alt="Growtec"
              isActive={isActive("/payesh")}
              classes={classes}
            />
            <NavTab
              to="/admin-settings"
              label="تنظیمات"
              icon={assets.svg.setting}
              alt="setting"
              isActive={isActive("/admin-settings")}
              classes={classes}
            />
            <Tooltip
              title={isAuthenticated ? "" : LOGIN_REQUIRED_TOOLTIP}
              arrow
              placement="bottom"
              disableHoverListener={isAuthenticated}
              disableFocusListener={isAuthenticated}
            >
              <span>
                <Button
                  variant="text"
                  className={classes.navItem}
                  disabled={!isAuthenticated}
                  sx={{
                    opacity: isAuthenticated ? 1 : 0.55,
                  }}
                >
                  <img
                    src={assets.svg.history}
                    alt="history"
                    className={classes.iconImage}
                  />
                  تاریخچه
                </Button>
              </span>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Navbar;
