'use client'
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
  Typography,
} from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'

interface LoginResponse {
  accessToken: string
  pkUser: number
  roles: string[]
}

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost'
  const port = process.env.NEXT_PUBLIC_PORT || '3000'

  // Evitar problemas de hidratación en Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    return true
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const response = await axios.post<LoginResponse>(
        `${baseUrl}:${port}/user/loginWithEmail`,
        { email, password },
        {
          // Solo considerar exitoso si es 2xx
          validateStatus: (status) => status >= 200 && status < 300,
        }
      )

      const { accessToken, pkUser, roles } = response.data

      // Log roles to console
      console.log('User roles:', roles)

      // Configurar Axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // Guardar token, pkUser y roles en el almacenamiento correspondiente
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('access_token', accessToken)
      storage.setItem('pkUser', pkUser.toString())
      storage.setItem('user_roles', JSON.stringify(roles))

      // Obtener datos del usuario en segundo plano
      axios
        .get(`${baseUrl}:${port}/user/findOne/${pkUser}`)
        .then((userResponse) => {
          storage.setItem('user', JSON.stringify(userResponse.data))
        })
        .catch((userError) => {
          console.warn('Failed to fetch user data:', userError)
        })

      // Redirigir inmediatamente
      router.push('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 403) {
        setError('Account is disabled or insufficient permissions')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Login failed. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Evitar render hasta que esté montado
  if (!mounted) return null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #36454F 0%, #B22222 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/images/icon-tnb.png"
                alt="TNB Logo"
                sx={{ maxWidth: '70px', marginBottom: '1rem', height: 'auto' }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: '#36454F',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}
              >
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
                type={showPassword ? 'text' : 'password'}
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

              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
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
                <Link
                  href="/auth/forgot-password"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#B22222',
                      cursor: loading ? 'default' : 'pointer',
                      '&:hover': {
                        textDecoration: loading ? 'none' : 'underline',
                      },
                      userSelect: 'none',
                      pointerEvents: loading ? 'none' : 'auto',
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    'linear-gradient(45deg, #B22222 30%, #36454F 90%)',
                  color: 'white',
                  padding: '12px',
                  '&:hover': {
                    background:
                      'linear-gradient(45deg, #36454F 30%, #B22222 90%)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default LoginPage
