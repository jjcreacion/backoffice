'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fab,
  useTheme,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import CallEndIcon from '@mui/icons-material/CallEnd'
import BackspaceIcon from '@mui/icons-material/Backspace'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

interface Call {
  id: number
  number: string
  status: 'calling' | 'connected' | 'ended'
  startTime?: number
  duration: string
}

interface CallPanelProps {
  open: boolean
  onClose: () => void
  isMinimized: boolean
  onToggleMinimize: () => void
}

const CallPanel: React.FC<CallPanelProps> = ({ open, onClose, isMinimized, onToggleMinimize }) => {
  const theme = useTheme()
  const [inputNumber, setInputNumber] = useState('')
  const [calls, setCalls] = useState<Call[]>([])

  // Keypad numbers
  const keypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ]

  const handleKeyPress = (key: string) => {
    if (inputNumber.length < 15) {
      setInputNumber((prev) => prev + key)
    }
  }

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1))
  }

  const startCall = () => {
    if (!inputNumber || calls.length >= 3) return

    const newCall: Call = {
      id: Date.now(),
      number: inputNumber,
      status: 'calling',
      duration: '00:00',
    }

    setCalls((prev) => [...prev, newCall])
    setInputNumber('')

    // Simulate connection after 2-4 seconds
    setTimeout(() => {
      setCalls((prev) =>
        prev.map((c) =>
          c.id === newCall.id
            ? { ...c, status: 'connected', startTime: Date.now() }
            : c
        )
      )
    }, Math.random() * 2000 + 2000)
  }

  const endCall = (id: number) => {
    setCalls((prev) => prev.filter((c) => c.id !== id))
  }

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCalls((prevCalls) =>
        prevCalls.map((call) => {
          if (call.status === 'connected' && call.startTime) {
            const diff = Math.floor((Date.now() - call.startTime) / 1000)
            const minutes = Math.floor(diff / 60)
              .toString()
              .padStart(2, '0')
            const seconds = (diff % 60).toString().padStart(2, '0')
            return { ...call, duration: `${minutes}:${seconds}` }
          }
          return call
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open || isMinimized) return

      const { key } = event

      if (/^[0-9*#]$/.test(key)) {
        handleKeyPress(key)
      } else if (key === 'Backspace') {
        handleBackspace()
      } else if (key === 'Enter') {
        startCall()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isMinimized, inputNumber, calls])

  if (!open) return null

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        right: 0,
        top: 64, // Matches standard AppBar height
        width: isMinimized ? 60 : 320,
        height: 'calc(100vh - 64px)',
        zIndex: 1200, // Below standard modal (1300) but above content
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: 'hidden',
      }}
    >
      {/* Header / Toggle Bar */}
      <Box
        sx={{
          p: 1,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMinimized ? 'center' : 'space-between',
          minHeight: 56,
        }}
      >
        {!isMinimized && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Phone
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              ({calls.length}/3)
            </Typography>
          </Box>
        )}

        <IconButton
          onClick={onToggleMinimize}
          size="small"
          sx={{ color: 'inherit' }}
        >
          {isMinimized ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Minimized View */}
      {isMinimized && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            gap: 2,
          }}
        >
          <Tooltip title="Active Calls" placement="left">
            <Badge badgeContent={calls.length} color="error">
              <CallIcon color="action" />
            </Badge>
          </Tooltip>
        </Box>
      )}

      {/* Maximized View Content */}
      {!isMinimized && (
        <>
          {/* Active Calls List */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '40%' }}>
            <List dense>
              {calls.map((call) => (
                <ListItem
                  key={call.id}
                  sx={{
                    bgcolor:
                      call.status === 'calling'
                        ? theme.palette.action.hover
                        : 'transparent',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="end"
                      onClick={() => endCall(call.id)}
                      color="error"
                      size="small"
                    >
                      <CallEndIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          call.status === 'connected'
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                      }}
                    >
                      {call.status === 'connected' ? (
                        <PhoneInTalkIcon fontSize="small" />
                      ) : (
                        <CallIcon fontSize="small" />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={call.number}
                    secondary={
                      call.status === 'connected' ? call.duration : 'Calling...'
                    }
                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                  />
                </ListItem>
              ))}
              {calls.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">No active calls</Typography>
                </Box>
              )}
            </List>
          </Box>

          <Divider />

          {/* Keypad Area */}
          <Box sx={{ p: 2, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Display */}
            <Box
              sx={{
                width: '100%',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                position: 'relative',
              }}
            >
              <Typography variant="h5" align="center" sx={{ letterSpacing: 2 }}>
                {inputNumber || <span style={{ opacity: 0.3 }}>Enter #</span>}
              </Typography>
              {inputNumber && (
                <IconButton
                  size="small"
                  onClick={handleBackspace}
                  sx={{ position: 'absolute', right: 0 }}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Keys */}
            <Grid container spacing={1} justifyContent="center" sx={{ maxWidth: 240 }}>
              {keypad.map((row, rowIndex) => (
                <Grid container item xs={12} spacing={1} key={rowIndex} justifyContent="center">
                  {row.map((key) => (
                    <Grid item key={key}>
                      <Fab
                        size="small"
                        onClick={() => handleKeyPress(key)}
                        sx={{
                          boxShadow: 'none',
                          bgcolor: theme.palette.action.selected,
                          color: theme.palette.text.primary,
                          fontSize: '1.2rem',
                          width: 48,
                          height: 48,
                          '&:hover': {
                            bgcolor: theme.palette.action.focus,
                          },
                        }}
                      >
                        {key}
                      </Fab>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>

            {/* Call Button */}
            <Box sx={{ mt: 3 }}>
              <Fab
                color="success"
                aria-label="call"
                onClick={startCall}
                disabled={!inputNumber || calls.length >= 3}
                sx={{ width: 56, height: 56 }}
              >
                <CallIcon fontSize="medium" />
              </Fab>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  )
}

export default CallPanel
