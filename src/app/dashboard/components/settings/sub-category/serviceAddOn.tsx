"use client";

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    FormHelperText,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Paper,
    Box,
    DialogActions,
    Toolbar,
    AppBar,
    Snackbar,
    Alert,
} from '@mui/material';

import { Delete as DeleteIcon, Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ServiceAddOn } from "../../../../interface/serviceAddOn";
import { SubCategory } from "../../../../interface/subCategory";

interface ServiceFormProps {
    open: boolean;
    onClose: () => void;
    subCategory: SubCategory | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ open, onClose, subCategory }) => {
    const [editingAddon, setEditingAddon] = useState<ServiceAddOn | null>(null);
    const [addons, setAddons] = useState<ServiceAddOn[]>([]);
    const [loadingAddons, setLoadingAddons] = useState(false);
    const [errorLoadingAddons, setErrorLoadingAddons] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [addonToDelete, setAddonToDelete] = useState<number | null>(null);
    const [addonUpdated, setAddonUpdated] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;
    const apiUrl = `${baseUrl}:${port}`;

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').nullable(),
        description: Yup.string().nullable(),
        contentWeb: Yup.string().nullable(),
        price: Yup.number().required('Price is required').min(0, 'Price cannot be negative').nullable(),
        isRetail: Yup.number().oneOf([0, 1]).required('Retail selection is required').nullable(),
    });

    const initialValues = {
        isRetail: 0,
        name: '',
        description: '',
        contentWeb: '',
        price: 0,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            
            if (!subCategory?.pkSubCategory) {
                console.error('Cannot save addon as there is no associated service.');
                return;
            }
            try {
                if (editingAddon) {
                    await handleUpdateAddon(values);
                } else {
                    await handleSaveAddon(values);
                }
            } catch (error) {
                console.error('Error saving/updating addon:', error);
                showSnackbar('Error saving/updating addon.', 'error');
            }
        },
    });

    useEffect(() => {
        const fetchServiceAddons = async () => {
            if (subCategory?.pkSubCategory) {
                setLoadingAddons(true);
                try {
                    const response = await fetch(`${apiUrl}/serviceAddon/getAllByService/${subCategory.pkSubCategory}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Error fetching addons: ${response.status}`);
                    }
                    const responseData = await response.json();
                    if (responseData && Array.isArray(responseData.addons)) {
                        const formattedAddons: ServiceAddOn[] = responseData.addons.map(item => ({
                            pkAddon: item.pkAddon,
                            isRetail: item.isRetail,
                            name: item.name,
                            description: item.description,
                            contentWeb: item.contentWeb,
                            price: item.price,
                            fkService: subCategory.pkSubCategory,
                            status: item.status,
                        }));
                        setAddons(formattedAddons);
                        setErrorLoadingAddons(null);
                    } else {
                        console.error("Backend response does not contain an array of addons in the 'addons' property:", responseData);
                        setErrorLoadingAddons("Error: Backend response does not have the expected format for addons.");
                        setAddons([]);
                    }
                } catch (error: any) {
                    console.error('Error loading addons:', error);
                    setErrorLoadingAddons(error.message || 'Error loading addons');
                    setAddons([]);
                } finally {
                    setLoadingAddons(false);
                }
            } else {
                setAddons([]);
            }
        };

        fetchServiceAddons();
        setAddonUpdated(false); 
    }, [subCategory?.pkSubCategory, apiUrl]);

    useEffect(() => {
        if (editingAddon) {
            formik.setValues({
                isRetail: editingAddon.isRetail,
                name: editingAddon.name,
                description: editingAddon.description || '',
                contentWeb: editingAddon.contentWeb || '',
                price: editingAddon.price,
            });
        } else {
            formik.resetForm();
        }
    }, [editingAddon, formik.setValues, formik.resetForm]);

    const handleEditAddon = (addon: ServiceAddOn) => {
        setEditingAddon(addon);
    };

    const openConfirmDeleteDialog = (addonId: number) => {
        setAddonToDelete(addonId);
        setConfirmDeleteDialogOpen(true);
    };

    const closeConfirmDeleteDialog = () => {
        setAddonToDelete(null);
        setConfirmDeleteDialogOpen(false);
    };

    const handleDeleteConfirmation = async () => {
        if (addonToDelete !== null) {
            await handleDeleteAddon(addonToDelete);
            closeConfirmDeleteDialog();
        }
    };

    const handleDeleteAddon = async (addonId: number) => {
        try {
            const response = await fetch(`${apiUrl}/serviceAddon/${addonId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error deleting addon: ${response.status}`);
            }
            setAddons(addons.filter((addon) => addon.pkAddon !== addonId));
            setEditingAddon(null);
            showSnackbar('Addon deleted successfully.', 'success');
        } catch (error) {
            console.error('Error deleting addon:', error);
            showSnackbar('Error deleting addon.', 'error');
        }
    };

    const handleSaveAddon = async (values: typeof initialValues) => {
        if (!subCategory?.pkSubCategory) {
            console.error('Cannot save addon as there is no associated service.');
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/serviceAddon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...values, fkService: subCategory.pkSubCategory }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error creating addon: ${response.status}`);
            }
            const newAddon: ServiceAddOn = await response.json();
            setAddons([...addons, newAddon]);
            formik.resetForm();
            showSnackbar('Addon created successfully.', 'success');
            setAddonUpdated(true); 
        } catch (error) {
            console.error('Error saving addon:', error);
            showSnackbar('Error saving addon.', 'error');
        }
    };

  
    const handleUpdateAddon = async (values: typeof initialValues) => {
        if (!editingAddon) return;
        try {
            const response = await fetch(`${apiUrl}/serviceAddon`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pkAddon: editingAddon.pkAddon,
                    ...values,
                    status: editingAddon.status !== undefined ? editingAddon.status : 1,
                    fkService: subCategory?.pkSubCategory,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error updating addon: ${response.status}`);
            }
            
            const updatedAddon: ServiceAddOn = {
                ...editingAddon, 
                ...values,
                status: editingAddon.status !== undefined ? editingAddon.status : 1,
            };
            
            setAddons(addons.map(addon =>
                addon.pkAddon === updatedAddon.pkAddon ? updatedAddon : addon
            ));
            
            setEditingAddon(null);
            formik.resetForm();
            showSnackbar('Addon updated successfully.', 'success');
            setAddonUpdated(true);
        } catch (error) {
            console.error('Error updating addon:', error);
            showSnackbar('Error updating addon.', 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {subCategory ? `Manage Addons for ${subCategory.name}` : 'Manage Addons'}
                    </Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{ mt: 1, bgcolor: '#f0f0f0' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={2}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="contentWeb"
                                    name="contentWeb"
                                    label="Content Web"
                                    multiline
                                    rows={2}
                                    value={formik.values.contentWeb}
                                    onChange={formik.handleChange}
                                />

                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="isRetail-label">Is Retail</InputLabel>
                                    <Select
                                        labelId="isRetail-label"
                                        id="isRetail"
                                        name="isRetail"
                                        value={formik.values.isRetail}
                                        label="Is Retail"
                                        onChange={formik.handleChange}
                                        error={formik.touched.isRetail && Boolean(formik.errors.isRetail)}
                                    >
                                        <MenuItem value={0}>No</MenuItem>
                                        <MenuItem value={1}>Yes</MenuItem>
                                    </Select>
                                    {formik.touched.isRetail && formik.errors.isRetail && (
                                        <FormHelperText error>{formik.errors.isRetail}</FormHelperText>
                                    )}
                                </FormControl>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                                <Box mt={2}>
                                    <Button type="submit" variant="contained" color="primary">
                                        {editingAddon ? 'Save Changes' : 'Add Addon'}
                                    </Button>
                                    <Button onClick={() => setEditingAddon(null)} disabled={!editingAddon} sx={{ ml: 1 }}>
                                        Cancel Edit
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2, maxHeight: '500px', overflowY: 'auto' }}>
                            <Typography variant="h6" gutterBottom>
                                Addons for {subCategory?.name}
                            </Typography>
                            <List>
                                {loadingAddons ? (
                                    <ListItem>
                                        <ListItemText primary="Loading Addons..." />
                                    </ListItem>
                                ) : errorLoadingAddons ? (
                                    <ListItem>
                                        <ListItemText primary={`Error loading addons: ${errorLoadingAddons}`} />
                                    </ListItem>
                                ) : addons.length > 0 ? (
                                    addons.map((addon) => (
                                        <ListItem key={addon.pkAddon} divider>
                                            <ListItemText
                                                primary={addon.name}
                                                secondary={`Price: ${addon.price}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditAddon(addon)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteDialog(addon.pkAddon)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText primary={`No addons available for ${subCategory?.name}.`} />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={closeConfirmDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete Addon?"}
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    Are you sure you want to delete this addon?
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirmation} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default ServiceForm;