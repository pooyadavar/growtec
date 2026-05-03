import React from "react";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import assets from "../assets";
import { Link, useLocation } from "react-router-dom";

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

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();

  // Function to determine if a path is active
  const isActive = (path) => {
    // Special case: if current path is '/' and the tab path is '/Feeding', consider it active
    if (location.pathname === '/' && path === '/Feeding') {
      return true;
    }
    // For other paths, check if the current path starts with the tab's path
    return location.pathname.startsWith(path);
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
            <Button
              component={Link}
              to={"/login"}
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                borderRadius: "4px",
                ...(isActive("/login") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                }),
              }}
            >
              <img src={assets.svg.lock} alt="Sign" className={classes.iconImage} />
              ورود
            </Button>
          </div>
          <div className={classes.itemHandler}>
            <Button
              component={Link}
              to={"/Home"}
              variant="text"
              className={classes.navItem}
              sx={{
                ...(isActive("/Home") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: "8px",
                }),
              }}
            >
              <img src={assets.svg.homeIcon} alt="home" className={classes.iconImage} />
              خانه
            </Button>
            <Button
              component={Link}
              to={"/Feeding"}
              variant="text"
              className={classes.navItem}
              sx={{
                ...(isActive("/Feeding") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: "8px",
                }),
              }}
            >
              <img src={assets.svg.feeding} alt="feeding" className={classes.iconImage} />
              تغذیه
            </Button>
            <Button
              component={Link}
              to={"/irrigation"}
              variant="text"
              className={classes.navItem}
              sx={{
                ...(isActive("/irrigation") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: "8px",
                }),
              }}
            >
              <img src={assets.svg.water} alt="water" className={classes.iconImage} />
              آب‌رسانی
            </Button>
            <Button
              component={Link}
              to={"/payesh"}
              variant="text"
              className={classes.navItem}
              sx={{
                ...(isActive("/payesh") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: "8px",
                }),
              }}
            >
              <img src={assets.svg.monitoring} alt="Growtec" className={classes.iconImage} />
              پایش
            </Button>
            <Button
              component={Link}
              to={"/admin-settings"}
              variant="text"
              className={classes.navItem}
              sx={{
                ...(isActive("/admin-settings") && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: "8px",
                }),
              }}
            >
              <img src={assets.svg.setting} alt="setting" className={classes.iconImage} />
              تنظیمات
            </Button>
            <Button
              variant="text"
              className={classes.navItem}
            >
              <img src={assets.svg.history} alt="history" className={classes.iconImage} />
              تاریخچه
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Navbar;
