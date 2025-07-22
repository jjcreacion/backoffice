"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    FormControlLabel,
    Switch,
    Typography,
    Grid,
    IconButton,
    Dialog, // Import Dialog components as per your structure
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material'; // Icon for image upload
import { useFormik } from 'formik'; // For form management and validation
import * as Yup from 'yup'; // For schema validation
import axios from 'axios';

import { MobileCampaign } from '../../../../interface/MobileCampaign';

interface MobileCampaignFormProps {
    open: boolean; // Controls if the dialog is open
    campaign: MobileCampaign | null; // Campaign data for editing/viewing, null for creation
    isEditMode: boolean; // true for edit/create, false for view-only
    onSaveSuccess: () => void; // Callback after successful save
    showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void; // Snackbar utility
    onClose: () => void; // Callback to close the dialog
}

export const MobileCampaignForm: React.FC<MobileCampaignFormProps> = ({
    open,
    campaign,
    isEditMode,
    onSaveSuccess,
    showSnackbar,
    onClose,
}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
    const port = process.env.NEXT_PUBLIC_PORT || '5641';
    const API_URL = `${baseUrl}:${port}/mobile-campaigns`;

    // Initial values for Formik
    const initialValues = {
        title: '',
        description: '',
        startDate: '', // Will be YYYY-MM-DD string for date input
        endDate: '',   // Will be YYYY-MM-DD string for date input
        isActive: true,
    };

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('El título es obligatorio.'),
        description: Yup.string().nullable(), // Description can be null
        startDate: Yup.date()
            .required('La fecha de inicio es obligatoria.')
            .nullable()
            .typeError('Formato de fecha inválido.'),
        endDate: Yup.date()
            .required('La fecha de fin es obligatoria.')
            .nullable()
            .typeError('Formato de fecha inválido.')
            .min(
                Yup.ref('startDate'),
                'La fecha de fin no puede ser anterior a la fecha de inicio.'
            ),
        isActive: Yup.boolean().required('El estado activo es obligatorio.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let response;
                let campaignId = campaign?.campaignsId; // ID if editing

                const formattedStartDate = values.startDate ? new Date(values.startDate).toISOString() : '';
                const formattedEndDate = values.endDate ? new Date(values.endDate).toISOString() : '';

                if (campaign) { // Edit mode
                    const updateDto = {
                        campaignsId: campaign.campaignsId,
                        title: values.title,
                        description: values.description,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        isActive: values.isActive,
                    };
                    response = await axios.patch(`${API_URL}/${campaign.campaignsId}`, updateDto);
                    showSnackbar('Campaña actualizada exitosamente.', 'success');
                } else { // Create mode
                    const createDto = {
                        title: values.title,
                        description: values.description,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                        isActive: values.isActive,
                    };
                    response = await axios.post(API_URL, createDto);
                    campaignId = response.data.campaignsId; // Get ID of the newly created campaign
                    showSnackbar('Campaña creada exitosamente.', 'success');
                }

                // If an image file is selected, upload it
                if (imageFile && campaignId) {
                    await uploadImage(campaignId, imageFile);
                    showSnackbar('Imagen de campaña subida y asociada exitosamente.', 'success');
                } else if (!campaign && !imageFile) {
                    // If it's a new campaign and no image was uploaded, notify that it can be added later
                    showSnackbar('Campaña creada sin imagen. Puedes añadir una imagen editando la campaña.', 'info');
                }

                onSaveSuccess(); // Call the callback to refresh the list and close the modal
            } catch (err: any) {
                console.error('Error al guardar la campaña:', err);
                showSnackbar(`Error al guardar campaña: ${err.response?.data?.message || err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        },
    });

    // Effect to reset form when dialog opens or campaign changes
    useEffect(() => {
        if (open) {
            formik.resetForm();
            formik.setTouched({});
            if (campaign) {
                // Populate form for editing existing campaign
                formik.setValues({
                    title: campaign.title,
                    description: campaign.description ?? '',
                    startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
                    endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
                    isActive: campaign.isActive,
                });
                setImagePreview(campaign.imageUrl || null); // Show existing image
            } else {
                // Reset for new campaign
                formik.setValues(initialValues);
                setImageFile(null);
                setImagePreview(null);
            }
        }
    }, [open, campaign]); // Depend on 'open' and 'campaign'

    /**
     * Handles selection of an image file.
     * @param e The change event from the file input.
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    /**
     * Uploads the image to the server.
     * @param campaignId The ID of the campaign to associate the image with.
     * @param file The image file to upload.
     * @returns The URL of the saved image.
     * @throws Error if upload fails.
     */
    const uploadImage = async (campaignId: number, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file); // 'file' must match the field name in the backend interceptor

        try {
            const response = await axios.post(`${API_URL}/upload-image/${campaignId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.imageUrl; // Assuming backend returns the updated campaign URL
        } catch (uploadError: any) {
            console.error('Error al subir la imagen:', uploadError);
            throw new Error(`Error al subir la imagen: ${uploadError.response?.data?.message || uploadError.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{campaign ? (isEditMode ? 'Editar Campaña' : 'Ver Campaña') : 'Crear Nueva Campaña'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Título"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                                disabled={!isEditMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                multiline
                                rows={3}
                                disabled={!isEditMode}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Inicio"
                                name="startDate"
                                type="date"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                InputLabelProps={{ shrink: true }}
                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                helperText={formik.touched.startDate && formik.errors.startDate}
                                disabled={!isEditMode}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Fin"
                                name="endDate"
                                type="date"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                InputLabelProps={{ shrink: true }}
                                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                helperText={formik.touched.endDate && formik.errors.endDate}
                                disabled={!isEditMode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formik.values.isActive}
                                        onChange={formik.handleChange}
                                        name="isActive"
                                        color="primary"
                                        disabled={!isEditMode}
                                    />
                                }
                                label="Activa"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Imagen de Campaña
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="campaign-image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    disabled={!isEditMode}
                                />
                                <label htmlFor="campaign-image-upload">
                                    <IconButton color="primary" component="span" disabled={!isEditMode}>
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                {imagePreview && (
                                    <Box
                                        component="img"
                                        src={imagePreview}
                                        alt="Vista previa de la imagen"
                                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                )}
                                {!imagePreview && !imageFile && (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay imagen seleccionada.
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>
                    Cerrar
                </Button>
                {isEditMode && (
                    <Button type="submit" variant="contained" color="primary" onClick={formik.handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (campaign ? 'Actualizar' : 'Crear')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};