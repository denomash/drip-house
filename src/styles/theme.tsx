import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material";

const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: "#D84465",
      dark: "#D84465",
      light: "#FDF5F7",
    },
    secondary: {
      main: "#0F103A",
      dark: "#0F103A",
      light: "#EDEDF0",
    },
  },
  typography: {
    body1: {
      fontFamily: "WorkSans Regular",
    },
    body2: {
      fontFamily: "Lato Regular",
    },
    subtitle1: {
      fontFamily: "Sarabun Regular",
    },
  },
});

export default theme;
