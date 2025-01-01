import React from "react";
import { Paper } from "@mui/material";

const Moldura = ({ children }) => {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        padding: 2,
        width: "100%",
        border: "3px solid rgba(0, 0, 0, 0.05)",
        background: "transparent",
        borderRadius: "10px",
      }}
    >
      {children}
    </Paper>
  );
};

export default Moldura;
