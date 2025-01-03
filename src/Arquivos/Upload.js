import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import axios from "axios";

export function UploadArquivo({ alertCustom }) {
  const [arquivo, setArquivo] = useState(null);
  const [open, setOpen] = useState(false);

  const validateFile = (file) => {
    return (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (validateFile(file)) {
        setArquivo(file);
      } else {
        alertCustom("Por favor, envie apenas arquivos .docx (Word)");
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (validateFile(file)) {
        setArquivo(file);
      } else {
        alertCustom("Por favor, envie apenas arquivos .docx.");
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!arquivo) {
      alertCustom("Selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivos", arquivo);

    try {
      const response = await axios.post(
        `https://srv488264.hstgr.cloud/api/autojuri/template/upload-document`,
        formData
      );

      if (response.data) {
        alertCustom("Arquivo enviado com sucesso!");
        setArquivo(null); // Zera o arquivo após envio
        setOpen(false); // Fecha o diálogo
      } else {
        alertCustom("Erro ao enviar arquivo.");
      }
    } catch (error) {
      alertCustom("Erro ao enviar arquivo.");
    }
  };

  const handleOpen = () => {
    setOpen(true); // Abre o diálogo
  };

  const handleClose = () => {
    setOpen(false); // Fecha o diálogo
    setArquivo(null); // Reseta o arquivo selecionado
  };

  return (
    <Grid container justifyContent="center">
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

      <Dialog
        className="modal"
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="modal-title">
          Upload de Arquivo
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              border: "2px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <UploadIcon fontSize="large" />
            <Typography>
              Arraste e solte um arquivo .docx aqui ou clique no botão abaixo.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              component="label"
              sx={{
                marginTop: 2,
                background: "transparent",
                color: "GrayText",
              }}
            >
              Selecionar Arquivo
              <input
                type="file"
                hidden
                accept=".docx"
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          {arquivo && (
            <Typography variant="body2">
              Arquivo selecionado: <strong>{arquivo.name}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disableElevation
            sx={{ borderRadius: "50px" }}
            disabled={!arquivo}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
