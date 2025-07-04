'use client';
import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { ContactDetail } from '@/app/interface/contactDetail';

interface ActionPlansTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const ActionPlansTab = React.memo<ActionPlansTabProps>(({ contact, colors }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
      >
        Action Plans:
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
          There are no action plan assigned yet
        </Typography>
      </Box>
    </Box>
  );
});

ActionPlansTab.displayName = 'ActionPlansTab';

export default ActionPlansTab;