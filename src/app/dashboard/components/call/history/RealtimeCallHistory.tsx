'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Chip, CircularProgress, Avatar } from '@mui/material';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import io from 'socket.io-client';

const VOICE_URL = process.env.NEXT_PUBLIC_VOICE_SERVICE_URL || 'https://voice.thenationalbuilders.com';

const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    
    switch (s) {
        case 'completed':
            return { 
                bgColor: '#e8f5e9', 
                textColor: '#2e7d32', 
                label: 'Completed' 
            };
        case 'in-progress':
        case 'ringing':
            return { 
                bgColor: '#fff3e0', 
                textColor: '#ef6c00', 
                label: 'In-progress' 
            };
        case 'busy':
        case 'no-answer':
        case 'failed':
            return { 
                bgColor: '#ffeeee', 
                textColor: '#c62828', 
                label: 'Missed' 
            };
        default:
            return { 
                bgColor: '#f5f5f5', 
                textColor: '#616161', 
                label: status 
            };
    }
};

// Función para formatear segundos a minutos y segundos
const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds === 0) return '0s';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
};

export default function RealtimeCallHistory() {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const res = await fetch(`${VOICE_URL}/call/history/latest`);
                const data = await res.json();
                setCalls(data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchCalls();

        const socket = io(VOICE_URL);
        socket.on('new_call_history', (call) => {
            setCalls(prev => [call, ...prev].slice(0, 50));
        });
        return () => { socket.disconnect(); };
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>;

    return (
        <Box sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 }}>
            <List dense>
                {calls.map((call, index) => {
                    const style = getStatusStyles(call.status);
                    const isOut = call.direction === 'outbound';
                    return (
                        <React.Fragment key={call.id}>
                            <ListItem sx={{ py: 1.5 }}>
                                <Avatar sx={{ 
                                    bgcolor: isOut ? 'rgba(33, 150, 243, 0.08)' : 'rgba(156, 39, 176, 0.08)', 
                                    mr: 2,
                                    width: 40,
                                    height: 40,
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    {isOut ? 
                                        <PhoneForwardedIcon sx={{ color: '#1976d2', fontSize: 20 }} /> : 
                                        <PhoneCallbackIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
                                    }
                                </Avatar>
                                <ListItemText
                                    primary={<Typography variant="body2" fontWeight="700" color="text.primary">{call.toNumber}</Typography>}
                                    secondary={
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                            {new Date(call.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })} • {formatDuration(call.duration)}
                                        </Typography>
                                    }
                                />
                                <Chip 
                                    label={style.label} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: style.bgColor, 
                                        color: style.textColor, 
                                        fontWeight: '700', 
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        border: `1px solid ${style.textColor}20` 
                                    }} 
                                />
                            </ListItem>
                            {index < calls.length - 1 && <Divider variant="inset" component="li" sx={{ ml: 9, opacity: 0.6 }} />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
}