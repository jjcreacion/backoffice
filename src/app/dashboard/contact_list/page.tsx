"use client";
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid,
  Chip, 
} from '@mui/material';
import Link from 'next/link';
import axios from 'axios';

interface Contact {
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
    phones: any[];
    addresses: any[]; 
  };
}

const FormPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseUrl}:${port}/Contact/findAll`);
        const data: Contact[] = response.data; 
        setContacts(data);
      } catch (e: any) {
        if (axios.isAxiosError(e) && e.response) {
          setError(`Failed to fetch contacts: ${e.response.status} - ${e.response.statusText}`);
          console.error('Error fetching contacts:', e.response.data); 
        } else {
          setError('Failed to fetch contacts. Network error or unexpected problem.');
          console.error('Error fetching contacts:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <Typography>Loading contacts...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained">Actions</Button>
        <Button variant="contained">Skip Tracer</Button>
        <Button variant="contained">Action Plan</Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Entry</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.pkContact}>
                    <TableCell>
                      <Link href={`/dashboard/contact_detail/${contact.pkContact}`}>
                        <Chip
                          label={`${contact.person?.firstName || ''} ${contact.person?.middleName ? `${contact.person?.middleName} ` : ''}${contact.person?.lastName || ''}`}
                          clickable
                          size="small"
                          color="primary" 
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      {contact.person?.emails?.find((email) => email?.isPrimary === 1)?.email || 'No primary email'}
                    </TableCell>
                    <TableCell>
                      {contact.entry === 1 ? (
                        <Chip label="App Mobile" color="primary" size="small" />
                      ) : (
                        contact.entry
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {contact.status === 1 ? (
                        <Chip label="Active" color="secondary" size="small" />
                      ) : (
                        <Chip label="Inactive" color="warning" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormPage;