import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { AutoAwesome as IAIcon } from "@mui/icons-material"; // Certifique-se de que esse é o ícone correto
import axios from "axios"; // Importando o axios

const ConversationInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return; // Não envia se o input estiver vazio

    // Adicionando a mensagem do usuário
    const newMessage = {
      user: input,
      ai: "Aguardando resposta...",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);
    setInput(""); // Limpa o campo de input

    try {
      // Fazendo a requisição POST com axios
      const response = await axios.post(
        "http://localhost:4607/automacao/IA/interact",
        {
          pergunta: input, // Envia a pergunta
        }
      );

      // Atualiza a mensagem com a resposta da IA
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          user: input,
          ai: response.data.resposta || "Sem resposta da IA",
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          user: input,
          ai: "Erro ao conectar com a IA",
        };
        return updatedMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSendMessage();
      event.preventDefault(); // Previne quebra de linha no TextField
    }
  };

  const renderAIResponse = (aiResponse) => {
    // Substitui padrões de formatação Markdown simples
    const formattedResponse = aiResponse
      .replace(/\*\*(.*?)\*\*/g, (match, text) => `<b>${text}</b>`) // Negrito
      .replace(/\*(.*?)\*/g, (match, text) => `<i>${text}</i>`) // Itálico
      .replace(/\n/g, "<br />"); // Quebras de linha

    return (
      <Typography
        variant="body1"
        sx={{ wordWrap: "break-word" }}
        dangerouslySetInnerHTML={{ __html: formattedResponse }}
      />
    );
  };

  return (
    <>
      <DialogContent>
        <Box
          sx={{
            flex: 1,
            padding: 2,
            display: "flex",
            overflowY: "auto",
            minHeight: "400px",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Box
                sx={{
                  alignSelf: "flex-end",
                  maxWidth: "70%",
                  backgroundColor: "#0078fe",
                  color: "#fff",
                  borderRadius: 2,
                  padding: "16px 24px",
                }}
              >
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {message.user}
                </Typography>
              </Box>

              <Box
                sx={{
                  alignSelf: "flex-start",
                  maxWidth: "70%",
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: "#000",
                  borderRadius: "10px",
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <IAIcon sx={{ color: "#0078fe" }} />
                {renderAIResponse(message.ai)}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            p: 1,
          }}
        >
          <TextField
            placeholder="Digite sua pergunta"
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Captura a tecla Enter
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "rgba(0,0,0,0.05)",
                borderRadius: "50px",
                padding: "2px 12px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Enviar...">
                  <IconButton
                    size="large"
                    onClick={handleSendMessage}
                    disabled={loading || input.trim() === ""}
                  >
                    <SendIcon
                      sx={{
                        ...(loading || input.trim() === ""
                          ? {}
                          : { color: "#0078fe" }),
                      }}
                    />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Box>
      </DialogActions>
    </>
  );
};

export default ConversationInterface;
