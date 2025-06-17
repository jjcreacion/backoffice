"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
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
  Alert
} from '@mui/material';
import axios from 'axios';

interface ContactDetail {
  pkContact: number;
  entry: number;
  isCommercial: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  person: {
    pkPerson: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    emails: {
      pkEmail: number;
      email: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
    phones: {
      pkPhone: number;
      phone: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
    addresses: {
      pkAddress: number;
      address: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

const ContactDetailPage = () => {
  const params = useParams();
  const contactId = params.id;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
  
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactDetail = async () => {
      if (!contactId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Asumiendo que tienes un endpoint para obtener un contacto por ID
        const response = await axios.get(`${baseUrl}:${port}/Contact/findOne/${contactId}`);
        const data: ContactDetail = response.data;
        setContact(data);
      } catch (e: any) {
        if (axios.isAxiosError(e) && e.response) {
          setError(`Failed to fetch contact: ${e.response.status} - ${e.response.statusText}`);
          console.error('Error fetching contact:', e.response.data);
        } else {
          setError('Failed to fetch contact. Network error or unexpected problem.');
          console.error('Error fetching contact:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetail();
  }, [contactId, baseUrl, port]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
  const activeEmails = contact.person.emails.filter(email => email.status === 1);
  const activePhones = contact.person.phones.filter(phone => phone.status === 1);
  const activeAddresses = contact.person.addresses.filter(address => address.status === 1);

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained">Actions</Button>
        <Button variant="contained">Skip Tracer</Button>
        <Button variant="contained">Action Plan</Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* Columna izquierda - Contenido principal */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              {fullName}
            </Typography>

            <Grid container spacing={3}>
              {/* Columna 1: Información básica y Direcciones */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Basic Information:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong> {new Date(contact.person.dateOfBirth).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Entry Type:</strong> {contact.entry === 1 ? 'App Mobile' : `Entry ${contact.entry}`}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Commercial:</strong> {contact.isCommercial === 1 ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {contact.status === 1 ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Addresses:
                  </Typography>
                  {activeAddresses.length > 0 ? (
                    activeAddresses.map((address) => (
                      <Box key={address.pkAddress} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">
                          {address.address} {address.isPrimary === 1 && '(Primary)'}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No addresses available
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Columna 2: Teléfonos con scroll */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Phones:
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {activePhones.length > 0 ? (
                      activePhones.map((phone) => (
                        <ListItem key={phone.pkPhone}>
                          <ListItemText 
                            primary={phone.phone}
                            secondary={phone.isPrimary === 1 ? 'Primary' : ''}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No phones available" />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>

              {/* Columna 3: Emails con scroll */}
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Emails:
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {activeEmails.length > 0 ? (
                      activeEmails.map((email) => (
                        <ListItem key={email.pkEmail}>
                          <ListItemText 
                            primary={email.email}
                            secondary={email.isPrimary === 1 ? 'Primary' : ''}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No emails available" />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Groups Table */}
          <Typography variant="h6" gutterBottom>
            Groups:
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Appointment</TableCell>
                  <TableCell>Chat Lead</TableCell>
                  <TableCell>Date Session</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Future</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Not Lead</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Misc</TableCell>
                  <TableCell>Activities</TableCell>
                  <TableCell>History</TableCell>
                  <TableCell>Emails</TableCell>
                  <TableCell>Action Plans</TableCell>
                  <TableCell>Lead Sheet</TableCell>
                  <TableCell>Attachments</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7}>Checklists</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />
        </Grid>

        {/* Columna derecha - Notas */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Notes:
            </Typography>
            <Typography variant="body1" gutterBottom>
              Contact ID: {contact.pkContact}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(contact.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated: {new Date(contact.updatedAt).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactDetailPage;