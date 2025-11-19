import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, TextField, Paper, Typography, Box, InputAdornment } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { ICar } from '../types/car';
import { fetchAllCars, searchCarsBackend, filterCarsBackend, deleteCar } from '../services/api';
import { DataGridComponent } from '../components/DataGrid/DataGridComponent';
import { FilterPanel } from '../components/FilterPanel/FilterPanel';
import SearchIcon from '@mui/icons-material/Search';

export const DataGridPage = () => {
  const navigate = useNavigate();

  const [allCars, setAllCars] = useState<ICar[]>([]);
  const [displayedCars, setDisplayedCars] = useState<ICar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);

  const columnDefs: ColDef<ICar>[] = [
    { field: 'Brand', headerName: 'Brand', width: 100 },
    { field: 'Model', headerName: 'Model', width: 150 },
    { field: 'AccelSec', headerName: 'Accel (sec)', width: 100 },
    { field: 'TopSpeed_KmH', headerName: 'Top Speed (km/h)', width: 120 },
    { field: 'Range_Km', headerName: 'Range (km)', width: 100 },
    { field: 'Efficiency_WhKm', headerName: 'Efficiency (Wh/km)', width: 130 },
    { field: 'PriceEuro', headerName: 'Price (€)', width: 100 },
  ];

  // Load all cars on mount
  const loadAllCars = async () => {
    setLoading(true);
    try {
      const cars = await fetchAllCars();
      setAllCars(cars);
      setDisplayedCars(cars);
    } catch (error) {
      setAllCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters from FilterPanel
  const handleApplyFilters = async (filters: any[]) => {
    setLoading(true);
    try {
      if (filters.length === 0) {
        setDisplayedCars(allCars);
        setActiveFilters([]);
      } else {
        const results = await filterCarsBackend(filters);
        setDisplayedCars(results);
        setActiveFilters(filters);
      }
    } catch (error) {
      setDisplayedCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    setLoading(true);

    try {
      if (!query.trim()) {
        setDisplayedCars(allCars);
      } else {
        const results = await searchCarsBackend(query);
        setDisplayedCars(results);
      }
    } catch (error) {
      setDisplayedCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCars();
  }, []);

  const handleRowClick = (car: ICar) => {
    navigate(`/car/${car.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCar(id);
      loadAllCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Generic DataGrid
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {displayedCars.length} cars
            {activeFilters.length > 0 && ` (filtered)`}
          </Typography>
        </Box>

        <FilterPanel onApplyFilters={handleApplyFilters} />

        {/* Search bar*/}
        <Paper sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Quick search..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Grid */}
        <DataGridComponent
          data={displayedCars}
          columns={columnDefs}
          isLoading={loading}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
          pagination={{
            pageSize,
            currentPage: 0,
            totalRows: displayedCars.length,
          }}
          onPageChange={() => {}}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
        />
      </Stack>
    </Container>
  );
};

export default DataGridPage;
