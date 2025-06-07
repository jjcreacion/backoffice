"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    useTheme
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { RequestTable } from '../../components/app-mobile/service-request';
import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';
import { RequestService } from "@interfaces/serviceRequest";
import axios from 'axios'; 

const RequestServicePage: React.FC = () => {
    const [requests, setRequests] = useState<RequestService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsedit] = useState(true);
    const [requestService, setRequestService] = useState<RequestService | null>(null);
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
            const response = await axios.get(`${baseUrl}:${port}/service_request/findAll`);
            setRequests(response.data);
            console.log("JsonData= ", response.data);
            console.log("requests= ", requests);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching data:', err);
            showSnackbar(`Error loading RequestService: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (requestService: RequestService) => {
        setRequestService(requestService);
        setIsedit(true);
        setOpen(true);
    };

    const handleCreate = () => {
        setRequestService(null);
        setIsedit(true);
        setOpen(true);
    };

     const handleView = (requestService: RequestService) => {
        setIsedit(false);
        setRequestService(requestService);
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

    const filteredRequest = requests.filter((req) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        const nameMatch = req?.serviceDescription?.toLowerCase().includes(lowerCaseSearch);
        return nameMatch;
    });

    const theme = useTheme();

    return (
        <PageContent >
        <GlassCard >
        <Box sx={{ width: '100%', minHeight: 200, overflowY: 'auto', p: 3 }} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Services Request
                </Typography>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar..."
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
                {console.log("filteredRequest en render:", filteredRequest)}

                <RequestTable
                requests={filteredRequest}
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

export default RequestServicePage;