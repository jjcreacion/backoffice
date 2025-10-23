"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    Autocomplete,
    FormHelperText
} from '@mui/material';
import { InvoiceInterface } from '@interfaces/Invoice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type InvoiceFormData = Omit<
    InvoiceInterface,
    'id' | 'created_at' | 'updated_at' | 'user' | 'invoice_id' | 'payment_date' | 'status' 
    | 'invoice_status' 
>;

interface InvoiceFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (invoice: InvoiceFormData) => void;
    invoice: InvoiceInterface | null;
    isEdit: boolean;
    savingData: boolean;
}

interface User {
    pkUser: number;
    email: string;
    person: {
        firstName: string;
        lastName: string;
    };
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
    open,
    onClose,
    onSave,
    invoice,
    isEdit,
    savingData,
}) => {
    const getInitialFormData = (): InvoiceFormData => ({
        fk_user: null,
        invoice_amount: 0,
        public_link: '',
        invoice_number: '', 
        invoice_date: new Date().toISOString().split('T')[0],       
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;
    const [users, setUsers] = useState<User[]>([]);
   
    const validationSchema = Yup.object({
        fk_user: Yup.number().required('User is required'),
        invoice_number: Yup.string().required('Invoice number is required'),
        invoice_amount: Yup.number()
            .min(0.01, 'Amount must be greater than 0')
            .required('Invoice amount is required'),
        invoice_date: Yup.date().required('Invoice date is required'), 
        public_link: Yup.string().url('Must be a valid URL').nullable(),
    });

    const formik = useFormik<InvoiceFormData>({
        initialValues: getInitialFormData(),
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSave(values);
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}:${port}/user/findAll`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                }
                const data = await response.json();
                 const usersArray = Array.isArray(data) ? data : (data.data || []);

                if (Array.isArray(usersArray)) {
                    setUsers(usersArray);
                } else {
                    console.error("Users API response is not an array:", data);
                    setUsers([]); 
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (open) {
            if (invoice) {
               formik.setValues({
                    invoice_number: invoice.invoice_number || '',
                    fk_user: invoice.fk_user || null,
                    invoice_amount: invoice.invoice_amount || 0,
                    public_link: invoice.public_link || '',
                    invoice_date: invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split('T')[0] : '', // 'invoice_status' removed
                });
            } else {
                formik.resetForm({ values: getInitialFormData() });
            }
        }
    }, [invoice, open]);


    const title = isEdit ? (invoice ? 'Edit Invoice' : 'New Invoice') : 'View Invoice';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent >
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    
                <Grid item xs={12} sm={6}>
                        <Autocomplete
                            id="user-autocomplete"
                            options={users}
                            getOptionLabel={(option) =>
                                option.person
                                    ? `${option.person.firstName} ${option.person.lastName} (${option.email})`
                                    : option.email
                            }
                            value={users.find(user => user.pkUser === formik.values.fk_user) || null}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('fk_user', newValue ? newValue.pkUser : null);
                            }}
                            onBlur={() => formik.setFieldTouched('fk_user', true)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="User"
                                    error={formik.touched.fk_user && Boolean(formik.errors.fk_user)}
                                    helperText={formik.touched.fk_user && formik.errors.fk_user ? formik.errors.fk_user : "Select the user for the invoice"}
                                />
                            )}
                            disabled={!isEdit}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_number"
                            label="Invoice Number"
                            value={formik.values.invoice_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.invoice_number && Boolean(formik.errors.invoice_number)}
                            helperText={formik.touched.invoice_number && formik.errors.invoice_number}
                            disabled={!isEdit}
                            margin="none" 
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_amount"
                            label="Invoice Amount"
                            type="number"
                            value={formik.values.invoice_amount === 0 ? '' : formik.values.invoice_amount} 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.invoice_amount && Boolean(formik.errors.invoice_amount)}
                            helperText={formik.touched.invoice_amount && formik.errors.invoice_amount}
                            disabled={!isEdit}
                            margin="none"
                            inputProps={{ step: "0.01" }} 
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_date"
                            label="Invoice Date"
                            type="date"
                            value={formik.values.invoice_date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            error={formik.touched.invoice_date && Boolean(formik.errors.invoice_date)}
                            helperText={formik.touched.invoice_date && formik.errors.invoice_date}
                            margin="none"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            name="public_link"
                            label="Public Link"
                            value={formik.values.public_link}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.public_link && Boolean(formik.errors.public_link)}
                            helperText={formik.touched.public_link && formik.errors.public_link}
                            disabled={!isEdit}
                            margin="none"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose} variant="outlined" color="error">Cancel</Button>
                {isEdit && (
                    <Button type="submit" variant="contained" disabled={savingData}>
                        {savingData ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                )}
            </DialogActions>
            </form>
        </Dialog>
    );
};

export default InvoiceForm;

