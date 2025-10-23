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
  Chip, // Mantendremos el Chip
  Button, // Eliminado ya que el Chip manejará la acción
} from '@mui/material';
import { FaEye, FaExternalLinkAlt } from 'react-icons/fa'; // Se eliminó FaPencilAlt y FaCheckCircle
import { InvoiceInterface } from '@interfaces/Invoice'; 
import { ChangeEvent, MouseEvent } from 'react';
import Link from 'next/link';

interface InvoiceTableProps {
  invoices: InvoiceInterface[]; 
  onEdit: (invoice: InvoiceInterface) => void; // A pesar de que no se usará el botón, se mantiene en la interfaz de la página
  onView: (invoice: InvoiceInterface) => void;
  onChangeStatus: (invoice: InvoiceInterface) => void; // Función para abrir la modal de cambio de estado
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
  // onEdit se quita de las props desestructuradas ya que no se usará
  onView,
  onChangeStatus, // Se usa en la columna Status
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
    let comparison = 0;
    if (orderBy === 'invoice_number') {
        comparison = a.invoice_number.localeCompare(b.invoice_number);
    } 
    // Agrega aquí otras condiciones de ordenamiento si es necesario
    
    return order === 'asc' ? comparison : -comparison;
  });


  const paginatedInvoices = sortedInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const headCells = [
    { id: 'invoice_number', label: 'Invoice No.' },
    { id: 'customer', label: 'Customer' },
    { id: 'invoice_amount', label: 'Amount' },
    { id: 'invoice_status', label: 'Status' }, // Aquí va la acción de cambio de estado
    { id: 'invoice_date', label: 'Issue Date' },
    { id: 'payment_date', label: 'Payment Date' },
    { id: 'actions', label: 'Actions' }, // Solo para ver y link público
  ];


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map(
              (headCell) => (
                <TableCell key={headCell.id}>
                  {headCell.id === 'actions' || headCell.id === 'customer' ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={order}
                      onClick={() => handleSort(headCell.id)}
                    >
                      {headCell.label}
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
                  legacyBehavior
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
              
              {/* === COLUMNA STATUS (Con funcionalidad de cambio) === */}
              <TableCell>
                <Chip
                    label={invoice.invoice_status}
                    clickable
                    size="small"
                    color={getStatusColor(invoice.invoice_status)}
                    sx={{ borderRadius: '5px' }}
                    onClick={() => onChangeStatus(invoice)} // AÑADIDO: Llama a la función de cambio de estado
                    title="Click to change status"
                />
              </TableCell>
              {/* =================================================== */}

              <TableCell>
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {invoice.payment_date 
                  ? new Date(invoice.payment_date).toLocaleDateString()
                  : 'Pending'
                }
              </TableCell>
              
              {/* === COLUMNA ACTIONS (Solo ver y link público) === */}
              <TableCell sx={{ minWidth: '100px' }}>
                {/* 1. Botón de Ver Detalles */}
                <IconButton
                  color="primary"
                  onClick={() => onView(invoice)}
                  title="View details"
                  size="small"
                >
                  <FaEye />
                </IconButton>

                {/* 2. Botón de Link Público */}
                <Link href={invoice.public_link} passHref legacyBehavior>
                    <IconButton
                        color="secondary"
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View public link"
                        size="small"
                    >
                        <FaExternalLinkAlt />
                    </IconButton>
                </Link>
                {/* Botón de Editar y de Cambio de Estado ELIMINADOS de aquí */}
              </TableCell>
              {/* =================================================== */}
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