import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid2 as Grid,
} from "@mui/material";
import axios from "axios";
import {
  SaveAlt as DownloadIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import ArquivosList from "../Arquivos/index.js";
import Moldura from "../componentes/Moldura/index.js";

export const ProcessarArquivo = ({ alertCustom }) => {
  const [processNumber, setProcessNumber] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [clausulasFinais, setClausulasFinais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(null);
  const handleProcessNumberChange = (event) => {
    setProcessNumber(event.target.value);
  };

  const handleDownloadFile = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://srv488264.hstgr.cloud/api/autojuri/automacao/arquivo/${processNumber}`
      );
      console.log(response.data);
      const { arquivo, clausulasFinais } = response.data;

      // URL do arquivo para download
      setFileUrl(
        `https://srv488264.hstgr.cloud/api/autojuri/documentos/arquivos/${arquivo}`
      );

      // Ajustando as cláusulas finais para exibição
      const formattedClausulas = Object.keys(clausulasFinais).map((key) => ({
        numeroProcesso: key,
        clausulas: clausulasFinais[key],
      }));

      // Atualizando estado com as cláusulas finais
      setClausulasFinais(formattedClausulas);

      reload();
    } catch (err) {
      alertCustom("Ocorreu um erro ao gerar o arquivo ou ao buscar os dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função para copiar o texto para a área de transferência
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alertCustom("Cláusula copiada para a área de transferência!");
      },
      (err) => {
        alertCustom("Erro ao copiar para a área de transferência", err);
      }
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gerar Arquivo Comprobatório - Berna.AI
      </Typography>

      <Grid container spacing={2}>
        {" "}
        <Grid size={12}>
          <Moldura>
            <Grid container spacing={2}>
              <Grid size={{ md: 6, xs: 12 }}>
                {" "}
                <TextField
                  label="Número do Processo"
                  placeholder="Por exemplo: 6121248.06"
                  variant="standard"
                  value={processNumber}
                  onChange={handleProcessNumberChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid
                size={{ md: 6, xs: 12 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleDownloadFile}
                  disabled={loading || !processNumber}
                  sx={{
                    ml: 1,
                    borderRadius: "50px",
                    width: { xs: "100%", md: "auto" },
                  }}
                  endIcon={
                    loading ? (
                      <CircularProgress size={18} color="GrayText" />
                    ) : null
                  }
                >
                  Gerar Arquivo
                </Button>{" "}
                {fileUrl && (
                  <Button
                    variant="outlined"
                    target="_blank"
                    href={fileUrl}
                    download
                    disableElevation
                    sx={{
                      ml: 1,
                      borderRadius: "50px",
                      borderColor: "#000",
                      color: "#000",
                    }}
                  >
                    <DownloadIcon /> Baixar Arquivo
                  </Button>
                )}
              </Grid>
              <Grid size={12}>
                <Typography
                  variant="body1"
                  color="GrayText"
                  className="show-box"
                >
                  Informe o número do processo cujos arquivos foram julgados
                  pela Berna (IA do TJGO) como duplicados. Ao final, um arquivo
                  .docx que comprova o teor diferencial dos arquivos envolvidos
                  será gerado. A ação pode levar alguns minutos dependendo da
                  quantidade de arquivos envolvidos.
                </Typography>
              </Grid>
            </Grid>
          </Moldura>
        </Grid>
        <Grid size={6}>
          {clausulasFinais.length > 0 && (
            <Moldura>
              <Box sx={{ width: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Cláusulas Finais
                </Typography>
                {clausulasFinais.map(({ numeroProcesso, clausulas }, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>{`Nº ${numeroProcesso}`}</strong>
                    </Typography>
                    {clausulas.map((clausula, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          marginBottom: 1,
                        }}
                        className="show-box"
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          paragraph
                        >
                          {clausula}
                        </Typography>
                        <Tooltip title="Copiar cláusula" arrow>
                          <IconButton
                            onClick={() => handleCopyToClipboard(clausula)}
                          >
                            <CopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Moldura>
          )}
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          {" "}
          <Moldura>
            <ArquivosList alertCustom={alertCustom} setReload={setReload} />
          </Moldura>
        </Grid>
      </Grid>
    </Box>
  );
};
