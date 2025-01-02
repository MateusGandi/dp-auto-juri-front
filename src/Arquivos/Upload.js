import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  CardActionArea,
  Grid2 as Grid,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";

export function UploadArquivo() {
  const [arquivo, setArquivo] = useState(null);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      setStatus("Selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("arquivos", arquivo);

    try {
      const response = await axios.post(
        `http://srv488264.hstgr.cloud/api/autojuri/template/upload-document`,
        formData
      );

      if (response.data) {
        setStatus("Arquivo enviado com sucesso!");
        setArquivo(null); // Zera o arquivo após envio
        setOpen(false); // Fecha o diálogo
      } else {
        setStatus("Erro ao enviar arquivo");
      }
    } catch (error) {
      setStatus("Erro ao enviar arquivo");
    }
  };

  const handleOpen = () => {
    setOpen(true); // Abre o diálogo
  };

  const handleClose = () => {
    setOpen(false); // Fecha o diálogo
    setStatus(""); // Limpa o status
  };

  return (
    <Grid size={12} sx={{ textAlign: "center" }}>
      <Button
        disableElevation
        variant="contained"
        color="primary"
        sx={{ borderRadius: "50px" }}
        startIcon={<AddIcon fontSize="large" />}
        onClick={handleOpen}
      >
        Novo Upload
      </Button>

      {/* Diálogo para upload */}
      <Dialog
        className="modal"
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload de Arquivo
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ marginBottom: 2 }}
            >
              Selecionar Arquivo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {arquivo && (
              <Typography variant="body2">
                Arquivo selecionado: <strong>{arquivo.name}</strong>
              </Typography>
            )}

            {status && (
              <Typography
                variant="body2"
                color={status.includes("Erro") ? "error" : "primary"}
              >
                {status}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!arquivo}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
