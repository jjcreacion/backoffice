"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Button,
    CircularProgress,
    useTheme
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import  InvoiceTable  from '../../components/billing/invoices/InvoiceTable'; 
import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';
import { InvoiceInterface } from "@interfaces/Invoice"; 
import axios from 'axios'; 

const InvoicePage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceInterface[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsedit] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceInterface | null>(null); 
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}:${port}/invoices`); 
            setInvoices(response.data);
            console.log("JsonData= ", response.data);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching data:', err);
            showSnackbar(`Error loading Invoices: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (invoice: InvoiceInterface) => { 
        setSelectedInvoice(invoice);
        setIsedit(true);
        setOpen(true);
    };

    const handleCreate = () => {
        setSelectedInvoice(null);
        setIsedit(true);
        setOpen(true);
    };

     const handleView = (invoice: InvoiceInterface) => {
        setIsedit(false);
        setSelectedInvoice(invoice);
        setOpen(true);
    };


    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const filteredInvoices = invoices.filter((inv) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        const numberMatch = inv?.invoice_number?.toLowerCase().includes(lowerCaseSearch); 
        return numberMatch;
    });

    const theme = useTheme();

    return (
        <PageContent >
        <GlassCard >
        <Box sx={{ width: '100%', minHeight: 200, overflowY: 'auto', p: 3 }} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" component="h2">
                   Invoices
                </Typography>
                <Button variant="contained" onClick={() => handleCreate()}>
                    Add New Invoice
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por número de factura..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: <FaSearch style={{ marginRight: 8 }} />,
                }}
                sx={{ mb: 2 }}
            />

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                <InvoiceTable
                    invoices={filteredInvoices}
                    onEdit={handleEdit}
                    onView={handleView}
                    orderBy={orderBy}
                    order={order}
                    handleSort={handleSort}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    searchQuery={searchQuery}
                />
                </>
            )}

            <InvoiceForm
                savingData={savingData}
                open={open}
                isEdit={isEdit}
                onClose={() => setOpen(false)}
                category={category}
                onSave={handleSave}
            />

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: 'auto', minWidth: 300, fontSize: '1.2rem', padding: '1rem' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
        </GlassCard>
        </PageContent>
    );
};

export default InvoicePage;