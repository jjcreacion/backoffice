'use client';
import React from 'react';
import {
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
  Chip,
} from '@mui/material';
import { FaEye, FaExternalLinkAlt } from 'react-icons/fa'; 
import { InvoiceInterface } from '@interfaces/Invoice'; 
import { ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';

interface InvoiceTableProps {
  invoices: InvoiceInterface[]; 
  onEdit: (invoice: InvoiceInterface) => void;
  onView: (invoice: InvoiceInterface) => void;
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

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices,
  onView,
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'info';
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return invoice.invoice_number
      ?.toLowerCase()
      ?.includes(lowerCaseSearch);
  });
  
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const isAsc = orderBy === 'invoice_number' && order === 'asc';
    return isAsc
      ? a.invoice_number.localeCompare(b.invoice_number)
      : b.invoice_number.localeCompare(a.invoice_number);
  });

  const paginatedInvoices = sortedInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[
              'Invoice No.',
              'Customer',
              'Amount',
              'Status',
              'Issue Date',
              'Payment Date',
              'Actions',
            ].map(
              (header) => (
                <TableCell key={header}>
                  {header === 'Acciones' ? (
                    'Acciones'
                  ) : (
                    <TableSortLabel
                      active={orderBy === header.toLowerCase().replace(/[\.º]/g, '').replace(/\s+/g, '_')}
                      direction={order}
                      onClick={() => handleSort(header.toLowerCase().replace(/[\.º]/g, '').replace(/\s+/g, '_'))}
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
          {paginatedInvoices.map((invoice) => (
            <TableRow key={invoice.invoice_id}>
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>
                <Link
                  href={`${baseUrl}:${port}/dashboard/contact_detail/${invoice.fk_user}`}
                  passHref
                >
                  <Chip
                    label={invoice.user?.email || 'N/A'}
                    clickable
                    size="small"
                    color="primary"
                    sx={{ borderRadius: '5px' }}
                  />
                </Link>
              </TableCell>
              <TableCell>${invoice.invoice_amount.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                    label={invoice.invoice_status}
                    clickable
                    size="small"
                    color={getStatusColor(invoice.invoice_status)}
                    sx={{ borderRadius: '5px' }}
                  />
              </TableCell>
              <TableCell>
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {invoice.payment_date 
                  ? new Date(invoice.payment_date).toLocaleDateString()
                  : 'Pendiente'
                }
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onView(invoice)}
                  title="Ver detalles"
                >
                  <FaEye />
                </IconButton>
                <Link href={invoice.public_link} passHref legacyBehavior>
                    <IconButton
                        color="secondary"
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver link público"
                    >
                        <FaExternalLinkAlt />
                    </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredInvoices.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

export default InvoiceTable;