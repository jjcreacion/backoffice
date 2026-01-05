'use client';

import CampaignIcon from '@mui/icons-material/Campaign';
import HistoryIcon from '@mui/icons-material/History';
import { Alert, CardContent, Grid, Snackbar, Typography, useTheme, Button, Box } from '@mui/material';
import React, { useState } from 'react';
import NextLink from 'next/link';
import RealtimeCampaignInterests from './components/app-mobile/campaigns/RealtimeCampaignInterests';
import RealtimeCallHistory from './components/call/history/RealtimeCallHistory'; 
import GlassCard from './components/dashboard/glassCard';
import PageContent from './components/dashboard/pageContent';

export default function DashboardCentralView() {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const cardStyle = { 
    height: '400px', 
    display: 'flex', 
    flexDirection: 'column' as const,
    borderRadius: 24, 
    overflow: 'hidden'
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <PageContent>
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <GlassCard style={{ height: '160px', borderRadius: 24 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary"></Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <GlassCard style={cardStyle}>
            <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography variant="h6" gutterBottom color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CampaignIcon /> Campaign Interest
              </Typography>
              <RealtimeCampaignInterests showSnackbar={showSnackbar} />
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard style={cardStyle}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon /> Call History
                </Typography>
                <NextLink href="/dashboard/components/call" passHref>
                  <Button size="small" variant="text.secondary">View all</Button>
                </NextLink>
              </Box>
              <RealtimeCallHistory />
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: 'auto', minWidth: 300 }}>
              {snackbarMessage}
          </Alert>
      </Snackbar>
    </PageContent>
  );
}