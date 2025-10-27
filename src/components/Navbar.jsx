import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import assets from "../assets";
import { Link } from "react-router-dom";


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
    color: "#fff",
    textDecoration: "none",
  },
  icon: {
    fontSize: 24,
  },
  title: {
    flexGrow: 1,
    textAlign: "right",
  },
  itemHandler: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    width: "75%",
  },
}));

const Navbar = () => {
  const classes = useStyles();

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={assets.svg.logoType}
              alt="Growtec"
              style={{ scale: "1.3" }}
            />
            <Button
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.lock} alt="Sign" />
              ورود
            </Button>
          </div>
          <div className={classes.itemHandler}>
            <Link
              to={"/Home"}
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.homeIcon} alt="home" />
              خانه
            </Link>
            <Link
              to={"/Feeding"}
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.feeding} alt="feeding" />
              تغذیه
            </Link>
            <Button
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.water} alt="water" />
              آب‌رسانی
            </Button>
            <Button
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.monitoring} alt="Growtec" />
              پایش
            </Button>
            <Button
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.setting} alt="setting" />
              تنظیمات
            </Button>
            <Button
              variant="text"
              className={classes.navItem}
              sx={{
                marginRight: "2rem",
                color: "#ffff",
                borderRadius: "4px",
                fontFamily: "IRANSANS",
              }}
            >
              <img src={assets.svg.history} alt="history" />
              تاریخچه
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Navbar;
