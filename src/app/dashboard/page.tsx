'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, styled, useTheme, Grid, Snackbar, Alert } from '@mui/material';
import PageContent from './components/dashboard/pageContent';
import GlassCard from './components/dashboard/glassCard';
import RealtimeCampaignInterests from './components/app-mobile/campaigns/RealtimeCampaignInterests'; 

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
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 1.
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 2.
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 3
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 4.
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 5.
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <GlassCard style={{ height: '200px' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="text.primary">
                Card 6
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 6.-
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid item xs={12}> 
          <GlassCard style={{ minHeight: '250px', maxHeight: '400px', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom color="text.primary">
                Intereses de Campañas en Tiempo Real
              </Typography>
              <RealtimeCampaignInterests showSnackbar={showSnackbar} />
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