'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MobileCampaign } from '../../../../interface/MobileCampaign';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CampaignFormProps {
  savingData: boolean;
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  campaign: MobileCampaign | null;
  onSave: (campaign: MobileCampaign, imageFile?: File | null) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ savingData, open, isEdit, onClose, campaign, onSave }) => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
                  
  const initialValues: MobileCampaign = {
    campaignsId: 0,
    title: '',
    description: '',
    imageUrl: null,
    startDate: null as unknown as Date, 
    endDate: null as unknown as Date, 
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(255, 'Title cannot exceed 255 characters'),
    description: Yup.string().required('Description is required').max(1000, 'Description cannot exceed 1000 characters'),
    startDate: Yup.date()
      .nullable()
      .required('Start date is required')
      .typeError('Invalid date format'),
    endDate: Yup.date()
      .nullable()
      .required('End date is required')
      .typeError('Invalid date format')
      .min(Yup.ref('startDate'), 'End date cannot be before start date'),
    isActive: Yup.boolean().required('Active status is required'),
    imageUrl: Yup.string().nullable().when(['$selectedImageFile', '$campaignImageUrl', '$isEdit'], {
       is: function(selectedFile: File | null, existingUrl: string | null | undefined, isEditing: boolean) {
        return isEditing && !selectedFile && !existingUrl;
      },
      then: (schema) => schema.required('Campaign image is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  });


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
        if (isEdit && !selectedImageFile && !campaign?.imageUrl) {
            formik.setFieldError('imageUrl', 'Campaign image is required');
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

      if (campaign) {
        formik.setValues({
          ...initialValues,
          ...campaign,
          startDate: campaign.startDate ? new Date(campaign.startDate) : null as unknown as Date,
          endDate: campaign.endDate ? new Date(campaign.endDate) : null as unknown as Date,
        });
        if (campaign.imageUrl) {
          setImagePreviewUrl(`${baseUrl}:${port}${campaign.imageUrl}`);
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
  }, [open, isEdit, campaign]); 


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
      setImagePreviewUrl(campaign?.imageUrl || null);

      if (isEdit && !campaign?.imageUrl) { 
          formik.setFieldError('imageUrl', 'Campaign image is required');
          formik.setFieldTouched('imageUrl', true, false); 
      } else {
          formik.setFieldError('imageUrl', ''); 
          formik.setFieldTouched('imageUrl', false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{campaign?.campaignsId ? 'Edit Campaign' : 'Add New Campaign'}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            InputLabelProps={{ shrink: true }}
            disabled={!isEdit && campaign?.campaignsId !== 0}
          />

          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formik.values.description || ''}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            InputLabelProps={{ shrink: true }}
            disabled={!isEdit && campaign?.campaignsId !== 0}
          />

          <Grid container spacing={2} alignItems="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={12} sm={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.startDate || null}
                  onChange={(date: Date | null) => formik.setFieldValue('startDate', date)}
                  slotProps={{
                    textField: {
                      margin: 'dense',
                      fullWidth: true,
                      error: formik.touched.startDate && Boolean(formik.errors.startDate),
                      helperText: formik.touched.startDate && (formik.errors.startDate as string),
                      InputLabelProps: { shrink: true },
                      disabled: !isEdit && campaign?.campaignsId !== 0,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formik.values.endDate || null}
                  onChange={(date: Date | null) => formik.setFieldValue('endDate', date)}
                  slotProps={{
                    textField: {
                      margin: 'dense',
                      fullWidth: true,
                      error: formik.touched.endDate && Boolean(formik.errors.endDate),
                      helperText: formik.touched.endDate && (formik.errors.endDate as string),
                      InputLabelProps: { shrink: true },
                      disabled: !isEdit && campaign?.campaignsId !== 0,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    name="isActive"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'green',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 128, 0, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'green',
                      },
                      '& .MuiSwitch-switchBase': {
                        color: 'red',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 0, 0, 0.08)',
                        },
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: 'red',
                      },
                    }}
                    disabled={!isEdit && campaign?.campaignsId !== 0}
                  />
                }
                label={formik.values.isActive ? 'Active' : 'Inactive'}
                labelPlacement="top"
                sx={{
                  color: formik.values.isActive ? 'green' : 'red',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  alignItems: 'center',
                  ml: { xs: 0, sm: 1 },
                }}
              />
              {formik.touched.isActive && formik.errors.isActive && (
                <Typography color="error" variant="caption">
                  {formik.errors.isActive}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Campaign Image
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
                  {(selectedImageFile || (campaign && campaign.imageUrl && !selectedImageFile)) && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => {
                        setSelectedImageFile(null);
                        setImagePreviewUrl(null);
                        if (isEdit && !campaign?.imageUrl) {
                          formik.setFieldError('imageUrl', 'Campaign image is required');
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
              {formik.touched.imageUrl && formik.errors.imageUrl && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.imageUrl}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {(imagePreviewUrl || (campaign && campaign.imageUrl && !isEdit)) && (
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
                    alt="Campaign Preview"
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

export default CampaignForm;