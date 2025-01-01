import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  IconButton,
  Grid2 as Grid,
} from "@mui/material";
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import axios from "axios";
import { UploadArquivo } from "./Upload";

const DownloadList = ({ alertCustom, setReload }) => {
  const [arquivos, setArquivos] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Função para obter arquivos de ambos os endpoints
  const fetchArquivos = async () => {
    try {
      const [arquivosResponse, templatesResponse] = await Promise.all([
        axios.get("http://localhost:4607/documentos/arquivos"),
        axios.get("http://localhost:4607/documentos/arquivos-template"),
      ]);

      if (arquivosResponse) {
        const { parametros } = arquivosResponse.data;
        setArquivos(
          parametros.map((item) => ({
            document: "arquivos",
            idObject: item._id,
            ...item,
          }))
        );
      }
      if (templatesResponse) {
        const { parametros } = templatesResponse.data;
        setTemplates(
          parametros.map((item) => ({
            document: "arquivos-template",
            idObject: item._id,
            ...item,
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao obter arquivos ou templates", error);
      alertCustom("Erro ao carregar arquivos");
    }
  };

  useEffect(() => {
    fetchArquivos();
    setReload(fetchArquivos);
  }, []);

  // Função para fazer download do arquivo
  const handleDownload = (file, pasta) => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = `http://localhost:4607/documentos/${pasta}/${file}`;
    link.download = true;
    link.click();
  };

  // Função para excluir o arquivo
  const handleDelete = async (pasta, file, fileId) => {
    try {
      // Chama o endpoint para excluir o arquivo
      await axios.delete(`http://localhost:4607/documentos/${pasta}/${file}`);

      // Após excluir, removemos o arquivo da lista
      setArquivos((prevArquivos) =>
        prevArquivos.filter((file) => file.idObject !== fileId)
      );
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template.idObject !== fileId)
      );
      alertCustom("Arquivo removido!");
    } catch (error) {
      alertCustom("Erro ao excluir o arquivo");
      console.error("Erro ao excluir o arquivo", error);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Typography variant="h6" gutterBottom>
          Lista de Arquivos
          <Typography variant="body1" color="GrayText">
            Arquivos:
          </Typography>
        </Typography>
      </Grid>
      <Grid size={12}>
        <List>
          {arquivos.reverse().map((file) => (
            <ListItem
              className="show-box"
              key={file._id}
              sx={{ mt: 1, borderRadius: "10px", cursor: "pointer" }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" color="GrayText">
                    {file.name}
                  </Typography>
                }
              />
              <IconButton onClick={() => handleDownload(file.name, "arquivos")}>
                <FileDownloadIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  handleDelete(file.document, file.name, file.idObject)
                }
              >
                <CloseIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>{" "}
      <Grid size={12}>
        <Typography variant="body1" color="GrayText">
          Templates:
        </Typography>{" "}
      </Grid>
      <Grid size={12}>
        <List>
          {templates.reverse().map((template) => (
            <ListItem
              className="show-box"
              key={template.objectId}
              sx={{ mt: 1, borderRadius: "10px", cursor: "pointer" }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" color="GrayText">
                    {template.name}
                  </Typography>
                }
              />
              <IconButton
                onClick={() =>
                  handleDownload(template.name, "arquivos-template")
                }
              >
                <FileDownloadIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  handleDelete(
                    template.document,
                    template.name,
                    template.idObject
                  )
                }
              >
                <CloseIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid size={12}>
        <UploadArquivo />{" "}
      </Grid>
    </Grid>
  );
};

export default DownloadList;
