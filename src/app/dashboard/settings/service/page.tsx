"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { ServiceTable, ServiceForm, ServiceAddOn } from '../../components/settings/service';
// import { Service } from '../../../interface/serviceData';
import { Service } from '@/app/interface/serviceData';
import { Category } from "../../../interface/category";
import { SubCategory } from "../../../interface/subCategory";
import { ClientType } from "../../../interface/clientType";
import { ServiceType } from "../../../interface/serviceType";

import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';

interface SelectOptions {
    categories: Category[];
    subCategories: SubCategory[];
    serviceTypes: ServiceType[];
    clientTypes: ClientType[];
}

const ServicePage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [openAddOn, setOpenAddOn] = useState(false);
    const [isEdit, setIsedit] = useState(true);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState<keyof Service>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [selectOptions, setSelectOptions] = useState<SelectOptions>({
        categories: [],
        subCategories: [],
        serviceTypes: [],
        clientTypes: [],
    });
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [errorOptions, setErrorOptions] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const port = process.env.NEXT_PUBLIC_PORT;

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}:${port}/service/findAllWithChildrens`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'No message'}`);
                }

                const jsonData = await response.json();
                setServices(jsonData);
             
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching services:', err);
                showSnackbar(`Error loading Services: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const fetchSelectData = async () => {
            setLoadingOptions(true);
            try {
                const [categoriesResponse, subCategoriesResponse, serviceTypesResponse, clientTypesResponse] = await Promise.all([
                    fetch(`${baseUrl}:${port}/category/findAll`),
                    fetch(`${baseUrl}:${port}/subCategory/findAll`),
                    fetch(`${baseUrl}:${port}/servicestype/findAll`),
                    fetch(`${baseUrl}:${port}/clientType/findAll`),
                ]);

                if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
                if (!subCategoriesResponse.ok) throw new Error(`HTTP error! status: ${subCategoriesResponse.status}`);
                if (!serviceTypesResponse.ok) throw new Error(`HTTP error! status: ${serviceTypesResponse.status}`);
                if (!clientTypesResponse.ok) throw new Error(`HTTP error! status: ${clientTypesResponse.status}`);

                const categoriesData: Category[] = await categoriesResponse.json();
                const subCategoriesData: SubCategory[] = await subCategoriesResponse.json();
                const serviceTypesData: ServiceType[] = await serviceTypesResponse.json();
                const clientTypesData: ClientType[] = await clientTypesResponse.json();

                setSelectOptions({
                    categories: categoriesData,
                    subCategories: subCategoriesData,
                    serviceTypes: serviceTypesData,
                    clientTypes: clientTypesData,
                });

            } catch (err: any) {
                setErrorOptions(err.message);
                console.error('Error fetching select options:', err);
                showSnackbar(`Error loading select options: ${err.message}`, 'error');
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchSelectData();
    }, [baseUrl, port]);

    const handleEdit = (service: Service) => {
        setCurrentService(service);
        setIsedit(true);
        setOpen(true);
    };

    const handleCreate = () => {
        setCurrentService(null);
        setIsedit(true);
        setOpen(true);
    };

    const handleAddOn = (service: Service) => {
        setCurrentService(service);
        setOpenAddOn(true);
    };

    const handleView = (service: Service) => {
        setIsedit(false);
        setCurrentService(service);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${baseUrl}:${port}/service/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setServices(services.filter((service) => service.pkService !== id));
            showSnackbar('Successfully deleted Service', 'success');
        } catch (error: any) {
            console.error('Error when deleting Service: ', error);
            showSnackbar('Error deleting service', 'error');
        }
    };

    const handleSave = async (serviceData: any) => {
        try {
            const method = currentService?.pkService ? 'PATCH' : 'POST';
            const url = `${baseUrl}:${port}/service`;
            let bodyData;

            if (method === 'POST') {
                bodyData = {
                    fkSubCategory: parseInt(serviceData.fkSubCategory, 10),
                    name: serviceData.name,
                    description: serviceData.description,
                    fkClientType: serviceData.fkClientType !== null ? parseInt(serviceData.fkClientType, 10) : null,
                    fkServiceType: serviceData.fkServiceType !== null ? parseInt(serviceData.fkServiceType, 10) : null,
                };
            } else {
                bodyData = {
                    pkService: currentService.pkService,
                    fkSubCategory: parseInt(serviceData.fkSubCategory, 10),
                    name: serviceData.name,
                    description: serviceData.description,
                    fkClientType: serviceData.fkClientType !== null ? parseInt(serviceData.fkClientType, 10) : null,
                    fkServiceType: serviceData.fkServiceType !== null ? parseInt(serviceData.fkServiceType, 10) : null,
                    status: parseInt(serviceData.status, 10),
                };
            }
           
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedService = await response.json();

            if (method === 'POST') {
                setServices([...services, updatedService]);
                showSnackbar('Service created successfully', 'success');
            } else {
                setServices(services.map((s) =>
                    s.pkService === updatedService.service.pkService ? updatedService.service : s
                ));
                showSnackbar('Service successfully updated', 'success');
            }

            setOpen(false);
            setCurrentService(null);
        } catch (error: any) {
            console.error('Error saving Service: ', error);
            showSnackbar('Error saving Service ', 'error');
        }
    };

    const handleSort = (property: keyof Service) => {
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

    const filteredServices = services.filter((service) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        return (
            service.name.toLowerCase().includes(lowerCaseSearch) ||
            service.description.toLowerCase().includes(lowerCaseSearch)
        );
    });

    return (
        <PageContent>
            <GlassCard>
                <Box sx={{ width: '100%', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                            Services
                        </Typography>
                        <Button variant="contained" onClick={() => handleCreate()}>
                            Add New Service
                        </Button>
                    </Box>

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar servicios..."
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
                        <ServiceTable
                            services={filteredServices}
                            onEdit={handleEdit}
                            onView={handleView}
                            onService={handleAddOn}
                            onDelete={handleDelete}
                            orderBy={orderBy}
                            order={order}
                            handleSort={handleSort}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            searchQuery={searchQuery}
                        />
                    )}
    
                    <ServiceForm
                        open={open}
                        isEdit={isEdit}
                        onClose={() => setOpen(false)}
                        service={currentService}
                        onSave={handleSave}
                        categories={selectOptions.categories}
                        subCategories={selectOptions.subCategories}
                        serviceTypes={selectOptions.serviceTypes}
                        clientTypes={selectOptions.clientTypes}
                    />

                    <ServiceAddOn
                        open={openAddOn}
                        onClose={() => setOpenAddOn(false)}
                        service={currentService}
                    />

                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbarSeverity}
                            sx={{ width: 'auto', minWidth: 300, fontSize: '1.2rem', padding: '1rem' }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </GlassCard>
        </PageContent>
    );
};

export default ServicePage;