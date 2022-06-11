import { Avatar, Box, List, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavRouteType } from "./routesInfo";
import Sidebar from "./Sidebar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "auto",
      "&:hover": {
        cursor: "pointer",
      },
    },
    active: {
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.main,
      color: theme.palette.common.black,
      boxShadow: `inset 6px 0px 0px ${theme.palette.primary.dark}`,
      display: "flex",
      cursor: "pointer",
      marginTop: "24px",
      fontWeight: "bold",
      height: "36px",
      fontFamily: theme.typography.subtitle1.fontFamily,
    },
    title: {
      height: "36px",
      display: "flex",
      cursor: "pointer",
      marginTop: "24px",
      color: "#1A1D3F",
      padding: "4px, 24px, 4px, 24px",
    },
    heading: {
      marginLeft: "16px !important",
      marginTop: "10px !important",
      textTransform: "capitalize",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      lineHeight: "36px",
    },
    listItems: {
      width: "calc(100% - 62px)",
      paddingLeft: "58px",
      display: "block",
      marginTop: 0,
      left: 0,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    listItemsClosed: {
      marginLeft: "72px",
      marginTop: "-36px",
      position: "absolute",
      left: 0,
      zIndex: theme.zIndex.appBar + 1,
      padding: 0,
      borderRadius: "3px",
      filter: "drop-shadow(0px 1px 2px rgba(26, 29, 63, 0.1))",
    },
    listItemsDisplayNone: {
      display: "none",
    },
    iconContainer: {
      width: "100%",
      height: "36px",
    },
    icon: {
      height: "20px",
      width: "20px",
      marginLeft: "24px",
      marginTop: "9px",
      float: "left",
      borderRadius: "0px",
    },
    pointer: {
      display: "flex",
      flexDirection: "row",
      alignItems: " flex-start",
      padding: "8px 0px 0px",
      position: "static",
      width: " 10px",
      height: "100px",
      left: "0px",
      float: "left",
      top: "0px",
      flex: "none",
      order: 0,
      alignSelf: "stretch",
      flexGrow: 0,
      margin: " 0px 0px",
    },
    list: {
      float: "left",
      backgroundColor: theme.palette.common.white,
      width: "240px",
      marginLeft: "-4px",
      paddingBottom: "20px",
    },
    headingClosed: {
      display: "none",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    triangle: {
      width: "10px",
      height: "10px",
      marginLeft: "0",
      marginTop: 0,
      backgroundColor: theme.palette.common.white,
      transform: " rotate(45deg)",
    },
    listClosed: {
      padding: "0px !important",
      margin: 0,
    },
  })
);

type Props = {
  path: string;
  icon: any;
  name: string;
  subRoutes?: any;
  open: boolean;
  tabName: string | null;
  setTabName: any;
};

const Collapsible: React.FC<Props> = ({
  path,
  icon: Icon,
  name,
  subRoutes,
  open,
  tabName,
  setTabName,
}: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [subTabName] = useState<string | null>(null);
  const [visible] = useState<boolean>(true);
  const location = useLocation();
  const isActive = (routePath: string) => {
    if (subRoutes?.length > 0) {
      return subRoutes?.find((route: any) =>
        location.pathname.startsWith(route.path)
      );
    }
    return location.pathname.startsWith(routePath);
  };
  const getIcon = (PassedIcon: any) =>
    typeof Icon === "object" ? (
      <PassedIcon className={classes.icon} />
    ) : (
      <Avatar className={classes.icon} src={PassedIcon} />
    );

  const onClickRoute = () => {
    setTabName(name);
    if (subRoutes?.length > 0) {
      // setVisible(!visible);

      if (!subTabName && subTabName === subRoutes[0].title) {
        navigate(subRoutes[0].path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <Box
      className={classes.root}
      key={path}
      onClick={onClickRoute}
      aria-expanded="false"
      role="button"
    >
      {/* control the behaviour of each tab in the side drawer */}
      <div
        aria-controls="panel1a-content"
        className={isActive(path) ? classes.active : classes.title}
      >
        <span className={!open ? classes.iconContainer : ""}>
          {getIcon(Icon)}
        </span>
        <span>
          <Typography
            className={open ? classes.heading : classes.headingClosed}
          >
            {name}
          </Typography>
        </span>
      </div>
      {subRoutes?.length > 0 && (
        <div
          className={
            !open && name === tabName
              ? visible
                ? classes.listItemsClosed
                : classes.listItemsDisplayNone
              : open && name === tabName && visible
              ? classes.listItems
              : classes.listItemsDisplayNone
          }
        >
          {!open && (
            <div className={classes.pointer}>
              <div className={classes.triangle} />
            </div>
          )}
          <List className={!open ? classes.list : classes.listClosed}>
            {subRoutes?.length > 0 &&
              subRoutes.map((route: NavRouteType) => (
                <Sidebar key={route.path} {...route} />
              ))}
          </List>
        </div>
      )}
    </Box>
  );
};

Collapsible.defaultProps = {
  subRoutes: [],
};
export default Collapsible;
