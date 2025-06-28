'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ContactDetail } from '@/app/interface/contactDetail';
import {
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Tabs,
  Tab,
  useTheme,
  Checkbox,
  FormControlLabel,
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
  Map as MapIcon,
  ArrowDropDown as ArrowDropDownIcon,
  NoteAdd as NoteAddIcon,
  StickyNote2 as StickyNote2Icon,
  Person as PersonIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  PriorityHigh as PriorityHighIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

import axios from 'axios';

// Componente separado y memoizado para el formulario de notas
const NotesForm = React.memo(({ colors, contactId, onNoteCreated }) => {
  const [newNote, setNewNote] = useState('');
  const [isPriorityNote, setIsPriorityNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  const handleCancelNote = () => {
    setNewNote('');
    setIsPriorityNote(false);
  };

  const handlePostNote = async () => {
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const noteData = {
        note: newNote.trim(),
        isPriority: isPriorityNote ? 1 : 0,
        fkContact: contactId,
        // fkUser se asigna automáticamente a 42 en el backend si no se especifica
      };

      await axios.post(`${baseUrl}:${port}/person-notes`, noteData);

      // Preparar datos para el componente padre
      const noteDataForParent = {
        note: newNote.trim(),
        isPriority: isPriorityNote ? 1 : 0
      };

      // Limpiar formulario
      setNewNote('');
      setIsPriorityNote(false);

      // Notificar al componente padre con los datos de la nota
      if (onNoteCreated) {
        onNoteCreated(noteDataForParent);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type note here.."
          variant="outlined"
          size="small"
          disabled={isSubmitting}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: colors.noteBg,
              fontSize: '14px',
              paddingLeft: '40px',
              '& fieldset': {
                borderColor: colors.border,
              },
              '&:hover fieldset': {
                borderColor: colors.border,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputBase-input': {
              color: colors.text,
              '&::placeholder': {
                color: colors.textSecondary,
                opacity: 0.8,
              },
            },
          }}
        />
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            color: colors.textSecondary,
          }}
        >
          <FormatAlignLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isPriorityNote}
              onChange={(e) => setIsPriorityNote(e.target.checked)}
              size="small"
              disabled={isSubmitting}
              sx={{
                color: colors.textSecondary,
                '&.Mui-checked': {
                  color: '#1976d2',
                },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{ color: colors.text, fontSize: '13px' }}
            >
              Priority Note
            </Typography>
          }
          sx={{ ml: 0 }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCancelNote}
            disabled={isSubmitting}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 0.5,
              fontSize: '12px',
              color: colors.text,
              borderColor: colors.border,
              textTransform: 'none',
              '&:hover': {
                borderColor: colors.textSecondary,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handlePostNote}
            disabled={!newNote.trim() || isSubmitting}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 0.5,
              fontSize: '12px',
              backgroundColor: '#1976d2',
              color: '#ffffff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&:disabled': {
                backgroundColor: colors.border,
                color: colors.textSecondary,
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={16} /> : 'Post'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
});

NotesForm.displayName = 'NotesForm';

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

  // Función separada para actualizar solo las notas
  const fetchNotesOnly = async () => {
    if (!contactId) return;

    try {
      // Opción 1: Si tienes un endpoint específico para notas
      // const response = await axios.get(`${baseUrl}:${port}/person-notes/contact/${contactId}`);
      
      // Opción 2: Si solo puedes usar el endpoint del contacto, pero sin mostrar loading
      const response = await axios.get(
        `${baseUrl}:${port}/Contact/findOne/${contactId}`
      );
      
      if (response.data && response.data.notes) {
        const sortedNotes = response.data.notes.sort((a, b) => {
          const priorityDiff = (b.isPriority || 0) - (a.isPriority || 0);
          if (priorityDiff !== 0) {
            return priorityDiff;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setNotes(sortedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Si falla la actualización silenciosa, no hacer nada
      // La nota temporal ya está visible para el usuario
    }
  };

  useEffect(() => {
    fetchContactDetail();
  }, [contactId, baseUrl, port]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNoteCreated = (newNoteData) => {
    // Crear la nueva nota con datos temporales para mostrar inmediatamente
    const tempNote = {
      pkNote: `temp-${Date.now()}`, // ID temporal único
      note: newNoteData.note,
      isPriority: newNoteData.isPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Misma fecha que createdAt para notas nuevas
      user: {
        person: {
          firstName: 'You',
          lastName: ''
        }
      }
    };

    // Agregar la nueva nota al estado y reordenar
    setNotes(prevNotes => {
      const newNotes = [...prevNotes, tempNote];
      
      // Reordenar: prioritarias primero, luego por fecha (más antiguas primero)
      return newNotes.sort((a, b) => {
        const priorityDiff = (b.isPriority || 0) - (a.isPriority || 0);
        if (priorityDiff !== 0) {
          return priorityDiff;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });

    // Actualización silenciosa desde el servidor después de 2 segundos
    // Solo actualiza las notas, NO recarga toda la página
    setTimeout(() => {
      fetchNotesOnly();
    }, 2000);
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
            <Box sx={{ mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 'auto',
                    padding: '6px 16px',
                    color: colors.textSecondary,
                  },
                  '& .Mui-selected': {
                    color: '#1976d2 !important',
                  },
                }}
              >
                <Tab label="Misc" value={0} />
                <Tab label="Property" value={1} />
                <Tab label="Activities" value={2} />
                <Tab label="History" value={3} />
                <Tab label="Emails" value={4} />
                <Tab label="Action Plans" value={5} />
                <Tab label="Lead Sheet" value={6} />
                <Tab label="Attachments" value={7} />
              </Tabs>
            </Box>

            {/* Property Content */}
            {activeTab === 1 && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: colors.textSecondary }}
                >
                  <PersonIcon /> {fullName}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', mb: 2, color: colors.text }}
                >
                  Property:
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Occupancy:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            Owner Occupied
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Tax Amount:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            $491
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Bedrooms:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            3 bedrooms
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Property Type:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            Mobile Home
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Square Feet:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            1216.0 sq.ft.
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Sold Amount:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            $0
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Tax Value:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            $59,656
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Tax year:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            2023
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Baths:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            2 baths
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Built:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            2021
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              border: 'none',
                              py: 1,
                              color: colors.text,
                            }}
                          >
                            Acres:
                          </TableCell>
                          <TableCell
                            sx={{ border: 'none', py: 1, color: colors.text }}
                          >
                            0.0
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Panel lateral de notas */}
        <Grid item xs={12} lg={3}>
          <Box
            sx={{
              backgroundColor: colors.sidebarBg,
              minHeight: '100vh',
              borderLeft: `1px solid ${colors.sidebarBorder}`,
            }}
          >
            <Box
              sx={{ p: 2, borderBottom: `1px solid ${colors.sidebarBorder}` }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', mb: 2, color: colors.text }}
              >
                Notes:
              </Typography>

              {/* Formulario Nueva nota */}
              <NotesForm
                colors={colors}
                contactId={Number(contactId)}
                onNoteCreated={handleNoteCreated}
              />

              {/* Historial de notas */}
              <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {notes.length > 0 ? (
                  notes.map((note) => {
                    // Nombre del usuario que creó la nota
                    const userName = note.user?.person
                      ? `${note.user.person.firstName} ${note.user.person.lastName}`.toUpperCase()
                      : 'UNKNOWN USER';

                    const createdDate = formatDate(note.createdAt);
                    
                    // Solo mostrar updatedDate si existe, es diferente a createdAt, y es una fecha válida
                    let updatedDate = null;
                    if (note.updatedAt && 
                        note.updatedAt !== note.createdAt && 
                        new Date(note.updatedAt).getTime() > new Date(1970, 0, 1).getTime()) {
                      updatedDate = formatDate(note.updatedAt);
                    }

                    return (
                      <Box
                        key={note.pkNote}
                        sx={{
                          border: `1px solid ${colors.border}`,
                          borderRadius: 2,
                          p: 2.5,
                          mb: 2,
                          backgroundColor: colors.noteBg,
                          position: 'relative',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition: 'box-shadow 0.2s ease-in-out',
                          },
                        }}
                      >
                        {/* Header con usuario y prioridad */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: '#1976d2',
                              fontSize: '0.875rem',
                            }}
                          >
                            {userName}
                          </Typography>

                          {/* Indicador de prioridad */}
                          {note.isPriority === 1 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                backgroundColor: '#ffebee',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              <PriorityHighIcon
                                sx={{ color: '#f44336', fontSize: 16 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#f44336',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }}
                              >
                                Priority
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Content de la nota */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            color: colors.text,
                            lineHeight: 1.5,
                            fontSize: '0.875rem',
                          }}
                        >
                          {note.note}
                        </Typography>

                        {/* Footer con fechas mejorado */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 1.5,
                            borderTop: `1px solid ${colors.border}`,
                            flexWrap: 'wrap',
                            gap: 1,
                            minWidth: 0,
                          }}
                        >
                          {/* Fecha de creación */}
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.textSecondary,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              flexShrink: 0,
                            }}
                          >
                            {createdDate}
                          </Typography>

                          {/* Fecha de actualización (solo si es válida y diferente) */}
                          {updatedDate && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                flexShrink: 0,
                                minWidth: 'fit-content',
                              }}
                            >
                              <UpdateIcon
                                sx={{
                                  color: colors.textSecondary,
                                  fontSize: 16,
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: colors.textSecondary,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              >
                                {updatedDate}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 2,
                      p: 4,
                      backgroundColor: colors.noteBg,
                      textAlign: 'center',
                    }}
                  >
                    <StickyNote2Icon
                      sx={{ color: colors.textSecondary, fontSize: 48, mb: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: colors.textSecondary }}
                    >
                      No hay notas para este contacto
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactDetailPage;