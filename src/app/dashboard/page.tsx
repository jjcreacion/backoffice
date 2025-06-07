'use client';

import { Box, Card, CardContent, Typography, styled, useTheme, Grid } from '@mui/material';
import PageContent from './components/dashboard/pageContent';
import GlassCard from './components/dashboard/glassCard';

export default function DashboardCentralView() {
  const theme = useTheme(); 

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
              <Typography variant="body2" color="text.secondary">
                Contenido de la tarjeta 3.
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
      </Grid>
    </PageContent>
  );
}