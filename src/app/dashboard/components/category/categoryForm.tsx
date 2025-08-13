'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Category } from '../../../interface/category';

interface CategoryFormProps {
  savingData: boolean;
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category, imageFile?: File | null) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ savingData, open, isEdit, onClose, category, onSave }) => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  const initialValues: Category = {
    pkCategory: 0,
    name: '',
    description: '',
    imagePath: '', 
    createdAt: null,
    updatedAt: null,
    subCategory: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').nullable(),
    description: Yup.string().required('Description is required').nullable(),
    imageUrl: Yup.string().nullable().when(['$selectedImageFile', '$categoryImageUrl', '$isEdit'], {
      is: function(selectedFile: File | null, existingUrl: string | null | undefined, isEditing: boolean) {
        return isEditing && !selectedFile && !existingUrl;
      },
      then: (schema) => schema.required('Category image is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  });
  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isEdit && !selectedImageFile && !category?.imagePath) {
        formik.setFieldError('imageUrl', 'Category image is required');
        return;
      }
      onSave(values, selectedImageFile);
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      formik.setTouched({});
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      
      if (category) {
        formik.setValues({ ...initialValues, ...category });
        if (category.imagePath) {
          setImagePreviewUrl(`${baseUrl}:${port}${category.imagePath}`);
        }
      } else {
        formik.setValues(initialValues);
      }
    }
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [open, isEdit, category]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
      formik.setFieldError('imageUrl', '');
      formik.setFieldTouched('imageUrl', false);
    } else {
      setSelectedImageFile(null);
      setImagePreviewUrl(category?.imagePath || null);
      
      if (isEdit && !category?.imagePath) {
        formik.setFieldError('imageUrl', 'Category image is required');
        formik.setFieldTouched('imageUrl', true, false);
      } else {
        formik.setFieldError('imageUrl', '');
        formik.setFieldTouched('imageUrl', false);
      }
    }
  };

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
            value={formik.values.description || ''}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            InputLabelProps={{ shrink: true }}
          />
          
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Category Image
              </Typography>
              {isEdit && (
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-button"
                    type="file"
                    onChange={handleImageChange}
                    onBlur={() => formik.setFieldTouched('imageUrl', true, false)}
                  />
                  <label htmlFor="image-upload-button">
                    <Button variant="outlined" component="span">
                      {imagePreviewUrl ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </label>
                  {selectedImageFile && (
                    <Typography variant="caption" noWrap>
                      {selectedImageFile.name}
                    </Typography>
                  )}
                  {(selectedImageFile || (category && category.imagePath && !selectedImageFile)) && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => {
                        setSelectedImageFile(null);
                        setImagePreviewUrl(null);
                        if (isEdit && !category?.imagePath) {
                          formik.setFieldError('imageUrl', 'Category image is required');
                          formik.setFieldTouched('imageUrl', true, false);
                        } else {
                          formik.setFieldError('imageUrl', '');
                          formik.setFieldTouched('imageUrl', true, false);
                        }
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              )}
              {formik.touched.imagePath && formik.errors.imagePath && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.imagePath}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {(imagePreviewUrl || (category && category.imagePath && !isEdit)) && (
                <Box
                  sx={{
                    mt: { xs: 1, sm: 0 },
                    width: '100px',
                    height: '100px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <img
                    src={imagePreviewUrl || undefined}
                    alt="Category Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            {isEdit && (
              <Button type="submit" variant="contained">
                {savingData ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;