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
    AutocompleteProps,
    Stack,
    FormHelperText,
} from '@mui/material';
import { InvoiceInterface } from '@interfaces/Invoice';

type InvoiceFormData = Omit<
    InvoiceInterface,
    'id' | 'created_at' | 'updated_at' | 'user' | 'invoice_id' | 'payment_date' | 'status' 
>;

interface InvoiceFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (invoice: InvoiceFormData) => void;
    invoice: InvoiceInterface | null;
    isEdit: boolean;
    savingData: boolean;
}

interface User { id: number; email: string }

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
        invoice_status: 'pending',      
    });

    const [formData, setFormData] = useState<InvoiceFormData>(getInitialFormData());
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;
    const [users, setUsers] = useState<User[]>([]);
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}:${port}/users/findAll`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                }
                const data = await response.json();
                const usersArray = Array.isArray(data) ? data : data.data;

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
                setFormData({
                    invoice_number: invoice.invoice_number || '',
                    fk_user: invoice.fk_user || null,
                    invoice_amount: invoice.invoice_amount || 0,
                    public_link: invoice.public_link || '',
                    invoice_date: invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split('T')[0] : '',
                    invoice_status: invoice.invoice_status || 'pending',
                });
                setUserEmail(users.find(user => user.id === invoice.fk_user)?.email || null);
            } else {
                setFormData(getInitialFormData());
                setUserEmail(null);
            }
        }
    }, [invoice, open, users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
        const { name, value } = e.target;
        console.log("name= ", name);
        console.log("value= ", value);
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const title = isEdit ? (invoice ? 'Edit Invoice' : 'New Invoice') : 'View Invoice';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEdit}>
                            <InputLabel id="user-label">User</InputLabel>
                            <Select
                                labelId="user-label"
                                id="fk_user"
                                name="fk_user"
                                value={formData.fk_user === null ? '' : formData.fk_user} 
                                label="User"
                                onChange={handleChange}
                            >
                                <MenuItem value={''}>
                                    <em>None</em>
                                </MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.email}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select the user for the invoice</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_number"
                            label="Invoice Number"
                            value={formData.invoice_number}
                            onChange={handleChange}
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
                            value={formData.invoice_amount === 0 ? '' : formData.invoice_amount} 
                            onChange={handleChange}
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
                            value={formData.invoice_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            margin="none"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="public_link"
                            label="Public Link"
                            value={formData.public_link}
                            onChange={handleChange}
                            disabled={!isEdit}
                            margin="none"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEdit} margin="none">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select 
                                labelId="status-label"
                                name="invoice_status" 
                                value={formData.invoice_status || 'pending'} 
                                label="Status" 
                                onChange={handleChange}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="overdue">Overdue</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {isEdit && (
                    <Button onClick={handleSave} variant="contained" disabled={savingData}>
                        {savingData ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceForm;

