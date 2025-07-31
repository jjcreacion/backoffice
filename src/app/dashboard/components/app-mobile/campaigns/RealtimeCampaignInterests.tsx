'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import io from 'socket.io-client';

// Define una interfaz para los datos que llegan del endpoint REST
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

// Interfaz para los datos que llegan del WebSocket
interface CampaignInterestEvent {
    campaignId: number;
    campaignTitle: string;
    userId: string | number;
    userEmail: string;
    timestamp: string;
    message: string;
    interestId?: number;
}

// Interfaz unificada para el estado del componente
interface CombinedInterest {
    id: number;
    campaignTitle: string;
    userIdentifier: string;
    timestamp: string;
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
                    userIdentifier: item.user.email,
                    timestamp: item.expressedAt,
                }));

                setRecentInterests(mappedInterests);
            } catch (error) {
                console.error('Error fetching initial interests:', error);
                showSnackbar('Error loading initial interests.', 'error');
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
            showSnackbar(`New interest: ${data.userEmail} in ${data.campaignTitle}`, 'info');

            const newInterest: CombinedInterest = {
                id: data.interestId || Date.now(),
                campaignTitle: data.campaignTitle,
                userIdentifier: data.userEmail,
                timestamp: data.timestamp,
            };

            setRecentInterests((prevInterests) => {
                const updatedList = [newInterest, ...prevInterests];
                return updatedList.slice(0, 10);
            });
        });

        socket.on('disconnect', () => {
            console.log('RealtimeCampaignInterests: Disconnected from WebSocket server.');
            showSnackbar('Disconnected from interest feed.', 'warning');
        });

        socket.on('connect_error', (err) => {
            console.error('RealtimeCampaignInterests: WebSocket connection error:', err.message);
            showSnackbar(`Connection error to feed: ${err.message}`, 'error');
        });

        return () => {
            socket.disconnect();
            console.log('RealtimeCampaignInterests: WebSocket disconnected on component unmount.');
        };
    }, [API_URL, WS_URL, showSnackbar]);

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
                                <ListItemText
                                    primary={
                                        <Typography component="span" variant="body2" color="text.primary">
                                            <Typography component="span" variant="body2" fontWeight="bold">
                                                {interest.userIdentifier}
                                            </Typography>
                                            {' showed interest in campaign '}
                                            <Typography component="span" variant="body2" fontWeight="bold">
                                                {interest.campaignTitle}
                                            </Typography>
                                            {` at ${new Date(interest.timestamp).toLocaleTimeString()}`}
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