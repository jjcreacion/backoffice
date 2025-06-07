import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TableSortLabel,
    TablePagination,
    Box,
    Button,
} from '@mui/material';
import { Edit, Visibility, Delete} from '@mui/icons-material';
import AddchartIcon from '@mui/icons-material/Addchart';
import { Service } from '../../../../interface/serviceData';
import { visuallyHidden } from '@mui/utils';
import { ChangeEvent, MouseEvent, useState } from 'react';

interface ServiceTableProps {
    services: Service[];
    onEdit: (service: Service) => void;
    onView: (service: Service) => void;
    onService: (service: Service) => void;
    onDelete: (id: number) => void;
    orderBy: string;
    order: 'asc' | 'desc';
    handleSort: (property: string) => void;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    searchQuery: string;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
    services,
    onEdit,
    onView,
    onService,
    onDelete,
    orderBy,
    order,
    handleSort,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    searchQuery,
}) => {
    const createSortHandler = (property: keyof Service) => (event: React.SyntheticEvent) => {
        handleSort(property);
    };

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    const visibleRows = React.useMemo(
        () =>
            services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, services],
    );
    console.log("Servicios: "+services);

    const handleDeleteAction = async () => {
    if (serviceToDelete) {
          try {
            await onDelete(serviceToDelete);
          } catch (error) {
            console.error("Error deleting Service:", error);
          } finally {
            setServiceToDelete(null);
            setConfirmDeleteOpen(false);
          }
        }
      };

    const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setServiceToDelete(null);
    };

    const handleDeleteConfirmation = (id: number) => {
    setServiceToDelete(id);
    setConfirmDeleteOpen(true);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="service table">
                <TableHead>
                    <TableRow>
                        <TableCell sortDirection={orderBy === 'name' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={createSortHandler('name')}
                            >
                                Name
                                {orderBy === 'name' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Sub-Category</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Client Type</TableCell> 
                        <TableCell>Service Type</TableCell> 
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((service) => (
                        <TableRow
                            key={service.pkService}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {service.name}
                            </TableCell>
                            <TableCell>{service.subCategory.name}</TableCell>
                            <TableCell>{service.subCategory.category.name}</TableCell>

                            <TableCell>{service.clientType.pkType !== null ? service.clientType.name : '-'}</TableCell>
                            <TableCell>{service.serviceType.pkType !== null ? service.serviceType.name : '-'}</TableCell>
                            <TableCell>
                                <IconButton aria-label="view" onClick={() => onView(service)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton aria-label="edit" onClick={() => onEdit(service)}>
                                    <Edit />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => handleDeleteConfirmation(service.pkService)}>
                                    <Delete color="error" />
                                </IconButton>
                                <IconButton aria-label="Add" onClick={() => onService(service)}>
                                    <AddchartIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {services.length === 0 && !searchQuery && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No services available.</TableCell>
                        </TableRow>
                    )}
                    {services.length > 0 && filteredServices(services, searchQuery).length === 0 && searchQuery && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No services found matching your search.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={services.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog
            open={confirmDeleteOpen}
            onClose={handleCloseDeleteConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
            <DialogContent>
              {"Are you sure you want to delete this Service?"}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
              <Button onClick={handleDeleteAction} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
    );
};

const filteredServices = (services: Service[], query: string) => {
    if (!query) {
        return services;
    }
    const lowerCaseQuery = query.toLowerCase();
    return services.filter(service =>
        service.name.toLowerCase().includes(lowerCaseQuery) ||
        service.description.toLowerCase().includes(lowerCaseQuery)
    );
};

export default ServiceTable;