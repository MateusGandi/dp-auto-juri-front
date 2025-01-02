import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid2 as Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  AutoAwesome as IAIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { ProcessarArquivo } from "./automacoes/ProcessarArquivo.js";
import Formulario from "./automacoes/ConfigDialog.js";
import IAConfig from "./IA/IAConfig.js";
import PromptForm from "./IA/Prompt.js";
import Snackbar from "@mui/material/Snackbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#135AE6",
    },
    background: {
      default: "#121212",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fff",
          borderRadius: "10px",
          color: "#000",
        },
      },
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  const [openSettings, setOpenSettings] = useState(false);
  const [openIA, setOpenIA] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    open: false,
  });
  const alertCustom = (message) => {
    setAlert({ message: message, open: true });

    setTimeout(() => {
      setAlert({ message: "", open: false });
    }, 5000);
  };
  const handleClose = () => {
    setAlert({ message: "", open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.open}
        message={alert.message}
        onClose={handleClose}
        autoHideDuration={5000} // Fechar automaticamente após 5 segundos
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#353535",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
      <CssBaseline />
      {/* Barra de navegação */}
      <AppBar
        elevation={0}
        position="static"
        sx={{ background: "transparent" }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Grid size={4}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Auto Juri
              </Typography>
            </Grid>

            <Grid>
              <IconButton onClick={() => setOpenSettings(true)}>
                <SettingsIcon sx={{ color: "#FFFFFF" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* Conteúdo principal */}
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "90vh",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{
            textAlign: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Texto principal */}
          <Grid size={12}>
            <Typography
              variant="h2"
              style={{
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Simplifique seu processo, amplie seus resultados
            </Typography>
          </Grid>

          {/* Texto descritivo */}
          <Grid size={12}>
            <Typography
              variant="h6"
              style={{ marginBottom: "40px", color: "#fff" }}
            >
              Automação para geração de documentos e interpretação com
              Inteligência Artificial
            </Typography>
          </Grid>

          {/* Botões */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              style={{
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
                borderRadius: "50px",
              }}
              startIcon={<IAIcon />}
              onClick={() => setOpenIA(true)}
            >
              Interagir com IA
            </Button>
          </Grid>
          <Grid item size={{ xs: 12, md: 4 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              style={{
                borderRadius: "50px",
              }}
              onClick={() => setOpenUpload(true)}
            >
              Comece agora
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog para Configurações */}
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        maxWidth="lg"
        fullScreen={window.innerWidth <= 600}
        fullWidth
      >
        <DialogTitle className="modal-title">
          Configurações
          <IconButton onClick={() => setOpenSettings(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              {" "}
              <Formulario alertCustom={alertCustom} />
            </Grid>
            <Grid size={6}>
              {" "}
              <IAConfig alertCustom={alertCustom} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Dialog para Interagir com IA */}
      <Dialog
        open={openIA}
        onClose={() => setOpenIA(false)}
        maxWidth="lg"
        fullScreen={window.innerWidth <= 600}
        fullWidth
      >
        <DialogTitle className="modal-title">
          Interação com IA
          <IconButton onClick={() => setOpenIA(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <PromptForm />
      </Dialog>

      {/* Dialog para Upload de Arquivo */}
      <Dialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        maxWidth="lg"
        fullScreen={window.innerWidth <= 600}
        fullWidth
      >
        <DialogTitle className="modal-title">
          Automações
          <IconButton onClick={() => setOpenUpload(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProcessarArquivo alertCustom={alertCustom} />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
