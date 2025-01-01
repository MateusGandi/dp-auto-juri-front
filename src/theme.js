// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#135AE6",
    },
    background: {
      // default: "#121212",
      // paper: "#1A1A1A",
      default: "#B8B8B8",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
