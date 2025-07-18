"use client";
import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import {
    Box,
    TextField,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Button, 
    Dialog, 
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import PageContent from '../../components/dashboard/pageContent'; 
import GlassCard from '../../components/dashboard/glassCard'; 
import { MobileCampaign } from '../../../interface/MobileCampaign';
import MobileCampaignTable  from '../../components/app-mobile/campaigns/MobileCampaignTable'; 
import MobileCampaignForm from '../../components/app-mobile/campaigns/MobileCampaignTable'; 


const MobileCampaignsPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<MobileCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false); 
    const [isEditMode, setIsEditMode] = useState(true); 
    const [selectedCampaign, setSelectedCampaign] = useState<MobileCampaign | null>(null); 
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
    const port = process.env.NEXT_PUBLIC_PORT || '5641';
    const API_URL = `${baseUrl}:${port}/mobile-campaigns`; 

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

   
    const fetchData = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await axios.get<MobileCampaign[]>(API_URL);
            setCampaigns(response.data);
            showSnackbar('Campañas cargadas exitosamente.', 'success');
        } catch (err: any) {
            console.error('Error fetching campaigns:', err);
            setError(err.message || 'Error al cargar las campañas.');
            showSnackbar(`Error al cargar campañas: ${err.message || 'Error desconocido'}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (campaign: MobileCampaign) => {
        setSelectedCampaign(campaign);
        setIsEditMode(true);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedCampaign(null); 
        setIsEditMode(true);
        setIsFormOpen(true);
    };

    const handleView = (campaign: MobileCampaign) => {
        setSelectedCampaign(campaign);
        setIsEditMode(false); 
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la campaña con ID ${id}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_URL}/${id}`);
            showSnackbar('Campaña eliminada exitosamente.', 'success');
            fetchData(); 
        } catch (err: any) {
            console.error('Error deleting campaign:', err);
            showSnackbar(`Error al eliminar campaña: ${err.message || 'Error desconocido'}`, 'error');
        }
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

    const filteredCampaigns = campaigns.filter((campaign) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        return campaign.title.toLowerCase().includes(lowerCaseSearch);
    });

    const handleSaveSuccess = () => {
        showSnackbar('Campaña guardada exitosamente.', 'success');
        setIsFormOpen(false); 
        fetchData(); 
    };

    return (
        <PageContent>
            <GlassCard>
                <Box sx={{ width: '100%', minHeight: 200, overflowY: 'auto', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Gestión de Campañas Móviles
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleCreate}>
                            Crear Campaña
                        </Button>
                    </Box>

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por título..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <FaSearch style={{ marginRight: 8 }} />,
                        }}
                        sx={{ mb: 2 }}
                    />

                    {loading ? (
                        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
                    ) : error ? (
                        <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>{error}</Typography>
                    ) : (
                        <MobileCampaignTable
                            campaigns={filteredCampaigns}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDelete} 
                            orderBy={orderBy}
                            order={order}
                            handleSort={handleSort}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    )}

                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: 'auto', minWidth: 300, fontSize: '1.2rem', padding: '1rem' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>

                    <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
                        <DialogTitle>{selectedCampaign ? (isEditMode ? 'Editar Campaña' : 'Ver Campaña') : 'Crear Nueva Campaña'}</DialogTitle>
                        <DialogContent>
                            <MobileCampaignForm
                                campaign={selectedCampaign}
                                isEditMode={isEditMode}
                                onSaveSuccess={handleSaveSuccess}
                                showSnackbar={showSnackbar} 
                                onClose={() => setIsFormOpen(false)} 
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsFormOpen(false)} color="secondary">
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </GlassCard>
        </PageContent>
    );
};

export default MobileCampaignsPage;
