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
import { SubCategory } from '../../../../interface/subCategory';
import { visuallyHidden } from '@mui/utils';
import { ChangeEvent, MouseEvent, useState } from 'react';

interface SubCategoryTableProps {
    subCategories: SubCategory[];
    onEdit: (subCategory: SubCategory) => void;
    onView: (subCategory: SubCategory) => void;
    onService: (subCategory: SubCategory) => void;
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

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({
    subCategories,
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
    const createSortHandler = (property: keyof SubCategory) => (event: React.SyntheticEvent) => {
        handleSort(property);
    };

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState<number | null>(null);

    const visibleRows = React.useMemo(
        () =>
            subCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage, subCategories],
    );
 
    const handleDeleteAction = async () => {
    if (subCategoryToDelete) {
          try {
            await onDelete(subCategoryToDelete);
          } catch (error) {
            console.error("Error deleting Service:", error);
          } finally {
            setSubCategoryToDelete(null);
            setConfirmDeleteOpen(false);
          }
        }
      };

    const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setSubCategoryToDelete(null);
    };

    const handleDeleteConfirmation = (id: number) => {
    setSubCategoryToDelete(id);
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
                        <TableCell>Category</TableCell>
                        <TableCell>Client Type</TableCell> 
                        <TableCell>Service Type</TableCell> 
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((subCategory) => (
                        <TableRow
                            key={subCategory.pkSubCategory}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {subCategory.name}
                            </TableCell>
                            <TableCell>{subCategory.category.name}</TableCell>
                            <TableCell>{subCategory.clientType.pkType !== null ? subCategory.clientType.name : '-'}</TableCell>
                            <TableCell>{subCategory.serviceType.pkType !== null ? subCategory.serviceType.name : '-'}</TableCell>
                            <TableCell>
                                <IconButton aria-label="view" onClick={() => onView(subCategory)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton aria-label="edit" onClick={() => onEdit(subCategory)}>
                                    <Edit />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => handleDeleteConfirmation(subCategory.pkSubCategory)}>
                                    <Delete color="error" />
                                </IconButton>
                                <IconButton aria-label="Add" onClick={() => onService(subCategory)}>
                                    <AddchartIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {subCategories.length === 0 && !searchQuery && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No services available.</TableCell>
                        </TableRow>
                    )}
                    {subCategories.length > 0 && filteredServices(subCategories, searchQuery).length === 0 && searchQuery && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No services found matching your search.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={subCategories.length}
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

const filteredServices = (SubCategories: SubCategory[], query: string) => {
    if (!query) {
        return SubCategories;
    }
    const lowerCaseQuery = query.toLowerCase();
    return SubCategories.filter(SubCategory =>
        SubCategory.name.toLowerCase().includes(lowerCaseQuery) ||
        SubCategory.description.toLowerCase().includes(lowerCaseQuery)
    );
};

export default SubCategoryTable;