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
} from '@mui/material';

interface HistoryEntry {
  changeDate: string;
  observation: string;
  previousStatus: { name: string };
  newStatus: { name: string };
  user: { email: string };
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  requestId: number | null;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, requestId }) => {
  const [requestHistory, setRequestHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (open && requestId) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://216.246.113.71:8080/request-status/history/${requestId}`);
          if (!response.ok) {
            throw new Error('Error al obtener el historial');
          }
          const data: HistoryEntry[] = await response.json();
          setRequestHistory(data);
        } catch (error) {
          console.error('Error fetching history:', error);
          setRequestHistory([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, requestId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Historial de la Solicitud</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : requestHistory.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de Cambio</TableCell>
                  <TableCell>Estado Anterior</TableCell>
                  <TableCell>Nuevo Estado</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requestHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.changeDate).toLocaleString()}</TableCell>
                    <TableCell>{item.previousStatus?.name || 'N/A'}</TableCell>
                    <TableCell>{item.newStatus?.name || 'N/A'}</TableCell>
                    <TableCell>{item.observation || 'Sin observación'}</TableCell>
                    <TableCell>{item.user?.email || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No hay historial disponible para esta solicitud.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryModal;