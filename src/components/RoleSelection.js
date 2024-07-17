import React, { useState } from "react";
import { Button, Container, Typography, TextField, Box } from "@mui/material";

const RoleSelection = ({ onRoleSelection }) => {
  const [selectedRole, setSelectedRole] = useState("student");
  const [name, setNameInput] = useState("");

  const handleRoleSelection = () => {
    onRoleSelection(selectedRole, name);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8, textAlign: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Select Role
      </Typography>
      <Box>
        <TextField
          value={name}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter your name"
          fullWidth
          sx={{ marginBottom: 4 }}
        />
        <Button
          variant={selectedRole === "student" ? "contained" : "outlined"}
          onClick={() => setSelectedRole("student")}
          sx={{ marginRight: 2 }}
        >
          Student
        </Button>
        <Button
          variant={selectedRole === "tutor" ? "contained" : "outlined"}
          onClick={() => setSelectedRole("tutor")}
        >
          Tutor
        </Button>
      </Box>
      <Button
        variant="contained"
        sx={{ marginTop: 4, backgroundColor: "pink" }}
        onClick={handleRoleSelection}
        disabled={!name}
      >
        Start Chat
      </Button>
    </Container>
  );
};

export default RoleSelection;