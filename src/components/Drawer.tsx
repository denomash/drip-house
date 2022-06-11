import React, { useState } from "react";
import { IconButton, Theme } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import clsx from "clsx";
import { createStyles, makeStyles } from "@mui/styles";

import ROUTES, { RouteType } from "./Navigation/routesInfo";
import Collapsible from "./Navigation/Collapsible";

const drawerWidth: number = 240;
const drawerWidthClosed: number = 70;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: "#ffffff",
      float: "left",
      height: "96vh",
      boxShadow: "0px 1px 2px rgba(26, 29, 63, 0.1)",
    },
    button: {
      height: "24px",
      width: "24px",
      position: "fixed",
      zIndex: theme.zIndex.appBar,
      border: "1px solid #DADBE1",
      backgroundColor: theme.palette.common.white,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      boxShadow: " 0px 2px 4px 1px rgba(26, 29, 63, 0.1)",
      "&:hover": {
        backgroundColor: "#76778C",
        boxSizing: "border-box",
      },
    },
    buttonOpen: {
      left: "225px",
    },
    buttonClosed: {
      bottom: "200px",
      left: "56px",
    },
    drawerClose: {
      width: drawerWidthClosed,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      zIndex: "auto",
      marginTop: 53,
      [theme.breakpoints.down("sm")]: {
        zIndex: "120",
        marginTop: "45px",
      },
    },
    drawerOpen: {
      marginTop: 53,
      width: drawerWidth,
      zIndex: "auto",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.down("sm")]: {
        marginTop: "45px",
        zIndex: "120",
      },
    },
  })
);
const Drawer = () => {
  const classes = useStyles();
  const [drawerOpen] = useState(true);

  const [tabName, setTabName] = useState<string | null>(null);

  const toggleDrawer = () => {};
  return (
    <div
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen,
        [classes.drawerClose]: !drawerOpen,
      })}
    >
      {ROUTES.filter((r: any) => r.showOnNav).map((route: RouteType) => (
        <Collapsible
          open={drawerOpen}
          key={route.path}
          {...route}
          tabName={tabName}
          setTabName={setTabName}
        />
      ))}
      <IconButton
        onClick={toggleDrawer}
        className={clsx(classes.button, {
          [classes.buttonOpen]: drawerOpen,
          [classes.buttonClosed]: !drawerOpen,
        })}
      >
        {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </div>
  );
};

export default Drawer;
