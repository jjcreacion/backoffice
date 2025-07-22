"use client"

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
import { CampaignTable, CampaignForm } from '../../components/app-mobile/campaigns/index';
import { ChangeEvent, MouseEvent } from 'react';
import PageContent from '../../components/dashboard/pageContent';
import GlassCard from '../../components/dashboard/glassCard';
import { MobileCampaign } from "@interfaces/MobileCampaign";

const CategoryPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MobileCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsedit] = useState(true);
  const [campaign, setCampaign] = useState<MobileCampaign | null>(null);
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
        const response = await fetch(`${baseUrl}:${port}/mobile-campaigns`, {
          headers: {
            'Content-Type': 'application/json', 
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'No message'}`);
        }
        const jsonData = await response.json();
        setCampaigns(jsonData);

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

  const handleEdit = (campaign: MobileCampaign) => {
    setCampaign(campaign);
    setIsedit(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setCampaign(null);
    setIsedit(true);
    setOpen(true);
  };

   const handleView = (campaign: MobileCampaign) => {
    setIsedit(false);
    setCampaign(campaign);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}:${port}/mobile-campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCampaigns(campaigns.filter((campaign) => campaign.campaignsId !== id));
      showSnackbar('Successfully deleted Campaign', 'success');
    } catch (error: any) {
      console.error('Error when deleting Campaign: ', error);
      showSnackbar('Error deleting Campaign', 'error');
    }
  };

const handleSave = async (campaign: MobileCampaign) => {
   /*  try {
    const method = campaign.campaignsId ? 'PATCH' : 'POST';
    const url = `${baseUrl}:${port}/category/`;
    let bodyData;

    if (method === 'POST') {
      bodyData = {
        title: campaign.title,
        description: campaign.description,
      };

     {
        "campaignsId": 1,
        "title": "Oferta Especial de Primavera",
        "description": "Descuentos exclusivos en todos nuestros productos durante el mes de abril.",
        "imageUrl": "https://ejemplo.com/imagenes/primavera.jpg",
        "startDate": "2025-04-01T00:00:00Z",
        "endDate": "2025-04-30T23:59:59Z",
        "isActive": true,
      }
    
    } else {
      bodyData = {
        pkCategory: campaign.campaignsId,
        title: campaign.title,
        description: category.description,
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

    const updatedCategory = await response.json();
    
    if (method === 'POST') {
      setCategories([...categories, updatedCategory]);
      showSnackbar('Category created successfully', 'success');
    } else {
      setCategories(categories.map((p) => (p.pkCategory === updatedCategory.category.pkCategory ? updatedCategory.category : p)));
      showSnackbar('Category successfully updated', 'success');
    }

    setOpen(false);
    setCategory(null);
  } catch (error: any) {
    console.error('Error saving Category: ', error);
    showSnackbar(`Error saving Category: ${error.message}`, 'error');
  }*/
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

  const filteredCampaigns = campaigns.filter((campaign) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    const nameMatch = campaign.title.toLowerCase().includes(lowerCaseSearch);
   
    return nameMatch; 
  });

  const theme = useTheme();

  return (
    <PageContent >
    <GlassCard >
    <Box sx={{ width: '100%', minHeight: 200, overflowY: 'auto', p: 3 }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
         Campaigns
        </Typography>
        <Button variant="contained" onClick={() => handleCreate()}>
         Add New Campaign
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
        <CampaignTable
        campaigns={filteredCampaigns}
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

     {/* <CategoryForm open={open} isEdit={isEdit} onClose={() => setOpen(false)} category={category} onSave={handleSave} /> */}

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