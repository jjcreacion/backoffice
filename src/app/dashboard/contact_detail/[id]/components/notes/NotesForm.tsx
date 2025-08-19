'use client';
import { FormatAlignLeft as FormatAlignLeftIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

interface NotesFormProps {
  colors: {
    noteBg: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  contactId: number;
  onNoteCreated: (noteData: { note: string; isPriority: number }) => void;
}

const NotesForm = React.memo<NotesFormProps>(({ colors, contactId, onNoteCreated }) => {
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
        isPriority: isPriorityNote ? 1 : 0,
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

export default NotesForm;