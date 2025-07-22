"use client"
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
  Button
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MobileCampaign } from '../../../../interface/MobileCampaign'; 
import { ChangeEvent, MouseEvent } from 'react';

interface CampaignsTableProps {
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
  searchQuery: string;
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const MobileCampaignTable: React.FC<CampaignsTableProps> = ({
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
 searchQuery,
}) => {
  const filteredCampaign = campaigns.filter((campaign) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return (
      campaign.title.toLowerCase()?.includes(lowerCaseSearch)  
    );
  });

  const [ viewModalOpen, setViewModalOpen ] = useState(false);
  const [ viewCampaign, setViewCampaign ] = useState<MobileCampaign | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
 
  const sortedCampaign = [...filteredCampaign].sort((a, b) => {
    const isAsc = orderBy === a.title && order === 'asc'; // Ordenar por nombre por defecto
    return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
  });

  const handleDeleteConfirmation = (id: number) => {
    setCampaignToDelete(id);
    setConfirmDeleteOpen(true);
  };

 const handleDelete = async () => {
    if (campaignToDelete) {
      try {
        await onDelete(campaignToDelete);
      } catch (error) {
        // Manejar error si la eliminación falla
        console.error("Error deleting Campaign:", error);
      } finally {
        setCampaignToDelete(null);
        setConfirmDeleteOpen(false);
      }
    }
  };
  const paginatedCampaigns = sortedCampaign.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setCampaignToDelete(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['N°', 'Title', 'Start Date', 'End Date', 'Active?', 'Actions'].map((header) => (
              <TableCell key={header}>
                {header === 'actions' ? (
                  'Actions'
                ) : (
                  <TableSortLabel
                    active={orderBy === header}
                    direction={order}
                    onClick={() => handleSort(header)}
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCampaigns.map((campaign) => (
            <TableRow key={campaign.campaignsId}>
              <TableCell>{ campaign.campaignsId }</TableCell>
              <TableCell>{ campaign.title }</TableCell>
              <TableCell>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}</TableCell>
             <TableCell>{campaign.isActive ? 'Sí' : 'No'}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onView(campaign)}>
                 <FaEye />
                </IconButton>
                <IconButton color="secondary" onClick={() => onEdit(campaign)}>
                  <FaEdit style={{ color: 'green' }} />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteConfirmation(campaign.campaignsId)}> 
                  <FaTrash />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredCampaign.length}
        page={page}
        onPageChange={handleChangePage} 
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          {"Are you sure you want to delete this Campaign?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </TableContainer>
  );
};

export default MobileCampaignTable;