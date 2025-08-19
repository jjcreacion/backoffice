'use client';
import {
    PriorityHigh as PriorityHighIcon,
    StickyNote2 as StickyNote2Icon,
    Update as UpdateIcon,
} from '@mui/icons-material';
import {
    Box,
    Typography,
} from '@mui/material';
import React from 'react';

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

interface NotesListProps {
  notes: Note[];
  colors: {
    border: string;
    noteBg: string;
    text: string;
    textSecondary: string;
  };
  formatDate: (dateString: string) => string;
}

const NotesList = React.memo<NotesListProps>(({ notes, colors, formatDate }) => {
  if (notes.length === 0) {
    return (
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
    );
  }

  return (
    <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {notes.map((note) => {
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
      })}
    </Box>
  );
});

NotesList.displayName = 'NotesList';

export default NotesList;