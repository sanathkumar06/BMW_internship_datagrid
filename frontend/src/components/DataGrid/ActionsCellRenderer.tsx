import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionsCellRendererProps {
  onView: () => void;
  onDelete: () => Promise<void>;
}

/**
 * Renders action buttons (View, Delete) in the AG Grid Actions column.
 * 
 * Props:
 * - onView: Callback function when View button is clicked
 * - onDelete: Async callback function when Delete is confirmed
 */
export const ActionsCellRenderer = ({
  onView,
  onDelete,
} : ActionsCellRendererProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent AG Grid row selection
    setDeleteConfirm(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete();
      setDeleteConfirm(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete car';
      setDeleteError(errorMessage);
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Closes confirmation dialog and resets error state
  const handleCancelDelete = () => {
    setDeleteConfirm(false);
    setDeleteError(null);
  };

  /**
   * Handle view button click
   * Stops event propagation and calls onView callback
   */
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onView();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Tooltip title="View Details" arrow>
          <IconButton
            size="small"
            onClick={handleViewClick}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
              transition: 'all 0.2s ease',
            }}
            aria-label="view-details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Car" arrow>
          <IconButton
            size="small"
            onClick={handleDeleteClick}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
              transition: 'all 0.2s ease',
            }}
            aria-label="delete-car"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={20} />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={deleteConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent id="delete-dialog-description">
          {deleteError ? (
            <Box sx={{ color: 'error.main', mb: 2 }}>
              <strong>Error:</strong> {deleteError}
            </Box>
          ) : (
            <p>Are you sure you want to delete this car? This action cannot be undone.</p>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={isDeleting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            loading={isDeleting}
            variant="contained"
            color="error"
            autoFocus
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionsCellRenderer;