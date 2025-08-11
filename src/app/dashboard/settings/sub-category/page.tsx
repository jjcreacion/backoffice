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
import { SubCategoryTable, SubCategoryForm, ServiceAddOn } from '../../components/settings/sub-category';
import { SubCategory } from "../../../interface/subCategory";
import { Category } from "../../../interface/category";
import { ClientType } from "../../../interface/clientType";
import { ServiceType } from "../../../interface/serviceType";

import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';

interface SelectOptions {
    categories: Category[];
    serviceTypes: ServiceType[];
    clientTypes: ClientType[];
}

const ServicePage: React.FC = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [openAddOn, setOpenAddOn] = useState(false);
    const [isEdit, setIsedit] = useState(true);
    const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderBy, setOrderBy] = useState<keyof SubCategory>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [selectOptions, setSelectOptions] = useState<SelectOptions>({
        categories: [],
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
                const response = await fetch(`${baseUrl}:${port}/sub_category/findAll`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'No message'}`);
                }

                const jsonData = await response.json();
                setSubCategories(jsonData);
             
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching subCategories:', err);
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
                const [categoriesResponse, serviceTypesResponse, clientTypesResponse] = await Promise.all([
                    fetch(`${baseUrl}:${port}/category/findAll`),
                    fetch(`${baseUrl}:${port}/servicestype/findAll`),
                    fetch(`${baseUrl}:${port}/clientType/findAll`),
                ]);

                if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
                if (!serviceTypesResponse.ok) throw new Error(`HTTP error! status: ${serviceTypesResponse.status}`);
                if (!clientTypesResponse.ok) throw new Error(`HTTP error! status: ${clientTypesResponse.status}`);

                const categoriesData: Category[] = await categoriesResponse.json();
                const serviceTypesData: ServiceType[] = await serviceTypesResponse.json();
                const clientTypesData: ClientType[] = await clientTypesResponse.json();

                setSelectOptions({
                    categories: categoriesData,
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

    const handleEdit = (subCategory: SubCategory) => {
        setCurrentSubCategory(subCategory);
        setIsedit(true);
        setOpen(true);
    };

    const handleCreate = () => {
        setCurrentSubCategory(null);
        setIsedit(true);
        setOpen(true);
    };

    const handleAddOn = (subCategory: SubCategory) => {
        setCurrentSubCategory(subCategory);
        setOpenAddOn(true);
    };

    const handleView = (subCategory: SubCategory) => {
        setIsedit(false);
        setCurrentSubCategory(subCategory);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${baseUrl}:${port}/sub_category/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSubCategories(subCategories.filter((subCategory) => subCategory.pkSubCategory !== id));
            showSnackbar('Successfully deleted Sub Category', 'success');
        } catch (error: any) {
            console.error('Error when deleting Sub Category: ', error);
            showSnackbar('Error deleting Sub Category', 'error');
        }
    };

    const handleSave = async (serviceData: any) => {
        try {
            const method = currentSubCategory?.pkSubCategory? 'PATCH' : 'POST';
            const url = `${baseUrl}:${port}/sub_category`;
            let bodyData;

            if (method === 'POST') {
                bodyData = {
                    name: serviceData.name,
                    description: serviceData.description,
                    fkCategory: parseInt(serviceData.fkCategory, 10),
                    fkClientType: serviceData.fkClientType !== null ? parseInt(serviceData.fkClientType, 10) : null,
                    fkServiceType: serviceData.fkServiceType !== null ? parseInt(serviceData.fkServiceType, 10) : null,
                };
                
            } else {
                bodyData = {
                    pkSubCategory: currentSubCategory?.pkSubCategory,
                    name: serviceData.name,
                    description: serviceData.description,
                    fkCategory: parseInt(serviceData.fkCategory, 10),
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

            const updatedSubCategory = await response.json();
            console.log(updatedSubCategory);

            if (method === 'POST') {
                setSubCategories([...subCategories, updatedSubCategory]);
                showSnackbar('Sub-Category created successfully', 'success');
            } else {
                setSubCategories(subCategories.map((s) =>
                    s.pkSubCategory === updatedSubCategory.service.pkSubCategory ? updatedSubCategory.service : s
                ));
                showSnackbar('Sub-Categoru successfully updated', 'success');
            }

            setOpen(false);
            setCurrentSubCategory(null);
        } catch (error: any) {
            console.error('Error saving Sub Category: ', error);
            showSnackbar('Error saving Sub Category', 'error');
        }
    };

    const handleSort = (property: keyof SubCategory) => {
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

    const filteredServices = subCategories.filter((service) => {
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
                            Sub-Category
                        </Typography>
                        <Button variant="contained" onClick={() => handleCreate()}>
                            Add Sub-Category
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
                        <SubCategoryTable
                            subCategories={filteredServices}
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
    
                  
                    <SubCategoryForm
                        open={open}
                        isEdit={isEdit}
                        onClose={() => setOpen(false)}
                        subCategory={currentSubCategory}
                        onSave={handleSave}
                        categories={selectOptions.categories}
                        serviceTypes={selectOptions.serviceTypes}
                        clientTypes={selectOptions.clientTypes}
                    /> 

                    {openAddOn && currentSubCategory && (
                        <ServiceAddOn
                            open={openAddOn}
                            onClose={() => setOpenAddOn(false)}
                            subCategory={currentSubCategory}
                        />
                    )}


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