'use client';
import React, { useEffect, useState } from 'react';
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
  Chip,
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { RequestService } from '@interfaces/serviceRequest';
import { ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';
import HistoryModal from './HistoryModal'; 

interface RequestServiceTableProps {
  requests: RequestService[];
  onEdit: (requestService: RequestService) => void;
  onView: (requestService: RequestService) => void;
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (property: string) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

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
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [currentStatusId, setCurrentStatusId] = useState<number | null>(null);
  const [currentStatusName, setCurrentStatusName] = useState<string>('');
  const [statuses, setStatuses] = useState<{ statusId: number; name: string }[]>([]);
  
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(`${baseUrl}:${port}/status-list`);
        if (!response.ok) {
          throw new Error('Failed to fetch statuses');
        }
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };
    fetchStatuses();
  }, [baseUrl, port]);

  const getStatusName = (statusId: number | null): string => {
    const status = statuses.find(s => s.statusId === statusId);
    return status ? status.name : 'Submitted';
  };

  const filteredRequestService = requests.filter((requestService) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return requestService.serviceDescription
      ?.toLowerCase()
      ?.includes(lowerCaseSearch);
  });
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRequestService, setViewRequestService] =
    useState<RequestService | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [requestServiceToDelete, setRequestServiceToDelete] = useState<
    number | null
  >(null);

  const sortedRequestService = [...filteredRequestService].sort((a, b) => {
    const isAsc = orderBy === 'serviceDescription' && order === 'asc';
    return isAsc
      ? a.serviceDescription.localeCompare(b.serviceDescription)
      : b.serviceDescription.localeCompare(a.serviceDescription);
  });

  const handleDeleteConfirmation = (id: number) => {
    setRequestServiceToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const paginatedRequestService = sortedRequestService.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenHistoryModal = (requestService: RequestService) => {
    const statusId = requestService.fkRequestStatus ?? 1;
    const statusName = getStatusName(statusId);

    setSelectedRequestId(requestService.requestId);
    setCurrentStatusId(statusId);
    setCurrentStatusName(statusName);

    setHistoryModalOpen(true);
};

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedRequestId(null);
    setCurrentStatusId(null);
    setCurrentStatusName('');
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['requestId','Request Type', 'User', 'Address', 'Status', 'Date', 'Info.'].map(
              (header) => (
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
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRequestService.map((requestService) => (
            <TableRow key={requestService.requestId}>
              <TableCell>{requestService.requestId}</TableCell>
              <TableCell>
                {requestService.fkCategory?.name}
              </TableCell>
              <TableCell>
                <Link
                  href={`${baseUrl}:${port}/dashboard/contact_detail/`}
                  passHref
                >
                  <Chip
                    label={requestService.fkUser?.email || 'No email'}
                    clickable
                    size="small"
                    color="primary"
                    sx={{ borderRadius: '5px' }}
                  />
                </Link>
              </TableCell>
              <TableCell>{requestService.address}</TableCell>
              <TableCell>
                <Chip
                    label={getStatusName(requestService.fkRequestStatus)}
                    clickable
                    size="small"
                    color="secondary"
                    sx={{ borderRadius: '5px' }}
                    onClick={() => handleOpenHistoryModal(requestService)}
                  />
              </TableCell>
              <TableCell>
                {requestService.createdAt 
                  ? new Date(requestService.createdAt).toLocaleDateString()
                  : 'No date'
                }
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onView(requestService)}
                >
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
       <HistoryModal
        open={historyModalOpen}
        onClose={handleCloseHistoryModal}
        requestId={selectedRequestId}
        currentStatusId={currentStatusId}
        currentStatusName={currentStatusName}
      />
    </TableContainer>

    
  );
};

export default RequestTable;