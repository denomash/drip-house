import { AppBar, Theme, Toolbar } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    appbar: {
      backgroundColor: `${theme.palette.common.white} !important`,
      position: "fixed",
    },
  })
);

const Header = () => {
  const classes = useStyles();
  const [token, setToken] = useState<null | string>(null);

  const setTokenFromLocalStorage = () =>
    setTimeout(() => {
      setToken(sessionStorage.getItem("token"));
    }, 2000);

  useEffect(() => {
    setTokenFromLocalStorage();
  }, []);

  return (
    <div className={classes.grow}>
      <AppBar position="absolute" className={classes.appbar}>
        <Toolbar>
          <h3 style={{ color: "#000", textTransform: "uppercase" }}>
            Drip House
          </h3>
          {token && (
            <Link
              style={{ marginLeft: "auto" }}
              to="/login"
              onClick={() => sessionStorage.removeItem("token")}
            >
              Logout
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
