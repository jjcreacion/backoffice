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
  Chip 
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { RequestService } from "@interfaces/serviceRequest";
import { ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';

interface RequestServiceTableProps {
  requests: RequestService[];
  onEdit: (requestService: RequestService) => void;
  onView: (requestService: RequestService) => void;
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (property: string) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

interface StatusInfo {
  label: string;
  color: 'warning' | 'primary' | 'success' | 'error'; 
}

const statusMap: { [key: number]: StatusInfo } = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'In Progress', color: 'primary' },
  2: { label: 'Completed', color: 'success' },
  3: { label: 'Cancelled', color: 'error' },
};

const SERVICES: { [key: number] } = {
   1: { label: 'Insurance Claim' },
   2: { label: 'Roofing'},
   3: { label: 'HVAC' },
   4: { label: 'Gutters' },
   5: { label: 'Windows' },
   6: { label: 'Insolation' },
   7: { label: 'Solar Panel' },
   8: { label: 'Electric Service' },
   9: { label: 'Water Threatment' },
   10: { label: 'Tax Services' },
   11: { label: 'Other' },
};

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const RequestTable: React.FC<RequestServiceTableProps> = ({
  requests,
  onView,
  onEdit,
  orderBy,
  order,
  handleSort,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
 searchQuery,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  const filteredRequestService = requests.filter((requestService) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return (
      requestService.serviceDescription?.toLowerCase()?.includes(lowerCaseSearch)
    );
  });
  console.log("requests prop recibida en RequestTable:", requests);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRequestService, setViewRequestService] = useState<RequestService | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [requestServiceToDelete, setRequestServiceToDelete] = useState<number | null>(null);

  const sortedRequestService = [...filteredRequestService].sort((a, b) => {
    const isAsc = orderBy === 'serviceDescription' && order === 'asc';
    return isAsc ? a.serviceDescription.localeCompare(b.serviceDescription) : b.serviceDescription.localeCompare(a.serviceDescription);
  });

  const handleDeleteConfirmation = (id: number) => {
    setRequestServiceToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const getServiceTitle = (serviceCode: number): string | undefined => {
    const service = SERVICES.find((s) => s.codigo === serviceCode);
    return service?.title;
  };

  const paginatedRequestService = sortedRequestService.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setRequestServiceToDelete(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['Request Type', 'User', 'Address', 'Status', 'Date', 'Info.'].map((header) => (
              <TableCell key={header}>
                {header === 'Actions' ? (
                  'Actions'
                ) : (
                  <TableSortLabel
                    active={orderBy === header.toLowerCase()}
                    direction={order}
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    {header}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRequestService.map((requestService) => (
            <TableRow key={requestService.requestId}>
              <TableCell>{SERVICES[requestService.serviceType].label}</TableCell>
      
             <TableCell>
              <Link href={`${baseUrl}:${port}/dashboard/contact_detail/`} passHref>
                <Chip
                  label={requestService.fkUser?.email}
                  clickable
                  size="small"
                  color="black" 
                  variant="outlined" 
                  sx={{ borderRadius: '5px' }} 
                />
              </Link>
            </TableCell>
              <TableCell>{requestService.address}</TableCell>
              <TableCell>
                {statusMap[requestService.status] ? (
                  <Chip
                    label={statusMap[requestService.status].label}
                    color={statusMap[requestService.status].color}
                    size="small"
                  />
                ) : (
                  `Estado Desconocido (${requestService.status})`
                )}
              </TableCell>
              <TableCell>{new Date(requestService.createdAt!).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onView(requestService)}>
                  <FaEye />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredRequestService.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

    </TableContainer>
  );
};

export default RequestTable;