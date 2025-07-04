'use client';
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
} from '@mui/material';
import { ContactDetail } from '@/app/interface/contactDetail';

interface AttachmentsTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const AttachmentsTab = React.memo<AttachmentsTabProps>(({ contact, colors }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
      >
        Attachments:
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value=""
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
            <MenuItem value="">Show all attachments</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, whiteSpace: 'nowrap' }}
            >
              Add attachment (max 10 MB):
            </Typography>
            <TextField
              placeholder="No file selected"
              variant="outlined"
              size="small"
              disabled
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                },
                '& .MuiInputBase-input': {
                  color: colors.textSecondary,
                },
              }}
            />
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
              Choose File
            </Button>
          </Box>
        </Grid>
      </Grid>

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
          There have been no attachments uploaded yet
        </Typography>
      </Box>
    </Box>
  );
});

AttachmentsTab.displayName = 'AttachmentsTab';

export default AttachmentsTab;