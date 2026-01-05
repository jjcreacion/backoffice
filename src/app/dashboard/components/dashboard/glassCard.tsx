import React from 'react';
import { Card, styled } from '@mui/material';

const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(23, 23, 23, 0.8)' 
    : 'rgba(255, 255, 255, 0.95)', 
  
  backdropFilter: 'blur(16px)',
  
  border: `3px solid ${
    theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(0, 0, 0, 0.08)'
  }`,
  
  borderRadius: '24px',
  
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 40px -10px rgba(0, 0, 0, 0.7)'
    : '0 12px 30px -10px rgba(0, 0, 0, 0.15)',
  
  color: theme.palette.text.primary,
  overflow: 'visible',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    pointerEvents: 'none',
    boxShadow: theme.palette.mode === 'dark' 
        ? 'inset 0 1px 1px rgba(255,255,255,0.05)' 
        : 'inset 0 1px 1px rgba(255,255,255,1)', 
  }
}));

export default GlassCard;