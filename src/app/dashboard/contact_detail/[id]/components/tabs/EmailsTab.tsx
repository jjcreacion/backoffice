'use client';
import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { ContactDetail } from '@/app/interface/contactDetail';

interface EmailsTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
}

const EmailsTab = React.memo<EmailsTabProps>(({ contact, colors }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', mb: 3, color: colors.text }}
      >
        Emails:
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
          There have been no emails sent to this contact
        </Typography>
      </Box>
    </Box>
  );
});

EmailsTab.displayName = 'EmailsTab';

export default EmailsTab;