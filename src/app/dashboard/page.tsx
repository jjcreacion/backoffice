'use client';

import CampaignIcon from '@mui/icons-material/Campaign';
import { Alert, CardContent, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import RealtimeCampaignInterests from './components/app-mobile/campaigns/RealtimeCampaignInterests';
import GlassCard from './components/dashboard/glassCard';
import PageContent from './components/dashboard/pageContent';

export default function DashboardCentralView() {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
  };

  return (
    <PageContent>
    <Grid container spacing={3} justifyContent="center" alignItems="flex-start" style={{ height: '100%' }}>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <GlassCard style={{ height: '200px' }}>
          <CardContent>
            <Typography variant="h6" component="div" color="text.secondary">
              Card 1
            </Typography>
          </CardContent>
        </GlassCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <GlassCard style={{ height: '200px' }}>
          <CardContent>
            <Typography variant="h6" component="div" color="text.secondary">
              Card 2
            </Typography>
           </CardContent>
        </GlassCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <GlassCard style={{ height: '200px' }}>
          <CardContent>
            <Typography variant="h6" component="div" color="text.secondary">
              Card 3
            </Typography>
          </CardContent>
        </GlassCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <GlassCard style={{ height: '200px' }}>
          <CardContent>
            <Typography variant="h6" component="div" color="text.secondary">
              Card 4
            </Typography>
          </CardContent>
        </GlassCard>
      </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <GlassCard style={{ height: '400px', overflowY: 'auto' }}>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom color="text.secondary">
             <CampaignIcon /> Campaign interest
            </Typography>
            <RealtimeCampaignInterests showSnackbar={showSnackbar} />
          </CardContent>
        </GlassCard>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <GlassCard style={{ height: '400px', overflowY: 'auto' }}>
          <CardContent>
          </CardContent>
        </GlassCard>
      </Grid>
    </Grid>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: 'auto', minWidth: 300, fontSize: '1.2rem', padding: '1rem' }}>
            {snackbarMessage}
        </Alert>
    </Snackbar>
  </PageContent>
  );
}