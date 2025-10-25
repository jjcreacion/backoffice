'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';

interface InvoiceStatusInfo {
  invoiceId: number;
  currentStatus: string; 
  invoiceNum:string
}

interface Status {
    name: string; 
    value: string;
}

interface ChangeInvoiceStatusModalProps {
  open: boolean;
  onClose: (statusChanged: boolean) => void;
  invoiceInfo: InvoiceStatusInfo | null; 
  onStatusChangeSuccess: () => void; 
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const port = process.env.NEXT_PUBLIC_PORT;

const availableStatuses: Status[] = [
    { name: 'Pending', value: 'Pending' },
    { name: 'Paid', value: 'Paid' },
    { name: 'Cancelled', value: 'Cancelled' },
];


const ChangeInvoiceStatusModal: React.FC<ChangeInvoiceStatusModalProps> = ({ 
    open, 
    onClose, 
    invoiceInfo,
    onStatusChangeSuccess, 
}) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [loadingChange, setLoadingChange] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (open) {
      setNewStatus('');
      setObservation('');
      setError(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!invoiceInfo || !invoiceInfo.invoiceId) {
      setError('Invoice information is missing.');
      return;
    }
    if (newStatus === '') {
      setError('Please select a new status.');
      return;
    }
    if (newStatus === invoiceInfo.currentStatus) {
        setError('The selected status is the same as the current status.');
        return;
    }

    setLoadingChange(true);
    setError(null);
    
    const payload = {
        status: newStatus,
        observation: observation || 'No observation provided.',
    };
    
    const invoiceId = invoiceInfo.invoiceId;

    try {
      const response = await fetch(`${baseUrl}:${port}/invoices/${invoiceId}/status`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update invoice status.');
      }

      onStatusChangeSuccess(); 
      
      onClose(true); 

    } catch (err: any) {
      console.error('Error updating invoice status:', err);
      setError(`An error occurred while updating the status: ${err.message || 'Please try again.'}`);
    } finally {
      setLoadingChange(false);
    }
  };

  const handleCloseInternal = () => {
    onClose(false); 
  }

  const filterStatuses = availableStatuses.filter(
    status => status.value !== invoiceInfo?.currentStatus
  );

  return (
    <Dialog open={open} onClose={handleCloseInternal} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Change Status for Invoice #{invoiceInfo?.invoiceNum}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Update Invoice Status</Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Current Status: {invoiceInfo?.currentStatus || 'N/A'}
          </Typography>

          {loadingChange && <CircularProgress sx={{ mb: 2 }} />}
          
          {error && !loadingChange && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {!loadingChange && ( 
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="new-status-label">New Status</InputLabel>
                <Select
                  labelId="new-status-label"
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value as string)}
                  disabled={loadingChange}
                >
                  <MenuItem value="" disabled>
                    Select a new status
                  </MenuItem>
                  {filterStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observation (Optional)"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Enter an observation for this status change"
                sx={{ mb: 2 }}
                disabled={loadingChange}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseInternal} color="inherit" variant="outlined">
            Close
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained" 
          disabled={loadingChange || newStatus === ''} 
        >
          {loadingChange ? <CircularProgress size={24} color="inherit" /> : 'Confirm Status Change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeInvoiceStatusModal;