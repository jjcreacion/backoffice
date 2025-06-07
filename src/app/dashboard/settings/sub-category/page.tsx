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
import { SubCategoryTable, SubCategoryForm } from '../../components/settings/sub-category';
import { subCategory } from '../../../interface/subCategoryData';
import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';

const SubCategoryPage: React.FC = () => {
  const [subCategories, setSubCategories] = useState<subCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(true);
  const [currentSubCategory, setCurrentSubCategory] = useState<subCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}:${port}/subCategory/alldata`, {
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
        console.error('Error fetching data:', err);
        showSnackbar(`Error loading Sub-Categories: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (subCategory: subCategory) => {
    setCurrentSubCategory(subCategory);
    setIsedit(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setCurrentSubCategory(null);
    setIsedit(true);
    setOpen(true);
  };

  const handleView = (subCategory: subCategory) => {
    setIsedit(false);
    setCurrentSubCategory(subCategory);
    setOpen(true);
  };

  const handleDelete = async (id: number) => { 
    try {
      const response = await fetch(`${baseUrl}:${port}/subCategory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubCategories(subCategories.filter((category) => category.pkSubCategory !== id)); 
      showSnackbar('Successfully deleted subCategory', 'success');
    } catch (error: any) {
      console.error('Error when deleting subCategory: ', error);
      showSnackbar('Error deleting subCategory', 'error');
    }
  };

  const handleSave = async (subCategoryData: any) => {
    try {
      const method = currentSubCategory?.pkSubCategory ? 'PATCH' : 'POST';
      const url = `${baseUrl}:${port}/subCategory`;
      let bodyData;

      if (method === 'POST') {
        bodyData = {
          fkCategory: parseInt(subCategoryData.fkCategory, 10),
          name: subCategoryData.name,
          description: subCategoryData.description,
        };
      } else {
        bodyData = {
          pkSubCategory: currentSubCategory.pkSubCategory,
          fkCategory: parseInt(subCategoryData.fkCategory, 10),
          name: subCategoryData.name,
          description: subCategoryData.description,
          status: 1,
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
      
      if (method === 'POST') {
        setSubCategories([...subCategories, updatedSubCategory]);
        showSnackbar('Sub-Category created successfully', 'success');
      } else {
        setSubCategories(subCategories.map((p) =>
          p.pkSubCategory === updatedSubCategory.subCategory.pkSubCategory ? updatedSubCategory.subCategory : p 
        ));
        showSnackbar('Sub-Category successfully updated', 'success');
      }

      setOpen(false);
      setCurrentSubCategory(null);
    } catch (error: any) {
      console.error('Error saving Sub-Category: ', error);
      showSnackbar('Error saving Sub-Category ', 'error');
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

  const filteredSubCategories = subCategories.filter((subCategory) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    const nameMatch = subCategory.name.toLowerCase().includes(lowerCaseSearch);

    return nameMatch;
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
              Add New Sub-Category
            </Button>
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
            <SubCategoryTable
              subCategory={filteredSubCategories}
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
              searchQuery={searchQuery}
            />
          )}

          <SubCategoryForm
            open={open}
            isEdit={isEdit}
            onClose={() => setOpen(false)}
            subCategory={currentSubCategory}
            onSave={handleSave}
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

export default SubCategoryPage;