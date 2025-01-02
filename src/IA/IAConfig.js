import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid2 as Grid,
} from "@mui/material";
import axios from "axios";

const PromptForm = ({ alertCustom }) => {
  const [formData, setFormData] = useState({
    apiKey: "",
    prompt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://srv488264.hstgr.cloud/api/autojuri/automacao/IA/config"
        );
        const { iaKey, prompt } = response.data || {};
        setFormData({ apiKey: iaKey || "", prompt: prompt || "" });
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        alertCustom("Erro ao buscar os dados.");
      }
    };
    fetchData();
  }, []);

  // Atualiza os campos do formulário
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Envia os dados atualizados para o servidor
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedData = {
        name: "prompt",
        iaKey: formData.apiKey,
        prompt: formData.prompt,
      };

      await axios.put(
        `http://srv488264.hstgr.cloud/api/autojuri/automacao/IA/config`,
        {
          data: updatedData,
        }
      );

      alertCustom("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar os dados:", error);
      alertCustom("Erro ao atualizar os dados.");
    }
  };

  return (
    <Grid container>
      <Grid size={12} sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Configuração de API e Prompt
        </Typography>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {" "}
          <Grid size={12}>
            {" "}
            <TextField
              fullWidth
              label="Chave de API"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid size={12}>
            {" "}
            <TextField
              fullWidth
              label="Prompt para leitura de arquivos"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              variant="outlined"
              multiline
              minRows={6}
            />
          </Grid>
          <Grid size={12} sx={{ textAlign: "right" }}>
            {" "}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              sx={{ borderRadius: "50px" }}
            >
              Enviar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default PromptForm;
