'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import io from 'socket.io-client';

interface CampaignInterestEvent {
    campaignId: number;
    campaignTitle: string;
    userId: string | number; 
    timestamp: string;
    message: string;
    interestId?: number;
}

interface RealtimeCampaignInterestsProps {
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const RealtimeCampaignInterests: React.FC<RealtimeCampaignInterestsProps> = ({ showSnackbar }) => {
    const [recentInterests, setRecentInterests] = useState<CampaignInterestEvent[]>([]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
    const port = process.env.NEXT_PUBLIC_PORT || '5641';
    const WS_URL = `${baseUrl}:${port}`; 

    useEffect(() => {
        const socket = io(WS_URL);

        socket.on('connect', () => {
            console.log('RealtimeCampaignInterests: Conectado al servidor WebSocket.');
            showSnackbar('Conectado al feed de intereses en tiempo real.', 'info');
        });

        socket.on('campaignInterest', (data: CampaignInterestEvent) => {
            console.log('RealtimeCampaignInterests: ¡Interés en campaña recibido vía WebSocket!', data);
            showSnackbar(`Nuevo interés: ${data.campaignTitle} por ${data.userId}`, 'info');

            setRecentInterests((prevInterests) => {
                const updatedList = [data, ...prevInterests];
                return updatedList.slice(0, 10); 
            });
        });

        socket.on('disconnect', () => {
            console.log('RealtimeCampaignInterests: Desconectado del servidor WebSocket.');
            showSnackbar('Desconectado del feed de intereses.', 'warning');
        });

        socket.on('connect_error', (err) => {
            console.error('RealtimeCampaignInterests: Error de conexión WebSocket:', err.message);
            showSnackbar(`Error de conexión al feed: ${err.message}`, 'error');
        });

        return () => {
            socket.disconnect();
            console.log('RealtimeCampaignInterests: WebSocket desconectado al desmontar el componente.');
        };
    }, [WS_URL, showSnackbar]); 

    return (
        <Paper elevation={0} sx={{ maxHeight: 300, overflowY: 'auto', p: 0, borderRadius: '8px', backgroundColor: 'transparent' }}>
            {recentInterests.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Esperando intereses de campañas...
                </Typography>
            ) : (
                <List dense>
                    {recentInterests.map((interest, index) => (
                        <React.Fragment key={interest.interestId || `${interest.campaignId}-${interest.userId}-${interest.timestamp}`}>
                            <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {new Date(interest.timestamp).toLocaleTimeString()} -{' '}
                                            <Typography component="span" variant="body2" fontWeight="bold">
                                                {interest.campaignTitle}
                                            </Typography>
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Usuario: {interest.userId}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < recentInterests.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default RealtimeCampaignInterests;