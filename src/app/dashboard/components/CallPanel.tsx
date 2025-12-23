'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, IconButton, Grid, Paper, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Fab, useTheme, Divider, Tooltip, Badge,
} from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import CallEndIcon from '@mui/icons-material/CallEnd'
import BackspaceIcon from '@mui/icons-material/Backspace'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { useVoice } from "../../context/VoiceContext"

interface CallPanelProps {
  open: boolean
  onClose: () => void
  isMinimized: boolean
  onToggleMinimize: () => void
}

const CallPanel: React.FC<CallPanelProps> = ({ open, onClose, isMinimized, onToggleMinimize }) => {
  const theme = useTheme()
  const [inputNumber, setInputNumber] = useState('')
  const [callDuration, setCallDuration] = useState('00:00')
  
  const { initDevice, makeCall, hangup, isReady, currentCall } = useVoice()

  // 1. Inicialización automática con el pkUser de localStorage
  useEffect(() => {
    const pkUser = localStorage.getItem('pkUser')
    if (pkUser && open) {
      initDevice(pkUser) // Registra al agente con su ID real
    }
  }, [initDevice, open])

  // 2. Temporizador Real vinculado a currentCall
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentCall) {
      const startTime = Date.now()
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0')
        const seconds = (diff % 60).toString().padStart(2, '0')
        setCallDuration(`${minutes}:${seconds}`)
      }, 1000)
    } else {
      setCallDuration('00:00')
    }
    return () => clearInterval(interval)
  }, [currentCall])

  const handleKeyPress = (key: string) => {
    if (inputNumber.length < 15) setInputNumber((prev) => prev + key)
  }

  const handleBackspace = () => setInputNumber((prev) => prev.slice(0, -1))

  // 3. Función de llamada real
  const startCall = () => {
    if (!inputNumber || !isReady || currentCall) return
    makeCall(inputNumber)
    setInputNumber('')
  }

  // Soporte de teclado físico
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open || isMinimized) return
      const { key } = event
      if (/^[0-9*#]$/.test(key)) handleKeyPress(key)
      else if (key === 'Backspace') handleBackspace()
      else if (key === 'Enter') startCall()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, isMinimized, inputNumber, isReady, currentCall])

  if (!open) return null

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed', right: 0, top: 64,
        width: isMinimized ? 60 : 320,
        height: 'calc(100vh - 64px)',
        zIndex: 1200,
        display: 'flex', flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create('width'),
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 1, bgcolor: isReady ? theme.palette.primary.main : theme.palette.grey[500], color: 'white', display: 'flex', alignItems: 'center', justifyContent: isMinimized ? 'center' : 'space-between', minHeight: 56 }}>
        {!isMinimized && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Telefono</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {isReady ? '● En Línea' : '○ Conectando...'}
            </Typography>
          </Box>
        )}
        <IconButton onClick={onToggleMinimize} size="small" sx={{ color: 'inherit' }}>
          {isMinimized ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Minimized View */}
      {isMinimized && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, gap: 2 }}>
          <Badge variant="dot" color={isReady ? "success" : "error"}>
             <CallIcon color="action" />
          </Badge>
        </Box>
      )}

      {!isMinimized && (
        <>
          {/* Active Call List (Single call for now) */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <List dense>
              {currentCall ? (
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={hangup} color="error" size="small">
                      <CallEndIcon />
                    </IconButton>
                  }
                  sx={{ bgcolor: theme.palette.action.hover }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                      <PhoneInTalkIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={currentCall.parameters.To || "Llamada Activa"} 
                    secondary={callDuration} 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">No hay llamadas activas</Typography>
                </Box>
              )}
            </List>
          </Box>

          <Divider />

          {/* Keypad */}
          <Box sx={{ p: 2, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, position: 'relative' }}>
              <Typography variant="h5">{inputNumber || <span style={{ opacity: 0.3 }}>#</span>}</Typography>
              {inputNumber && (
                <IconButton size="small" onClick={handleBackspace} sx={{ position: 'absolute', right: 0 }}>
                  <BackspaceIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={1} justifyContent="center" sx={{ maxWidth: 240 }}>
              {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']].map((row, i) => (
                <Grid container item xs={12} spacing={1} key={i} justifyContent="center">
                  {row.map((key) => (
                    <Grid item key={key}>
                      <Fab size="small" onClick={() => handleKeyPress(key)} sx={{ boxShadow: 'none', bgcolor: 'action.selected', width: 48, height: 48 }}>
                        {key}
                      </Fab>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Fab
                color="success"
                onClick={startCall}
                disabled={!inputNumber || !isReady || !!currentCall}
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