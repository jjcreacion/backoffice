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
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { ContactDetail } from '@/app/interface/contactDetail';

interface LeadSheetTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const LeadSheetTab: React.FC<LeadSheetTabProps> = ({ contact, colors }) => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Sección principal */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: colors.text }}
            >
              Lead sheet:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value="TNB"
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
                  <MenuItem value="TNB">TNB</MenuItem>
                </Select>
              </FormControl>
              
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
                Print
              </Button>
              
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
                Download
              </Button>
              
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
                Send As Email
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.text, mb: 2, fontWeight: 'bold' }}
            >
              Are you the Home Owner
            </Typography>
            
            <RadioGroup
              value=""
              sx={{ ml: 1 }}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    Yes
                  </Typography>
                }
              />
              <FormControlLabel
                value="no"
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    No
                  </Typography>
                }
              />
              <FormControlLabel
                value="renter"
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    Renter
                  </Typography>
                }
              />
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadSheetTab;