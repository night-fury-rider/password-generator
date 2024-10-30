import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  Snackbar,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: "12px",
  border: "2px solid #3f51b5", // Example border color
  backgroundColor: "#f5f5f5",
}));

const App: React.FC = () => {
  const [length, setLength] = useState<number>(10);
  const [includeHash, setIncludeHash] = useState<boolean>(false);
  const [includeDollar, setIncludeDollar] = useState<boolean>(false);
  const [includeAt, setIncludeAt] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const generatePassword = () => {
    let charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    if (includeHash) charset += "#";
    if (includeDollar) charset += "$";
    if (includeAt) charset += "@";

    let generatedPassword = "";

    if (includeHash) generatedPassword += "#";
    if (includeDollar) generatedPassword += "$";
    if (includeAt) generatedPassword += "@";

    for (let i = generatedPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    generatedPassword = generatedPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | undefined,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" style={{ padding: "20px" }}>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Password Generator
        </Typography>

        <Typography gutterBottom>Length: {length}</Typography>
        <Slider
          value={length}
          min={8}
          max={20}
          onChange={(e, newValue) => setLength(newValue as number)}
          valueLabelDisplay="auto"
          style={{ marginBottom: "20px" }}
        />

        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ marginBottom: "20px" }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={includeHash}
                onChange={(e) => setIncludeHash(e.target.checked)}
              />
            }
            label="Include #"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeDollar}
                onChange={(e) => setIncludeDollar(e.target.checked)}
              />
            }
            label="Include $"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeAt}
                onChange={(e) => setIncludeAt(e.target.checked)}
              />
            }
            label="Include @"
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={generatePassword}
          style={{ marginTop: "16px" }}
        >
          Generate Password
        </Button>

        {password && (
          <div style={{ marginTop: "16px" }}>
            <Typography variant="h6">{password}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={copyToClipboard}
              style={{ marginTop: "8px" }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          message="Password copied to clipboard!"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            ></IconButton>
          }
        />
      </StyledPaper>
    </Container>
  );
};

export default App;
