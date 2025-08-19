'use client'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost'
      const port = process.env.NEXT_PUBLIC_PORT || '3000'
      const backendUrl = `${baseUrl}:${port}`

      const response = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('A recovery link has been sent to your email address.')
      } else {
        setError(data.message || 'Error sending recovery email')
      }
    } catch (error) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
                sx={{
                  maxWidth: '70px',
                  marginBottom: '1rem',
                  height: 'auto',
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: '#36454F',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Forgot Password
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 1,
                  textAlign: 'center',
                  maxWidth: '300px',
                }}
              >
                Enter your email address and we'll send you a link to reset your
                password
              </Typography>
            </Box>

            {/* Alerts */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                required
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope color="#36454F" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !email}
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Box textAlign="center">
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#B22222',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <FaArrowLeft size={12} />
                    Back to Sign In
                  </Typography>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
