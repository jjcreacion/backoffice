'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #B22222 30%, #36454F 90%)",
  color: "white",
  padding: "12px",
  "&:hover": {
    background: "linear-gradient(45deg, #36454F 30%, #B22222 90%)",
  },
}));

const BackgroundContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #36454F 0%, #B22222 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const SocialButton = styled(Button)({
  flex: 1,
  borderRadius: "4px",
  padding: "8px",
  color: "#36454F",
  "&:hover": {
    backgroundColor: "rgba(54, 69, 79, 0.1)",
  },
});

interface LoginResponse {
  accessToken: string;
  pkUser: number;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
  const port = process.env.NEXT_PUBLIC_PORT || '3001';

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponse>(`${baseUrl}:${port}/user/loginWithEmail`, {
        email: email,
        password: password,
      });

      const { accessToken, pkUser } = response.data;

      // Obtener datos completos del usuario
      const userResponse = await axios.get(`${baseUrl}:${port}/user/findOne/${pkUser}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const userData = userResponse.data;

      // Guardar datos en storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('access_token', accessToken);
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('pkUser', pkUser.toString());

      // Configurar axios para futuras requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Redirigir al dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 403) {
        setError("Account is disabled or insufficient permissions");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BackgroundContainer>
      <Container maxWidth="sm">
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={"/images/icon-tnb.png"} alt="Login Image" style={{ maxWidth: '70px', marginBottom: '1rem' }} />
              <Typography variant="h4" component="h1" sx={{ color: "#36454F", fontWeight: "bold" }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Please sign in to continue
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" noValidate onSubmit={handleLogin}>
              <TextField
                fullWidth
                margin="normal"
                required
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                value={email}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope color="#36454F" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                required
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                autoComplete="current-password"
                value={password}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock color="#36454F" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Remember me"
                />
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "#B22222", 
                    cursor: loading ? "default" : "pointer", 
                    "&:hover": { textDecoration: loading ? "none" : "underline" } 
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Signing In..." : "Sign In"}
              </StyledButton>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </BackgroundContainer>
  );
};

export default LoginPage;