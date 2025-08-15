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
  useTheme
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { CategoryTable, CategoryForm } from '../../components/category';
import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';
import { Category } from "@interfaces/category";
import { json } from 'stream/consumers';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
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
  const UPLOAD_IMAGE_ENDPOINT = `${baseUrl}:${port}/category/upload-image`; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}:${port}/category/findAll`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'No message'}`);
        }
        const jsonData = await response.json();
        setCategories(jsonData);

      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
        showSnackbar(`Error loading Category: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

   
  const handleEdit = (category: Category) => {
    setCategory(category);
    setIsedit(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setCategory(null);
    setIsedit(true);
    setOpen(true);
  };

  const handleView = (category: Category) => {
    setIsedit(false);
    setCategory(category);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}:${port}/category/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCategories(categories.filter((category) => category.pkCategory !== id));
      showSnackbar('Successfully deleted Category', 'success');
    } catch (error: any) {
      console.error('Error when deleting Category: ', error);
      showSnackbar('Error deleting Category', 'error');
    }
  };

  const handleSave = async (categoryData: Category, imageFile?: File | null) => { 
    setSavingData(true);
    try {
      const method = categoryData.pkCategory ? 'PATCH' : 'POST';
      const url = `${baseUrl}:${port}/category/`;
      let bodyData;

      if (method === 'POST') {
        bodyData = {
          name: categoryData.name,
          description: categoryData.description,
        //  imageUrl: categoryData.imagePath || null, 
        };
      } else {
        bodyData = {
          pkCategory: categoryData.pkCategory,
          name: categoryData.name,
          description: categoryData.description,
         // imageUrl: categoryData.imagePath , 
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'No message'}`);
      }

      const savedCategory = await response.json();

      let finalCategory = savedCategory;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch(`${UPLOAD_IMAGE_ENDPOINT}/${savedCategory.pkCategory}`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Error al subir la imagen para la categoría ${savedCategory.pkCategory}:`, errorText);
          showSnackbar(`Categoría guardada, pero la subida de imagen falló: ${errorText}`, 'warning');
        } else {
          const uploadedImageData = await uploadResponse.json();
          finalCategory = { ...savedCategory, imageUrl: uploadedImageData.imageUrl || savedCategory.imageUrl };
          showSnackbar('Imagen subida exitosamente!', 'success');
        }
      }

      if (method === 'POST') {
        setCategories([...categories, finalCategory]);
        showSnackbar('Category created successfully', 'success');
      } else {
        setCategories(categories.map((p) => (p.pkCategory === finalCategory.pkCategory ? finalCategory : p)));
        showSnackbar('Category successfully updated', 'success');
      }

      setOpen(false);
      setCategory(null);
    } catch (error: any) {
      console.error('Error saving Category: ', error);
      showSnackbar(`Error saving Category: ${error.message}`, 'error');
    } finally {
      setSavingData(false);
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

  const filteredCategories = categories.filter((category) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    const nameMatch = category.name.toLowerCase().includes(lowerCaseSearch);

    return nameMatch;
  });

  const theme = useTheme();

  return (
    <PageContent>
      <GlassCard>
        <Box sx={{ width: '100%', minHeight: 200, overflowY: 'auto', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Categories
            </Typography>
            <Button variant="contained" onClick={() => handleCreate()}>
              Add New Category
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
            <CategoryTable
              categories={filteredCategories}
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

          <CategoryForm
            savingData={savingData}
            open={open}
            isEdit={isEdit}
            onClose={() => setOpen(false)}
            category={category}
            onSave={handleSave}
          />

          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: 'auto', minWidth: 300, fontSize: '1.2rem', padding: '1rem' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </GlassCard>
    </PageContent>
  );
};

export default CategoryPage;