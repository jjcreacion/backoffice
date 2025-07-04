'use client';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import NotesForm from './NotesForm';
import NotesList from './NotesList';

interface Note {
  pkNote: number | string;
  note: string;
  isPriority: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    person?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface NotesSidebarProps {
  contactId: number;
  initialNotes: Note[];
  colors: {
    sidebarBg: string;
    sidebarBorder: string;
    text: string;
    textSecondary: string;
    noteBg: string;
    border: string;
  };
  formatDate: (dateString: string) => string;
}

const NotesSidebar = React.memo<NotesSidebarProps>(({
  contactId,
  initialNotes,
  colors,
  formatDate,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const port = process.env.NEXT_PUBLIC_PORT;

  // Función para actualizar solo las notas desde el servidor
  const fetchNotesOnly = async () => {
    if (!contactId) return;

    try {
      const response = await axios.get(
        `${baseUrl}:${port}/Contact/findOne/${contactId}`
      );
      
      if (response.data && response.data.notes) {
        const sortedNotes = response.data.notes.sort((a: Note, b: Note) => {
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
    }
  };

  const handleNoteCreated = (newNoteData: { note: string; isPriority: number }) => {
    // Crear la nueva nota con datos temporales para mostrar inmediatamente
    const tempNote: Note = {
      pkNote: `temp-${Date.now()}`,
      note: newNoteData.note,
      isPriority: newNoteData.isPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    setTimeout(() => {
      fetchNotesOnly();
    }, 2000);
  };

  return (
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
          contactId={contactId}
          onNoteCreated={handleNoteCreated}
        />

        {/* Lista de notas */}
        <NotesList
          notes={notes}
          colors={colors}
          formatDate={formatDate}
        />
      </Box>
    </Box>
  );
});

NotesSidebar.displayName = 'NotesSidebar';

export default NotesSidebar;