'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ContactDetail } from '@/app/interface/contactDetail';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from '@mui/material';

// Importar iconos de Material UI
import {
  PhoneIphone as PhoneIphoneIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

import axios from 'axios';

// Importar componentes modularizados
import { NotesSidebar } from './components/notes';
import { TabContainer } from './components/tabs';

// Función helper para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );
};

const ContactDetailPage = () => {
  const params = useParams();
  const contactId = params.id;
  const theme = useTheme();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [notes, setNotes] = useState([]); // Estado separado para las notas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(1); // Property tab por defecto

  // Colores basados en el tema
  const colors = {
    background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
    contentBg: theme.palette.mode === 'light' ? '#f8f9fa' : '#121212',
    text: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
    textSecondary: theme.palette.mode === 'light' ? '#666666' : '#b0b0b0',
    border: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
    noteBg: theme.palette.mode === 'light' ? '#f9f9f9' : '#2d2d2d',
    sidebarBg: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
    sidebarBorder: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
  };

  const fetchContactDetail = async () => {
    if (!contactId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${baseUrl}:${port}/Contact/findOne/${contactId}`
      );
      const data: ContactDetail = response.data;
      setContact(data);

      // Si el contacto trae notas, establecerlas ordenadas
      if (data.notes) {
        const sortedNotes = data.notes.sort((a, b) => {
          // Primero ordenar por prioridad (prioritarias primero)
          const priorityDiff = (b.isPriority || 0) - (a.isPriority || 0);
          if (priorityDiff !== 0) {
            return priorityDiff;
          }
          // Dentro del mismo grupo de prioridad, ordenar por fecha (más antiguas primero)
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setNotes(sortedNotes);
      }
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response) {
        setError(
          `Failed to fetch contact: ${e.response.status} - ${e.response.statusText}`
        );
        console.error('Error fetching contact:', e.response.data);
      } else {
        setError(
          'Failed to fetch contact. Network error or unexpected problem.'
        );
        console.error('Error fetching contact:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetail();
  }, [contactId, baseUrl, port]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!contact) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="warning">Contact not found</Alert>
      </Box>
    );
  }

  // Preparar datos para mostrar
  const fullName = `${contact.person.firstName} ${contact.person.middleName ? contact.person.middleName + ' ' : ''}${contact.person.lastName}`;

  // Filtrar y ordenar elementos activos, poniendo los Primary primero
  const activeEmails = contact.person.emails
    .filter((email) => email.status === 1)
    .sort((a, b) => (b.isPrimary || 0) - (a.isPrimary || 0));

  const activePhones = contact.person.phones
    .filter((phone) => phone.status === 1)
    .sort((a, b) => (b.isPrimary || 0) - (a.isPrimary || 0));

  const activeAddresses = contact.person.addresses
    .filter((address) => address.status === 1)
    .sort((a, b) => (b.isPrimary || 0) - (a.isPrimary || 0));

  return (
    <Box sx={{ backgroundColor: colors.contentBg, minHeight: '100vh' }}>
      <Grid container>
        {/* Columna principal */}
        <Grid item xs={12} lg={9}>
          <Box sx={{ p: 3, backgroundColor: colors.background }}>
            {/* Botones de acción superiores */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  textTransform: 'none',
                  minWidth: 80,
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                Actions
                <ArrowDropDownIcon />
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  textTransform: 'none',
                  minWidth: 80,
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                Skip Tracer
                <ArrowDropDownIcon />
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                Action Plan
              </Button>
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#ff9800',
                    borderColor: '#ff9800',
                    textTransform: 'none',
                    fontSize: '12px',
                  }}
                >
                  + Appointment
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#2196f3',
                    borderColor: '#2196f3',
                    textTransform: 'none',
                    fontSize: '12px',
                  }}
                >
                  + Task
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#4caf50',
                    borderColor: '#4caf50',
                    textTransform: 'none',
                    fontSize: '12px',
                  }}
                >
                  + Follow Up Call
                </Button>
              </Box>
            </Box>

            {/* Información principal del contacto */}
            <Box sx={{ mb: 3 }}>
              {/* Primera fila: Nombre, Teléfonos y Emails alineados horizontalmente */}
              <Grid container spacing={4} sx={{ mb: 3 }}>
                {/* Nombre y Direcciones */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', color: colors.text }}
                    >
                      {fullName}
                    </Typography>
                    <IconButton size="small">
                      <LinkIcon
                        sx={{ fontSize: 20, color: colors.textSecondary }}
                      />
                    </IconButton>
                  </Box>

                  {/* Direcciones */}
                  {activeAddresses.map((address, index) => (
                    <Box
                      key={address.pkAddress}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <LocationIcon
                        sx={{ color: '#4caf50', fontSize: 18, mt: 0.2 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text,
                          fontWeight:
                            address.isPrimary === 1 ? 'bold' : 'normal',
                        }}
                      >
                        {address.address}
                      </Typography>
                    </Box>
                  ))}
                </Grid>

                {/* Teléfonos */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', color: colors.text }}
                    >
                      Phones:
                    </Typography>
                    <IconButton size="small">
                      <AddIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                    </IconButton>
                  </Box>

                  {activePhones.length > 0 ? (
                    activePhones.map((phone) => (
                      <Box
                        key={phone.pkPhone}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PhoneIphoneIcon
                          sx={{ color: '#1976d2', fontSize: 16 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1976d2',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontWeight:
                              phone.isPrimary === 1 ? 'bold' : 'medium',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {phone.phone}
                        </Typography>
                        <PhoneIcon
                          sx={{
                            color: '#4caf50',
                            fontSize: 20,
                            cursor: 'pointer',
                          }}
                        />
                        <MoreVertIcon
                          sx={{
                            fontSize: 16,
                            color: colors.textSecondary,
                            cursor: 'pointer',
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.textSecondary }}
                    >
                      No phones available
                    </Typography>
                  )}

                  {/* Manager en el bloque de teléfonos */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: colors.text }}
                    >
                      Manager:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value="None"
                        displayEmpty
                        sx={{
                          fontSize: '14px',
                          color: colors.text,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.border,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.border,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                          },
                        }}
                      >
                        <MenuItem value="None">None</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                {/* Emails */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', color: colors.text }}
                    >
                      E-mails:
                    </Typography>
                    <IconButton size="small">
                      <AddIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                    </IconButton>
                  </Box>

                  {activeEmails.length > 0 ? (
                    activeEmails.map((email) => (
                      <Box
                        key={email.pkEmail}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1976d2',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontWeight:
                              email.isPrimary === 1 ? 'bold' : 'medium',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {email.email}
                        </Typography>
                        <EmailIcon
                          sx={{
                            color: '#1976d2',
                            fontSize: 16,
                            cursor: 'pointer',
                          }}
                        />
                        <MoreVertIcon
                          sx={{
                            fontSize: 16,
                            color: colors.textSecondary,
                            cursor: 'pointer',
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.textSecondary }}
                    >
                      No emails available
                    </Typography>
                  )}

                  {/* List en el bloque de emails */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: colors.text }}
                    >
                      List:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value="General"
                        displayEmpty
                        sx={{
                          fontSize: '14px',
                          color: colors.text,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.border,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.border,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976d2',
                          },
                        }}
                      >
                        <MenuItem value="General">General</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Groups Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', mb: 2, color: colors.text }}
              >
                Groups:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="Appointment Set"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Auxiliar"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="BDH-MERY"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Dead Lead"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Future Follow Up"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Hot Lead"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#fff3cd' : '#5d4e37',
                    color:
                      theme.palette.mode === 'light' ? '#856404' : '#ffd700',
                  }}
                />
                <Chip
                  label="New Hot lead"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#d1ecf1' : '#2c5aa0',
                    color:
                      theme.palette.mode === 'light' ? '#0c5460' : '#87ceeb',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip
                  label="Not Yet Interested"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Spanish trash"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Trash"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
                <Chip
                  label="Warm Lead"
                  size="small"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
                    color: colors.text,
                  }}
                />
              </Box>
            </Box>

            {/* Tabs */}
            <TabContainer
              contact={contact}
              colors={colors}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Box>
        </Grid>

        {/* Panel lateral de notas */}
        <Grid item xs={12} lg={3}>
          <NotesSidebar
            contactId={Number(contactId)}
            initialNotes={notes}
            colors={colors}
            formatDate={formatDate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactDetailPage;