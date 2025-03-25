import React from "react";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";

import { useState, useEffect } from "react";

import { getAllSpecialty } from "../../../services/userService";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import IconButton from "@material-ui/core/IconButton";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Divider from "@material-ui/core/Divider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-domv6";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "sticky",
    top: "0px",
    zIndex: "100",
  },
  root2: {
    width: "100wh",
    height: "100vh",
  },
  menu: {
    backgroundColor: "#ffffff !important",
  },
  menuTitle: {
    color: "#3c3c3c",
    fontSize: "20px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  bgImageListSpecialty: {
    width: "100px",
    height: "67px",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  listSpecialtyName: {
    marginLeft: "10px",
    fontSize: "14px",
    color: "#333",
  },
}));

const ListSpecialty = () => {
  const classes = useStyles();
  const [dataSpecialty, setDataSpecialty] = useState([]);

  const navigate = useNavigate();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    const fetchAllSpecialty = async () => {
      let res = await getAllSpecialty({});
      if (res && res.errCode === 0) {
        setDataSpecialty(res.data ? res.data : []);
      }
    };
    fetchAllSpecialty();
  }, []);

  const handleViewDetailSpecialty = (item) => {
    navigate(`/detail-specialty/${item.id}`);
  };
  const handleOnClickBackHome = () => (event) => {
    navigate(`/home`);
  };
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" className={classes.menu}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              className={classes.menuButton}
              onClick={handleOnClickBackHome()}
              aria-label="menu"
            >
              <KeyboardBackspaceIcon className={classes.menuIcon} />
            </IconButton>
            <Typography variant="h5" className={classes.menuTitle}>
                {language=="en" ? "Specialty" : "Chuyên khoa"}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Paper className={classes.root2}>
        <MenuList id="long-menu">
          {dataSpecialty &&
            dataSpecialty.length > 0 &&
            dataSpecialty.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleViewDetailSpecialty(item)}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <div
                        className={classes.bgImageListSpecialty}
                        style={{
                          backgroundImage: `url(${item.image})`,
                        }}
                      ></div>
                    </ListItemIcon>
                    <Typography
                      variant="inherit"
                      className={classes.listSpecialtyName}
                    >
                      {item.name}
                    </Typography>
                  </MenuItem>
                  <Divider />
                </div>
              );
            })}
        </MenuList>
      </Paper>
    </>
  );
};

export default ListSpecialty;
