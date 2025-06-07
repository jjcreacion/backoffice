'use client'; 

import React, { useEffect, useState}  from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material'; 
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Category } from '../../../interface/category';

interface CategoryFormProps {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ open, isEdit, onClose, category, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [isCategory, setIsCategory] = useState(false);
  
  const initialValues: Category = {
    pkCategory: 0, 
    name: '',
    description: '',
    createdAt: null, 
    updatedAt: null, 
    subCategory: [],
  }
  
  const [formValues, setFormValues] = useState(initialValues);
  
useEffect(() => {
  if (open) {
    formik.resetForm(); 
    formik.setTouched({}); 
    if (category) {
      formik.setValues({ ...initialValues, ...category });
    } else {
      formik.setValues(initialValues); 
    }
  }
}, [open, isEdit, category]);

const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
  setSnackbarOpen(true);
};

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').nullable(),
    description: Yup.string().required('Description is required').nullable(),
   });
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category?.pkCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          autoFocus
          disabled={!isEdit} 
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
        />
         <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            disabled={!isEdit} 
            fullWidth
            multiline 
            rows={3} 
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            InputLabelProps={{ shrink: true }}
          />
        
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

export default CategoryForm;