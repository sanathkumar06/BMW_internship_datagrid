import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  themeQuartz,
  PaginationChangedEvent,
} from 'ag-grid-community';
import { Box, CircularProgress, Paper, Typography, Stack } from '@mui/material';
import { ICar } from '../../types/car';
import ActionsCellRenderer from './ActionsCellRenderer';

interface DataGridComponentProps<T> {
  data: T[];
  columns: ColDef[];
  isLoading: boolean;
  onRowClick: (row: T) => void;
  onDelete: (id: number) => Promise<void>;
  pagination: {
    pageSize: number;
    currentPage: number;
    totalRows: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const DataGridComponent = React.forwardRef<
  AgGridReact,
  DataGridComponentProps<ICar>
>(
  (
    {
      data,
      columns,
      isLoading,
      onRowClick,
      onDelete,
      pagination,
      onPageChange,
      onPageSizeChange,
    },
    ref
  ) => {
    const gridRef = useRef<AgGridReact>(null);

    const columnDefs: ColDef<ICar>[] = [
      ...columns,
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <ActionsCellRenderer
            onView={() => onRowClick(params.data)}
            onDelete={() => onDelete(params.data.id)}
          />
        ),
      },
    ];

    const handlePaginationChanged = (event: PaginationChangedEvent) => {
      const pageSize = event.api.paginationGetPageSize();

      if (onPageSizeChange) {
        onPageSizeChange(pageSize);
      }
    };

    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          No data available
        </Paper>
      );
    }

    return (
      <Stack spacing={2}>
        <Box sx={{ px: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Total Rows: <strong>{pagination.totalRows}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page Size: {pagination.pageSize}
          </Typography>
        </Box>

        <Paper sx={{ height: 600, width: '100%' }}>
          <AgGridReact<ICar>
            ref={gridRef || ref}
            rowData={data}
            columnDefs={columnDefs}
            theme={themeQuartz}
            pagination={true}
            paginationPageSize={pagination.pageSize}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            suppressPaginationPanel={false}
            onPaginationChanged={handlePaginationChanged}

            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: false,
              flex: 1,
              minWidth: 100,
            }}
          />
        </Paper>
      </Stack>
    );
  }
);

DataGridComponent.displayName = 'DataGridComponent';
export default DataGridComponent;
