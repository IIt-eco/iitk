import React, { useState, useEffect, useRef } from "react";
import webSocketService from "../services/socket";
import { TextField, Typography, Box, Paper, IconButton, Avatar } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from "@mui/system";
import RoleSelection from "./RoleSelection";

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100vh',
  backgroundColor: '#000',
  color: '#fff',
  overflow: 'hidden'
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: '1px solid #333',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  overflowY: "auto",
  flexGrow: 1,
  borderBottom: '1px solid #333',
}));

const MessageWrapper = styled(Box)(({ isUser }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  padding: '5px',
}));

const MessagePaper = styled(Paper)(({ isUser }) => ({
  padding: '10px 15px',
  borderRadius: '20px',
  maxWidth: '60%',
  backgroundColor: isUser ? '#0b93f6' : '#333',
  color: '#fff',
  margin: '5px 0',
  display: 'flex',
  flexDirection: 'column',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#000',
  borderTop: '1px solid #333',
  position: 'relative'
}));

const InputField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#222',
  borderRadius: '20px',
  '& .MuiInputBase-input': {
    color: '#fff',
    padding: theme.spacing(1, 2),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [name, setName] = useState(localStorage.getItem("role") || "");
  const [isTyping, setIsTyping] = useState(false);
  const [typingRole, setTypingRole] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (!role || !name) return;

    webSocketService.connect();
    webSocketService.onMessage((message) => {
      if (message.typing !== undefined) {
        setIsTyping(message.typing);
        setTypingRole(message.role);
      } else {
        setMessages((prevMessages) => {
          return [...prevMessages, message];
        });
      }
    });

    fetchMessages();

    return () => {
      if (webSocketService.socket) {
        webSocketService.socket.close();
      }
    };
  }, [role, name]);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (input) {
        webSocketService.sendTyping(true, role);
      } else {
        webSocketService.sendTyping(false, role);
      }
    }, 300);

    return () => clearTimeout(typingTimeout);
  }, [input, role]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("https://eco-production-b089.up.railway.app/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const message = { text: input, role, time: new Date() };
    if (input === ".c") {
      setMessages([{ text: "student and tutor discussion", role: "system", time: new Date() }]);
    } else {
      webSocketService.sendMessage(message);
    }
    setInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleRoleSelection = (selectedRole, selectedName) => {
    setRole(selectedRole);
    setName(selectedName);
    localStorage.setItem("role", selectedRole);
    localStorage.setItem("name", selectedName);
  };

  if (!role || !name) {
    return <RoleSelection onRoleSelection={handleRoleSelection} />;
  }

  return (
    <ChatContainer>
      <Header>
        <Avatar src="/static/images/avatar/1.jpg" sx={{ marginRight: 2 }} />
        <Typography variant="h6">Sandeep</Typography>
      </Header>
      <MessageContainer ref={messageContainerRef}>
        {messages.length > 0 && messages.map((message, index) => (
          <MessageWrapper key={index} isUser={message.role === role}>
            {message.role !== role && <Avatar src="/static/images/avatar/1.jpg" sx={{ marginRight: 1 }} />}
            <MessagePaper isUser={message.role === role}>
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>
                {new Date(message.time).toLocaleTimeString()}
              </Typography>
            </MessagePaper>
          </MessageWrapper>
        ))}
        {isTyping && (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '10px' }}>
            {typingRole === "student" ? "Student is typing..." : "Tutor is typing..."}
          </Typography>
        )}
      </MessageContainer>
      <InputContainer>
        <IconButton>
          <PhotoCameraIcon sx={{ color: '#fff' }} />
        </IconButton>
        <InputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message..."
          variant="outlined"
        />
        <IconButton onClick={handleSend} sx={{ color: '#fff' }}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;