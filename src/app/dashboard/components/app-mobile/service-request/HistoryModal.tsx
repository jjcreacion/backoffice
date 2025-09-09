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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';
import { FaEye } from 'react-icons/fa';

interface HistoryEntry {
  changeDate: string;
  observation: string;
  previousStatus: { name: string };
  newStatus: { name: string };
  user: { email: string };
}

interface Status {
  statusId: number;
  name: string;
  order: number;
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  requestId: number | null;
  currentStatusId: number | null;
  currentStatusName: string | null;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const port = process.env.NEXT_PUBLIC_PORT;
const userId = localStorage.getItem('pkUser') || sessionStorage.getItem('pkUser'); 

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, requestId, currentStatusId }) => {
  const [requestHistory, setRequestHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newStatusId, setNewStatusId] = useState<number | ''>('');
  const [observation, setObservation] = useState<string>('');
  const [loadingChange, setLoadingChange] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchHistory = async (id: number) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`${baseUrl}:${port}/request-status/history/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching history');
      }
      const data: HistoryEntry[] = await response.json();
      setRequestHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setRequestHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };
  

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${baseUrl}:${port}/status-list`);
      if (!response.ok) {
        throw new Error('Error fetching status list');
      }
      const data: Status[] = await response.json();
      console.log("Data="+JSON.stringify(data));
      setStatuses(data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
      setError('Could not load status options.');
    }
  };
  console.log(statuses);

  useEffect(() => {
    if (open && requestId) {
      fetchHistory(requestId);
      fetchStatuses();
      setSuccessMessage(null);
      setError(null); 
    }
  }, [open, requestId]);

  const handleSave = async () => {
    if (newStatusId === '' || !requestId) {
      setError('Please select a new status.');
      return;
    }

    setLoadingChange(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        requestId,
        previousStatus: currentStatusId,
        newStatusId: newStatusId,
        userId: userId,
        observation: observation || 'No observation provided.',
      };

      const response = await fetch(`${baseUrl}:${port}/request-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      setSuccessMessage('Status updated successfully!');
      setNewStatusId('');
      setObservation('');
      fetchHistory(requestId);
      
    } catch (err) {
      console.error('Error updating status:', err);
      setError('An error occurred while updating the status. Please try again.');
    } finally {
      setLoadingChange(false);
    }
  };

  const currentStatusName = statuses.find(s => s.statusId === currentStatusId)?.name || 'N/A';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FaEye />
        Request Details & History (Request ID: {requestId})
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>Change Request Status</Typography>
          {loadingChange ? (
            <CircularProgress />
          ) : (
            <>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Status: {currentStatusName}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="new-status-label">New Status</InputLabel>
                <Select
                  labelId="new-status-label"
                  value={newStatusId}
                  label="New Status"
                  onChange={(e) => setNewStatusId(e.target.value as number)}
                >
                  <MenuItem value="" disabled>
                    Select a new status
                  </MenuItem>
                  {statuses
                    .filter(status => status.statusId !== currentStatusId)
                    .map((status) => (
                      <MenuItem key={status.statusId} value={status.statusId}>
                        {status.order}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Enter an observation for this status change"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={handleSave} 
                  color="primary" 
                  variant="contained" 
                  disabled={loadingChange || newStatusId === ''}
                >
                  {loadingChange ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Request History</Typography>
          {loadingHistory ? (
            <CircularProgress />
          ) : requestHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Change Date</TableCell>
                    <TableCell>Previous Status</TableCell>
                    <TableCell>New Status</TableCell>
                    <TableCell>Observation</TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.changeDate).toLocaleString()}</TableCell>
                      <TableCell>{item.previousStatus?.name || 'N/A'}</TableCell>
                      <TableCell>{item.newStatus?.name || 'N/A'}</TableCell>
                      <TableCell>{item.observation || 'No observation'}</TableCell>
                      <TableCell>{item.user?.email || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No history available for this request.</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryModal;