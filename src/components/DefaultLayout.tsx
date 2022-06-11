import React, { ReactNode, useState } from "react";
import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";
import Drawer from "./Drawer";

const drawerWidth: number = 240;
const drawerWidthClosed: number = 72;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(1),
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentOpen: {
      marginLeft: `${drawerWidth}px`,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    contentClosed: {
      marginLeft: `${drawerWidthClosed}px`,
      width: `calc(100% - ${drawerWidthClosed}px)`,
    },
    pageContent: {
      paddingTop: "63px",
      height: "95vh",
      overflowY: "auto",
      backgroundColor: "#FAFAFA",
    },
  })
);

type LayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: LayoutProps) => {
  const classes = useStyles();
  const [drawerCollapsed] = useState(false);

  return (
    <>
      <Drawer />
      <main
        className={clsx(classes.content, {
          [classes.contentOpen]: drawerCollapsed,
          [classes.contentClosed]: !drawerCollapsed,
        })}
      >
        <div className={classes.pageContent}>
          <>{children}</>
        </div>
      </main>
    </>
  );
};

export default DefaultLayout;
