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
    'id' | 'createdAt' | 'updatedAt' | 'user' | 'invoice_id' | 'invoice_status' | 'payment_date' 
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
    });

    const [formData, setFormData] = useState<InvoiceFormData>(getInitialFormData());
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;
    const [users, setUsers] = useState<User[]>([]);
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}:${port}/users`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
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
                });
                setUserEmail(users.find(user => user.id === invoice.fk_user)?.email || null);
            } else {
                setFormData(getInitialFormData());
                setUserEmail(null);
            }
        }
    }, [invoice, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
        const { name, value } = e.target;
        console.log("name= ", name);
        console.log("value= ", value);
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const title = isEdit ? (invoice ? 'Editar Factura' : 'Nueva Factura') : 'Ver Factura';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!isEdit}>
                            <InputLabel id="user-label">Usuario</InputLabel>
                            <Select
                                labelId="user-label"
                                id="fk_user"
                                name="fk_user"
                                value={formData.fk_user || ''}
                                label="Usuario"
                                onChange={handleChange}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.email}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Seleccione el usuario para la factura</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="invoice_number"
                            label="Número de Factura"
                            value={formData.invoice_number}
                            onChange={handleChange}
                            
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_amount"
                            label="Monto de la Factura"
                            type="number"
                            value={formData.invoice_amount}
                            onChange={handleChange}
                            fullWidth
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="invoice_date"
                            label="Fecha de la Factura"
                            type="date"
                            value={formData.invoice_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="public_link"
                            label="Link Público"
                            value={formData.public_link}
                            onChange={handleChange}
                            disabled={!isEdit}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEdit}>
                            <InputLabel>Estado</InputLabel>
                            <Select name="status" value={formData.status} label="Estado" onChange={handleChange}>
                                <MenuItem value="pending">Pendiente</MenuItem>
                                <MenuItem value="paid">Pagada</MenuItem>
                                <MenuItem value="overdue">Vencida</MenuItem>
                                <MenuItem value="cancelled">Cancelada</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                {isEdit && (
                    <Button onClick={handleSave} variant="contained" disabled={savingData}>
                        {savingData ? <CircularProgress size={24} /> : 'Guardar'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceForm;

