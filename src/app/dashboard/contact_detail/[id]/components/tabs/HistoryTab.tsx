'use client';
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ContactDetail } from '@/app/interface/contactDetail';

interface HistoryTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const HistoryTab: React.FC<HistoryTabProps> = ({ contact, colors }) => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Historia */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
          >
            History View:
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                size="small"
                sx={{
                  color: '#4caf50',
                  '&.Mui-checked': {
                    color: '#4caf50',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ color: colors.text, fontSize: '14px' }}
              >
                Show Full History
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}
            >
              LUIS MENDEZ
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Imported from Leadstore with dnc check
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colors.textSecondary }}
            >
              06/18/2025 2:55 PM
            </Typography>
          </Box>
        </Grid>

        {/* Grabaciones */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
          >
            Call Recordings:
          </Typography>
          
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
              No Data Available
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              There are no call recordings
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HistoryTab;