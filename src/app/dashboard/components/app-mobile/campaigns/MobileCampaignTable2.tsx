"use client";
import React, { useEffect, useState} from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Button,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { MobileCampaign } from '../../../../interface/MobileCampaign';
import { ChangeEvent, MouseEvent } from 'react';

interface MobileCampaignTableProps {
  campaigns: MobileCampaign[];
  onEdit: (campaign: MobileCampaign) => void;
  onView: (campaign: MobileCampaign) => void;
  onDelete: (id: number) => Promise<void>;
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (property: string) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MobileCampaignTable: React.FC<MobileCampaignTableProps> = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
  orderBy,
  order,
  handleSort,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [campaignToDeleteId, setCampaignToDeleteId] = useState<number | null>(null);

  const headCells = [
    { id: 'rowIndex', label: 'Nº' }, // Cambiado a 'Nº' para el número de fila
    { id: 'title', label: 'Título' },
    { id: 'startDate', label: 'Inicio' },
    { id: 'endDate', label: 'Fin' },
    { id: 'isActive', label: 'Activa' },
    // Eliminadas 'createdAt' y 'updatedAt'
    { id: 'actions', label: 'Acciones', disableSorting: true },
  ];

  const sortedCampaigns = React.useMemo(() => {
    return campaigns.sort((a, b) => {
      const aValue = a[orderBy as keyof MobileCampaign];
      const bValue = b[orderBy as keyof MobileCampaign];

      let comparison = 0;
      if (aValue === null && bValue === null) comparison = 0;
      else if (aValue === null) comparison = -1;
      else if (bValue === null) comparison = 1;
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          comparison = (aValue === bValue) ? 0 : (aValue ? -1 : 1);
      } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
      } else {
          comparison = String(aValue).localeCompare(String(bValue));
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }, [campaigns, orderBy, order]);

  const paginatedCampaigns = React.useMemo(() => {
    return sortedCampaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedCampaigns, page, rowsPerPage]);


  const handleDeleteConfirmation = (id: number) => {
    setCampaignToDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (campaignToDeleteId) {
      try {
        await onDelete(campaignToDeleteId);
      } catch (error) {
        console.error("Error al eliminar Campaña:", error);
      } finally {
        setCampaignToDeleteId(null);
        setConfirmDeleteOpen(false);
      }
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setCampaignToDeleteId(null);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align="left"
                padding="normal"
                sortDirection={orderBy === headCell.id ? order : false}
                sx={{
                  fontWeight: 'normal',
                }}
              >
                {headCell.disableSorting ? (
                  headCell.label
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleSort(headCell.id)}
                    sx={{
                    }}
                  >
                    {headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCampaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headCells.length} sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  No se encontraron campañas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCampaigns.map((campaign, index) => ( // Añadido 'index' al map
              <TableRow hover role="checkbox" tabIndex={-1} key={campaign.campaignsId}>
                <TableCell>{(page * rowsPerPage) + index + 1}</TableCell> {/* CAMBIO: Número de fila */}
                <TableCell>{campaign.title}</TableCell>
                <TableCell>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{campaign.isActive ? 'Sí' : 'No'}</TableCell>
                {/* Eliminadas celdas para createdAt y updatedAt */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver">
                      <IconButton color="info" onClick={() => onView(campaign)} size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEdit(campaign)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => handleDeleteConfirmation(campaign.campaignsId)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={campaigns.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
        }}
      />

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta Campaña?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="secondary">Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default MobileCampaignTable;