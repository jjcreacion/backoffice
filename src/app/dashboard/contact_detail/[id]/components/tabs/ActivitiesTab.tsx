'use client';
import { ContactDetail } from '@/app/interface/contactDetail';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import React from 'react';

interface ActivitiesTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const ActivitiesTab = React.memo<ActivitiesTabProps>(({ contact, colors }) => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Columna izquierda - Activities */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
          >
            Activities:
          </Typography>
          
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              border: `1px solid ${colors.border}`,
              borderRadius: 1,
              backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
              No Data Available
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              There are no activities for this contact
            </Typography>
          </Box>
        </Grid>

        {/* Columna derecha - Information */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
          >
            Information:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Source:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value="Mojo Leadstore"
                displayEmpty
                sx={{
                  fontSize: '14px',
                  color: colors.text,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                }}
              >
                <MenuItem value="Mojo Leadstore">Mojo Leadstore</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Timezone:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              Central
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: colors.text, mb: 1 }}
              >
                Last Call Result:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.text }}
              >
                N/A
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: '#1976d2',
                borderColor: '#1976d2',
                textTransform: 'none',
                fontSize: '12px',
              }}
            >
              Mark As Contact
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Last Dial Date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              N/A
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              Attempts:
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ color: colors.textSecondary, minWidth: 'auto', p: 0 }}
            >
              —
            </Button>
            <Typography
              variant="body2"
              sx={{ color: colors.text, fontWeight: 'bold' }}
            >
              0
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ color: colors.textSecondary, minWidth: 'auto', p: 0 }}
            >
              +
            </Button>
            <Button
              variant="text"
              size="small"
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '12px',
                textDecoration: 'underline',
                ml: 2,
              }}
            >
              Reset
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Next Activity:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              N/A
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Create Date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              06/18/2025 02:55 PM
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Modify Date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              06/18/2025 02:55 PM
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              Modified By:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              LUIS MENDEZ
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 1 }}
            >
              E-mail Date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.text }}
            >
              N/A
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

ActivitiesTab.displayName = 'ActivitiesTab';

export default ActivitiesTab;