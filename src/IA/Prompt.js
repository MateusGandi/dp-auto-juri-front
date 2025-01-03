import React, { useState, useEffect, useRef } from "react";
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
import { AutoAwesome as IAIcon } from "@mui/icons-material";
import axios from "axios";

const ConversationInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ref para rolagem automática
  const messagesEndRef = useRef(null);

  // Ref para focar no campo de entrada
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Adicionando a mensagem do usuário
    const newMessage = {
      user: input,
      ai: "Aguardando resposta...",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);
    setInput(""); // Limpa o campo de input

    try {
      const response = await axios.post(
        "https://srv488264.hstgr.cloud/api/autojuri/automacao/IA/interact",
        {
          pergunta: input,
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
      event.preventDefault();
    }
  };

  // Função para rolar para o final do chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Efeito para rolar automaticamente quando as mensagens mudarem
  useEffect(() => {
    scrollToBottom();
    if (!loading && inputRef.current) {
      inputRef.current.focus(); // Foca no campo de entrada após enviar a mensagem
    }
  }, [messages, loading]);

  const renderAIResponse = (aiResponse) => {
    const formattedResponse = aiResponse
      .replace(/\*\*(.*?)\*\*/g, (match, text) => `<b>${text}</b>`)
      .replace(/\*(.*?)\*/g, (match, text) => `<i>${text}</i>`)
      .replace(/\n/g, "<br />");

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
          {/* Ref para rolagem automática */}
          <div ref={messagesEndRef} />
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
            onKeyPress={handleKeyPress}
            disabled={loading}
            inputRef={inputRef} // Ref para o campo de entrada
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
