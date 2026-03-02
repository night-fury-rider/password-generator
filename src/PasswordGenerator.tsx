import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Paper,
  Slider,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCallback, useState } from "react";

import {
  DEFAULT_PASSWORD_LENGTH,
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
} from "$/constants/app.config.constants";
import { COLORS } from "$/constants/colors.constants";
import { STRINGS } from "$/constants/strings.constants";
import {
  generatePassword,
  getPasswordStrength,
} from "$/services/PasswordGeneratorService";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
  palette: {
    background: {
      default: COLORS.backgroundPage,
      paper: COLORS.backgroundCard,
    },
    mode: "dark",
    primary: { main: COLORS.accent },
    text: { primary: COLORS.textPrimary, secondary: COLORS.textSecondary },
  },
  typography: {
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
  },
});

const PasswordGenerator = () => {
  const [copied, setCopied] = useState(false);
  const [includeAt, setIncludeAt] = useState(false);
  const [includeDollar, setIncludeDollar] = useState(true);
  const [includeHash, setIncludeHash] = useState(false);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [length, setLength] = useState(DEFAULT_PASSWORD_LENGTH);
  const [password, setPassword] = useState(() =>
    generatePassword({
      includeAt: false,
      includeDollar: true,
      includeHash: false,
      includeNumber: true,
      length: DEFAULT_PASSWORD_LENGTH,
    }),
  );
  const [snackOpen, setSnackOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setSnackOpen(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [password]);

  const handleGenerate = useCallback(() => {
    setPassword(
      generatePassword({
        includeAt,
        includeDollar,
        includeHash,
        includeNumber,
        length,
      }),
    );
  }, [includeAt, includeDollar, includeHash, includeNumber, length]);

  const handleLengthChange = useCallback(
    (_: Event, value: number | number[]) => {
      setLength(value as number);
    },
    [],
  );

  const strength = getPasswordStrength(length);

  const checkboxes = [
    {
      color: COLORS.checkboxNumber,
      label: STRINGS.checkboxNumber,
      setter: setIncludeNumber,
      value: includeNumber,
    },
    {
      color: COLORS.checkboxDollar,
      label: STRINGS.checkboxDollar,
      setter: setIncludeDollar,
      value: includeDollar,
    },
    {
      color: COLORS.checkboxHash,
      label: STRINGS.checkboxHash,
      setter: setIncludeHash,
      value: includeHash,
    },
    {
      color: COLORS.checkboxAt,
      label: STRINGS.checkboxAt,
      setter: setIncludeAt,
      value: includeAt,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          alignItems: "center",
          background: `radial-gradient(ellipse at 15% 60%, ${COLORS.accentDim} 0%, transparent 55%),
                       radial-gradient(ellipse at 85% 20%, rgba(255,107,53,0.06) 0%, transparent 55%),
                       ${COLORS.backgroundPage}`,
          display: "flex",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1.5px solid",
            borderColor: COLORS.borderActive,
            borderRadius: 4,
            boxShadow: `0 0 60px ${COLORS.accentGlow}, 0 32px 64px rgba(0,0,0,0.6)`,
            maxWidth: 540,
            overflow: "hidden",
            p: { sm: 5, xs: 3 },
            position: "relative",
            width: "100%",
            "&::before": {
              background: COLORS.topBarGradient,
              content: '""',
              height: "2px",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            },
          }}
        >
          {/* Header */}
          <Stack alignItems="center" direction="row" mb={4} spacing={1.5}>
            <Box
              sx={{
                bgcolor: COLORS.accentDim,
                border: `1px solid ${COLORS.borderDefault}`,
                borderRadius: 2,
                display: "flex",
                p: 1,
              }}
            >
              <LockOpenIcon sx={{ color: COLORS.accent, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: COLORS.textPrimary,
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                }}
                variant="h6"
              >
                {STRINGS.appTitle}
              </Typography>

              <Typography
                sx={{
                  color: COLORS.textSecondary,
                  display: { xs: "none", sm: "block" },
                  fontSize: "0.7rem",
                }}
                variant="caption"
              >
                {STRINGS.appSubtitle}
              </Typography>
            </Box>
          </Stack>

          {/* Password Display */}
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "rgba(0,0,0,0.45)",
              border: `1px solid ${COLORS.borderDefault}`,
              borderRadius: 2.5,
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              mb: 1,
              minHeight: 68,
              p: 2,
            }}
          >
            <Typography
              sx={{
                color: COLORS.passwordText,
                flex: 1,
                fontSize: { sm: "1.1rem", xs: "0.9rem" },
                fontWeight: 700,
                letterSpacing: "0.14em",
                textShadow: `0 0 24px ${COLORS.accentGlow}`,
                wordBreak: "break-all",
              }}
            >
              {password}
            </Typography>
            <Tooltip
              title={
                copied ? STRINGS.copyTooltipCopied : STRINGS.copyTooltipDefault
              }
            >
              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{
                  bgcolor: copied ? "rgba(74,222,128,0.12)" : COLORS.accentDim,
                  border: "1px solid",
                  borderColor: copied
                    ? "rgba(74,222,128,0.4)"
                    : COLORS.borderDefault,
                  color: copied ? COLORS.checkboxDollar : COLORS.accent,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: copied
                      ? "rgba(74,222,128,0.2)"
                      : "rgba(0,255,200,0.18)",
                  },
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Strength Chip */}
          <Stack justifyContent="flex-end" direction="row" mb={3.5}>
            <Chip
              label={strength.label}
              size="small"
              sx={{
                bgcolor: `${strength.color}18`,
                border: `1px solid ${strength.color}44`,
                color: strength.color,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            />
          </Stack>

          {/* Length Slider */}
          <Box mb={4}>
            <Stack direction="row" justifyContent="space-between" mb={1.5}>
              <Typography
                sx={{
                  color: COLORS.textSecondary,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {STRINGS.labelPasswordLength}
              </Typography>
              <Box
                sx={{
                  bgcolor: COLORS.accentDim,
                  border: `1px solid ${COLORS.borderDefault}`,
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.2,
                }}
              >
                <Typography
                  sx={{
                    color: COLORS.accent,
                    fontSize: "0.9rem",
                    fontWeight: 900,
                  }}
                >
                  {length}
                </Typography>
              </Box>
            </Stack>
            <Slider
              max={PASSWORD_LENGTH_MAX}
              min={PASSWORD_LENGTH_MIN}
              onChange={handleLengthChange}
              step={1}
              value={length}
              sx={{
                color: COLORS.accent,
                "& .MuiSlider-rail": { bgcolor: "rgba(255,255,255,0.08)" },
                "& .MuiSlider-thumb": {
                  boxShadow: `0 0 12px ${COLORS.accentGlow}`,
                  height: 18,
                  width: 18,
                  "&:hover": { boxShadow: `0 0 20px ${COLORS.accent}` },
                },
                "& .MuiSlider-track": {
                  background: `linear-gradient(90deg, ${COLORS.accent}, #00b4d8)`,
                  border: "none",
                },
              }}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: COLORS.textMuted, fontSize: "0.68rem" }}>
                {PASSWORD_LENGTH_MIN}
              </Typography>
              <Typography sx={{ color: COLORS.textMuted, fontSize: "0.68rem" }}>
                {PASSWORD_LENGTH_MAX}
              </Typography>
            </Stack>
          </Box>

          {/* Checkboxes */}
          <Box
            mb={4}
            sx={{
              bgcolor: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              sx={{
                color: COLORS.textSecondary,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                mb: 1.5,
                textTransform: "uppercase",
              }}
            >
              {STRINGS.labelRequiredCharacters}
            </Typography>
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={0.5}
            >
              {checkboxes.map(({ color, label, setter, value }) => (
                <FormControlLabel
                  key={label}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => setter(e.target.checked)}
                      size="small"
                      sx={{
                        color: "rgba(255,255,255,0.25)",
                        p: 0.75,
                        "&.Mui-checked": { color },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: value ? color : COLORS.textSecondary,
                        fontSize: "0.78rem",
                        fontWeight: value ? 700 : 400,
                        transition: "color 0.2s",
                      }}
                    >
                      {label}
                    </Typography>
                  }
                  sx={{ ml: 0, mr: 1.5 }}
                />
              ))}
            </Stack>
          </Box>

          {/* Generate Button */}
          <Button
            fullWidth
            onClick={handleGenerate}
            size="large"
            startIcon={<RefreshIcon />}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%)`,
              boxShadow: `0 4px 28px ${COLORS.accentGlow}`,
              color: "#060a10",
              fontSize: "0.95rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              py: 1.6,
              transition: "all 0.2s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${COLORS.accent} 0%, #00d4ff 100%)`,
                boxShadow: `0 6px 36px rgba(0,255,200,0.45)`,
                transform: "translateY(-1px)",
              },
            }}
          >
            {STRINGS.generateButton}
          </Button>

          {/* Excluded chars note */}
          <Typography
            sx={{
              color: COLORS.textMuted,
              display: { xs: "none", sm: "block" },
              fontSize: "0.65rem",
              mt: 2.5,
              opacity: 0.7,
              textAlign: "center",
            }}
            variant="caption"
          >
            {STRINGS.excludedNote}: 0, o, O, 1, I, l, q
          </Typography>
        </Paper>

        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          autoHideDuration={2000}
          onClose={() => setSnackOpen(false)}
          open={snackOpen}
        >
          <Alert
            severity="success"
            sx={{ fontFamily: "inherit" }}
            variant="filled"
          >
            {STRINGS.copyConfirmation}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export { PasswordGenerator };
