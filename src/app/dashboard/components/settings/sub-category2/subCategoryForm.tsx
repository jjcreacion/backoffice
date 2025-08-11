'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { subCategory } from '../../../../interface/subCategoryData';
import { Category } from '../../../../interface/category';

interface SubCategoryFormProps {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  subCategory: subCategory | null;
  onSave: (subCategoryData: any) => void;
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ open, isEdit, onClose, subCategory, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  const initialValues = {
    name: '',
    description: '',
    fkCategory: '',
  };

  const formik = useFormik({
    initialValues: subCategory || initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').nullable(),
      fkCategory: Yup.string().required('Category is required').nullable(),
      description: Yup.string().nullable(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        pkSubCategory: subCategory?.pkSubCategory || 0, 
        name: values.name,
        description: values.description,
        fkCategory: parseInt(values.fkCategory, 10), 
      };
      onSave(payload);
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
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
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCategories();
      formik.resetForm();
    }
  }, [open, baseUrl, port, formik.resetForm]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{subCategory?.pkSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            InputLabelProps={{ shrink: true }}
            disabled={!isEdit}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline 
            rows={3} 
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            InputLabelProps={{ shrink: true }}
            disabled={!isEdit}
          />
          <FormControl fullWidth margin="dense" error={formik.touched.fkCategory && Boolean(formik.errors.fkCategory)}>
            <InputLabel id="fkCategory-label">Category</InputLabel>
            <Select
              labelId="fkCategory-label"
              id="fkCategory"
              name="fkCategory"
              value={formik.values.fkCategory}
              label="Category"
              onChange={formik.handleChange}
              disabled={!isEdit}
            >
              {loading ? (
                <MenuItem value="">Loading categories...</MenuItem>
              ) : error ? (
                <MenuItem value="">Error loading categories</MenuItem>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.pkCategory} value={category.pkCategory}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No categories available</MenuItem>
              )}
            </Select>
            {formik.touched.fkCategory && formik.errors.fkCategory && (
              <FormHelperText>{formik.errors.fkCategory}</FormHelperText>
            )}
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

export default SubCategoryForm;