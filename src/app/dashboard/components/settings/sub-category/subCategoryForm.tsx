"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Category } from "../../../../interface/category";
import { SubCategory } from "../../../../interface/subCategory";
import { ClientType } from "../../../../interface/clientType";
import { ServiceType } from "../../../../interface/serviceType";

interface ServiceFormProps {
    open: boolean;
    isEdit: boolean;
    onClose: () => void;
    subCategory: SubCategory | null;
    onSave: (serviceData: any) => void;
    categories: Category[];
    clientTypes: ClientType[];
    serviceTypes: ServiceType[];
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').nullable(),
    description: Yup.string().nullable(),
    fkCategory: Yup.number().required('Category is required').nullable(),
    fkClientType: Yup.number().required('Client Type is required').nullable(),
    fkServiceType: Yup.number().required('Service Type is required').nullable(),
});

const SunCategoryFrom: React.FC<ServiceFormProps> = ({
    open,
    isEdit,
    onClose,
    subCategory,
    onSave,
    categories,
    clientTypes,
    serviceTypes,
}) => {
    const initialValues = {
        name: '',
        description: '',
        fkCategory: 0,
        fkClientType: 0,
        fkServiceType: 0,
        status: 1,
    };
    

    const formik = useFormik({
        initialValues: subCategory ? {
            name: subCategory.name || '',
            description: subCategory.description || '',
            fkCategory: subCategory.category.pkCategory ? subCategory.category.pkCategory : '',
            fkClientType: subCategory.clientType.pkType !== undefined ? subCategory.clientType.pkType : '',
            fkServiceType: subCategory.serviceType.pkType !== undefined ? subCategory.serviceType.pkType : '',
            status: subCategory.status !== undefined ? subCategory.status : 1,
        } : initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("Enviar Datos...")
            const payload = {
                name: values.name,
                description: values.description,
                fkClientType: values.fkClientType ? parseInt(values.fkClientType.toString(), 10) : null,
                fkServiceType: values.fkServiceType ? parseInt(values.fkServiceType.toString(), 10) : null,
                status: values.status,
                fkCategory: values.fkCategory ? parseInt(values.fkCategory.toString(), 10) : null,
            };
            onSave(payload);
        },
    });

    useEffect(() => {
        if (!open) {
            formik.resetForm();
        }
    }, [open, formik.resetForm]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit && subCategory ? 'Edit Sub Category' : 'Create New Sub Category'}</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl fullWidth margin="dense" error={formik.touched.fkCategory && Boolean(formik.errors.fkCategory)}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="fkCategory"
                            name="fkCategory"
                            value={formik.values.fkCategory}
                            label="Category"
                            onChange={formik.handleChange}
                            disabled={!isEdit}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.pkCategory} value={category.pkCategory}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.fkCategory && formik.errors.fkCategory && (
                            <FormHelperText>{formik.errors.fkCategory}</FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        required
                        disabled={!isEdit}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        disabled={!isEdit}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="client-type-label">Client Type</InputLabel>
                        <Select
                            labelId="client-type-label"
                            id="fkClientType"
                            name="fkClientType"
                            value={formik.values.fkClientType}
                            label="Client Type"
                            onChange={formik.handleChange}
                            disabled={!isEdit}
                        >
                            {clientTypes.map((clientType) => (
                                <MenuItem key={clientType.pkType} value={clientType.pkType}>
                                    {clientType.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="service-type-label">Service Type</InputLabel>
                        <Select
                            labelId="service-type-label"
                            id="fkServiceType"
                            name="fkServiceType"
                            value={formik.values.fkServiceType}
                            label="Service Type"
                            onChange={formik.handleChange}
                            disabled={!isEdit}
                        >
                            {serviceTypes.map((serviceType) => (
                                <MenuItem key={serviceType.pkType} value={serviceType.pkType}>
                                    {serviceType.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        {isEdit && (
                          <Button type="submit" variant="contained">
                            Save
                          </Button>
                        )}
                    </DialogActions>
                </form>
            </DialogContent>
           
        </Dialog>
    );
};

export default SunCategoryFrom;