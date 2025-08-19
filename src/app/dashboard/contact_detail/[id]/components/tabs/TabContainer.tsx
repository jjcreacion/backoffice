'use client';
import { ContactDetail } from '@/app/interface/contactDetail';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import ActionPlansTab from './ActionPlansTab';
import ActivitiesTab from './ActivitiesTab';
import AttachmentsTab from './AttachmentsTab';
import EmailsTab from './EmailsTab';
import HistoryTab from './HistoryTab';
import LeadSheetTab from './LeadSheetTab';
import MiscTab from './MiscTab';
import PropertyTab from './PropertyTab';

interface TabContainerProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
    border: string;
  };
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TabContainer = React.memo<TabContainerProps>(({
  contact,
  colors,
  activeTab,
  onTabChange,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <MiscTab contact={contact} colors={colors} />;
      case 1:
        return <PropertyTab contact={contact} colors={colors} />;
      case 2:
        return <ActivitiesTab contact={contact} colors={colors} />;
      case 3:
        return <HistoryTab contact={contact} colors={colors} />;
      case 4:
        return <EmailsTab contact={contact} colors={colors} />;
      case 5:
        return <ActionPlansTab contact={contact} colors={colors} />;
      case 6:
        return <LeadSheetTab contact={contact} colors={colors} />;
      case 7:
        return <AttachmentsTab contact={contact} colors={colors} />;
      default:
        return <PropertyTab contact={contact} colors={colors} />;
    }
  };

  return (
    <Box>
      {/* Tabs Navigation */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 'auto',
              padding: '6px 16px',
              color: colors.textSecondary,
            },
            '& .Mui-selected': {
              color: '#1976d2 !important',
            },
          }}
        >
          <Tab label="Misc" value={0} />
          <Tab label="Property" value={1} />
          <Tab label="Activities" value={2} />
          <Tab label="History" value={3} />
          <Tab label="Emails" value={4} />
          <Tab label="Action Plans" value={5} />
          <Tab label="Lead Sheet" value={6} />
          <Tab label="Attachments" value={7} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {renderTabContent()}
      </Box>
    </Box>
  );
});

TabContainer.displayName = 'TabContainer';

export default TabContainer;