'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleClick = (event: any) => {  
    event.preventDefault(); 
    router.push('/dashboard')
  };

  return (
   <BackgroundContainer>
  <Container maxWidth="sm">
    <StyledCard>
      <CardContent sx={{ p: 4 }}>
        {/* Header FUERA del form */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={"/images/icon-tnb.png"} alt="Login Image" style={{ maxWidth: '70px', marginBottom: '1rem' }} />
          <Typography variant="h4" component="h1" sx={{ color: "#36454F", fontWeight: "bold" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Please sign in to continue
          </Typography>
        </Box>

        {/* Form con campos DENTRO */}
        <Box component="form" noValidate onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            margin="normal"
            required
            id="email"
            label="Email Address / Phone / Username"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            value={email}
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
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Remember me"
            />
            <Typography
              variant="body2"
              sx={{ color: "#B22222", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleClick}
          >
            Sign In
          </StyledButton>
        </Box>
      </CardContent>
    </StyledCard>
  </Container>
</BackgroundContainer> 
  );
};

export default LoginPage;