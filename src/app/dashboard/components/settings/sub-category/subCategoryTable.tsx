"use client";
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Button,
} from '@mui/material';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { subCategory } from '../../../../interface/subCategoryData';
import { ChangeEvent, MouseEvent, useState } from 'react';

interface SubCategoryTableProps {
  subCategory: subCategory[];
  onEdit: (subCategory: subCategory) => void;
  onView: (subCategory: subCategory) => void;
  onDelete: (id: number) => Promise<void>; 
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (property: string) => void;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({
  subCategory,
  onView,
  onEdit,
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<number | null>(null);

  const filteredSubCategories = subCategory.filter((subCategory) => {
    const lowerCaseSearch = searchQuery.toLowerCase();
    return subCategory.name.toLowerCase()?.includes(lowerCaseSearch);
  });

  const sortedSubCategories = [...filteredSubCategories].sort((a, b) => {
    const isAsc = orderBy === 'name' && order === 'asc';
    return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  const handleDeleteConfirmation = (id: number) => {
    setSubCategoryToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteAction = async () => {
    if (subCategoryToDelete) {
      try {
        await onDelete(subCategoryToDelete);
      } catch (error) {
        console.error("Error deleting sub-category:", error);
      } finally {
        setSubCategoryToDelete(null);
        setConfirmDeleteOpen(false);
      }
    }
  };
  const paginatedSubCategories = sortedSubCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
    setSubCategoryToDelete(null);
  };
 
  console.log("SubCategory en tabla:", subCategory);
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {['ID', 'Subcategory Name', 'Category Name', 'Actions'].map((header) => (
              <TableCell key={header}>
                {header === 'Actions' ? (
                  'Actions'
                ) : (
                  <TableSortLabel
                    active={orderBy === header.toLowerCase()}
                    direction={order}
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    {header}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedSubCategories.map((subCategory) => (
            <TableRow key={subCategory.pkSubCategory}>
              <TableCell>{subCategory.pkSubCategory}</TableCell> 
              <TableCell>{subCategory.name}</TableCell>
              <TableCell>{subCategory.category?.name}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onView(subCategory)}>
                  <FaEye />
                </IconButton>
                <IconButton color="secondary" onClick={() => onEdit(subCategory)}>
                  <FaEdit style={{ color: 'green' }} />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteConfirmation(subCategory.pkSubCategory)}> 
                  <FaTrash />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredSubCategories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          {"Are you sure you want to delete this SubCategory?"}
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

export default SubCategoryTable;