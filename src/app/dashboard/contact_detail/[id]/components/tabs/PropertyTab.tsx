'use client';
import { ContactDetail } from '@/app/interface/contactDetail';
import { Person as PersonIcon } from '@mui/icons-material';
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';

interface PropertyTabProps {
  contact: ContactDetail;
  colors: {
    text: string;
    textSecondary: string;
  };
}

const PropertyTab = React.memo<PropertyTabProps>(({ contact, colors }) => {
  const fullName = `${contact.person.firstName} ${contact.person.middleName ? contact.person.middleName + ' ' : ''}${contact.person.lastName}`;

  return (
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
  );
});

PropertyTab.displayName = 'PropertyTab';

export default PropertyTab;