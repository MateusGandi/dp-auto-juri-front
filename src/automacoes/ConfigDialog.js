import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Grid2 as Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Formulario = ({ alertCustom }) => {
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
    pedido_final: "",
    adv_responsavel: "",
    adv_responsavel_cabecalho: "",
    oab_code: "",
    adv_email: "",
    adv_telefone: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  // Busca os dados do servidor ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://srv488264.hstgr.cloud/api/autojuri/automacao/markdown/config"
        );
        const { dados, login } = response.data || {};
        setFormData({
          login: login?.login || "",
          senha: login?.senha || "",
          pedido_final: dados?.pedido_final || "",
          adv_responsavel: dados?.adv_responsavel || "",
          adv_responsavel_cabecalho: dados?.adv_responsavel_cabecalho || "",
          oab_code: dados?.oab_code || "",
          adv_email: dados?.adv_email || "",
          adv_telefone: dados?.adv_telefone || "",
        });
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

    const updatedData = {
      dados: {
        name: "all-config",
        pedido_final: formData.pedido_final,
        adv_responsavel: formData.adv_responsavel,
        adv_responsavel_cabecalho: formData.adv_responsavel_cabecalho,
        oab_code: formData.oab_code,
        adv_email: formData.adv_email,
        adv_telefone: formData.adv_telefone,
      },
      login: {
        name: "info",
        login: formData.login,
        senha: formData.senha,
      },
    };

    try {
      await axios.put(
        "https://srv488264.hstgr.cloud/api/autojuri/automacao/markdown/config",
        {
          data: updatedData,
        }
      );
      alertCustom("Dados atualizados com sucesso!"); // Alerta de sucesso
    } catch (error) {
      console.error("Erro ao atualizar os dados:", error);
      alertCustom("Erro ao atualizar os dados."); // Alerta de erro
    }
  };

  // Alterna a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid container spacing={1}>
      <Grid size={12} sx={{ mb: 2 }}>
        {" "}
        <Typography variant="h6">Informações Padrão</Typography>
      </Grid>{" "}
      <Grid size={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="Login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type={showPassword ? "text" : "password"} // Altera o tipo com base no estado
                value={formData.senha}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="Pedido Final"
                name="pedido_final"
                value={formData.pedido_final}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="Advogado Responsável"
                name="adv_responsavel"
                value={formData.adv_responsavel}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Advogado Responsável (Cabeçalho)"
                name="adv_responsavel_cabecalho"
                value={formData.adv_responsavel_cabecalho}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="OAB Code"
                name="oab_code"
                value={formData.oab_code}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                name="adv_email"
                value={formData.adv_email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              {" "}
              <TextField
                fullWidth
                label="Telefone"
                name="adv_telefone"
                value={formData.adv_telefone}
                onChange={handleChange}
                variant="outlined"
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
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>{" "}
      </Grid>
    </Grid>
  );
};

export default Formulario;
