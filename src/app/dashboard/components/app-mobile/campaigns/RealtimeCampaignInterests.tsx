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
    Badge 
} from '@mui/material';
import io from 'socket.io-client';
import NextLink from 'next/link';

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
        person:{
            contacts: Contact[];
        }
    };
}

interface CampaignInterestEvent {
    campaignId: number;
    campaignTitle: string;
    userId: string | number;
    contactIdentifier: string | number; 
    userEmail: string;
    timestamp: string;
    message: string;
    interestId?: number;
}

interface CombinedInterest {
    id: number;
    campaignTitle: string;
    userIdentifier: string | number; 
    contactIdentifier: string | number;
    userEmail: string;
    timestamp: string;
    isNew?: boolean; 
}

interface Contact {
    pkContact: number;
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
                
                const mappedInterests: CombinedInterest[] = data.map((item) => {
                    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
                    const expressedTimestamp = new Date(item.expressedAt).getTime();
                    
                    return {
                        id: item.pk_interests,
                        campaignTitle: item.campaign.title,
                        contactIdentifier: item.user.person.contacts[0]?.pkContact,
                        userEmail: item.user.email,
                        userIdentifier: item.user.pkUser,
                        timestamp: item.expressedAt,
                        isNew: expressedTimestamp > fifteenMinutesAgo, 
                    };
                });

                setRecentInterests(mappedInterests);
            } catch (error) {
                console.error('Error fetching initial interests:', error);
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
            const newInterest: CombinedInterest = {
                id: data.interestId || Date.now(),
                campaignTitle: data.campaignTitle,
                userIdentifier: data.userId,
                contactIdentifier: data.contactIdentifier,
                userEmail: data.userEmail,
                timestamp: data.timestamp,
                isNew: true, 
            };
         
            setRecentInterests((prevInterests) => {
                const updatedList = [newInterest, ...prevInterests];
                return updatedList.slice(0, 10);
            });
        });

        socket.on('disconnect', () => {
            console.log('RealtimeCampaignInterests: Disconnected from WebSocket server.');
        });

        socket.on('connect_error', (err) => {
            console.error('RealtimeCampaignInterests: WebSocket connection error:', err.message);
        });
        
        const timer = setInterval(() => {
            setRecentInterests(prevInterests => {
                const now = Date.now();
                return prevInterests.map(interest => {
                    const expressedTimestamp = new Date(interest.timestamp).getTime();
                    const fifteenMinutesAgo = now - 15 * 60 * 1000;
                    return {
                        ...interest,
                        isNew: expressedTimestamp > fifteenMinutesAgo,
                    };
                });
            });
        }, 60 * 1000); 

        return () => {
            socket.disconnect();
            clearInterval(timer);
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
                            <ListItem alignItems="flex-start" sx={{ py: 0.1 }}>
                                <ListItemText
                                    primary={
                                        <Typography component="span" variant="body2" color="text.primary">
                                            <NextLink href={`/dashboard/contact_detail/${interest.contactIdentifier}`} passHref>
                                                <Chip
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
                                            {` at ${new Date(interest.timestamp).toLocaleString()}`}
                                            {interest.isNew && (
                                                <Chip
                                                    label="New"
                                                    size="small"
                                                    sx={{
                                                        ml: 1,
                                                        backgroundColor: '#e6b800', 
                                                        color: 'black',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 'bold',
                                                        height: '18px'
                                                    }}
                                                />
                                            )}
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