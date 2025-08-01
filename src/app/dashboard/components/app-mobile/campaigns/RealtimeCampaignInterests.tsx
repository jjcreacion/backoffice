'use client';

import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Chip, 
    Link,
    Badge 
} from '@mui/material';
import io from 'socket.io-client';
import NextLink from 'next/link';

// Definiciones de tipos (interfaces)
interface RestInterest {
    pk_interests: number;
    campaignId: number;
    fkUserId: number;
    expressedAt: string;
    campaign: {
        title: string;
    };
    user: {
        pkUser: number;
        email: string;
    };
}

interface CampaignInterestEvent {
    campaignId: number;
    campaignTitle: string;
    userId: string | number;
    userEmail: string;
    timestamp: string;
    message: string;
    interestId?: number;
}

interface CombinedInterest {
    id: number;
    campaignTitle: string;
    userIdentifier: string | number; 
    userEmail: string;
    timestamp: string;
    isNew?: boolean; // Nuevo campo para el distintivo 'New'
}

interface RealtimeCampaignInterestsProps {
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const RealtimeCampaignInterests: React.FC<RealtimeCampaignInterestsProps> = ({ showSnackbar }) => {
    const [recentInterests, setRecentInterests] = useState<CombinedInterest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
    const port = process.env.NEXT_PUBLIC_PORT || '5641';
    const WS_URL = `${baseUrl}:${port}`;
    const API_URL = `${baseUrl}:${port}/mobile-campaigns/interests/last-10`;

    useEffect(() => {
        const fetchInitialInterests = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data: RestInterest[] = await response.json();

                const mappedInterests: CombinedInterest[] = data.map((item) => ({
                    id: item.pk_interests,
                    campaignTitle: item.campaign.title,
                    userEmail: item.user.email,
                    userIdentifier: item.user.pkUser,
                    timestamp: item.expressedAt,
                }));

                setRecentInterests(mappedInterests);
            } catch (error) {
                console.error('Error fetching initial interests:', error);
                //showSnackbar('Error loading initial interests.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialInterests();

        const socket = io(WS_URL);

        socket.on('connect', () => {
            console.log('RealtimeCampaignInterests: Connected to WebSocket server.');
        });

        socket.on('campaignInterest', (data: CampaignInterestEvent) => {
           // showSnackbar(`New interest: ${data.userEmail} in ${data.campaignTitle}`, 'info');

            const newInterest: CombinedInterest = {
                id: data.interestId || Date.now(),
                campaignTitle: data.campaignTitle,
                userIdentifier: data.userId,
                userEmail: data.userEmail,
                timestamp: data.timestamp,
                isNew: true, // Se marca como nuevo al recibir la notificación
            };
         
            setRecentInterests((prevInterests) => {
                const updatedList = [newInterest, ...prevInterests];
                return updatedList.slice(0, 10);
            });
        });

        socket.on('disconnect', () => {
            console.log('RealtimeCampaignInterests: Disconnected from WebSocket server.');
            //showSnackbar('Disconnected from interest feed.', 'warning');
        });

        socket.on('connect_error', (err) => {
            console.error('RealtimeCampaignInterests: WebSocket connection error:', err.message);
            //showSnackbar(`Connection error to feed: ${err.message}`, 'error');
        });
        
        // Timer para quitar el distintivo 'New' después de 2 minutos
        const timer = setTimeout(() => {
            setRecentInterests(prevInterests =>
                prevInterests.map(interest => ({ ...interest, isNew: false }))
            );
        }, 2 * 60 * 1000); // 2 minutos en milisegundos

        return () => {
            socket.disconnect();
            clearTimeout(timer); // Limpia el temporizador para evitar fugas de memoria
            console.log('RealtimeCampaignInterests: WebSocket disconnected and timer cleared.');
        };
    }, [API_URL, WS_URL]);

    return (
        <Paper elevation={0} sx={{ maxHeight: 300, overflowY: 'auto', p: 0, borderRadius: '8px', backgroundColor: 'transparent' }}>
            {loading ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Loading interests...
                </Typography>
            ) : recentInterests.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No recent campaign interests.
                </Typography>
            ) : (
                <List dense>
                    {recentInterests.map((interest, index) => (
                        <React.Fragment key={interest.id}>
                            <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                                <Badge
                                    color="secondary"
                                    variant="dot"
                                    invisible={!interest.isNew}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -10,
                                            top: 10,
                                            border: '2px solid',
                                            borderColor: 'background.paper',
                                            padding: '0 4px',
                                            backgroundColor: '#4caf50' // Color verde para el badge
                                        },
                                        width: '100%'
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography component="span" variant="body2" color="text.primary">
                                                <NextLink href={`/dashboard/contact_detail/${interest.userIdentifier}`} passHref>
                                                    <Chip
                                                        component="a" // Importante para que el Link de MUI funcione correctamente con NextLink
                                                        label={interest.userEmail}
                                                        clickable
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mr: 1 }}
                                                    />
                                                </NextLink>
                                                {' showed interest in campaign '}
                                                <Typography component="span" variant="body2" fontWeight="bold">
                                                    {interest.campaignTitle}
                                                </Typography>
                                                {` at ${new Date(interest.timestamp).toLocaleTimeString()}`}
                                            </Typography>
                                        }
                                    />
                                </Badge>
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