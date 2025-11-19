import React, { useState } from 'react';
import {
  Paper,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


interface FilterCondition {
  field: string;
  operator: string;
  value: string | number;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterCondition[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterCondition[]>([
    { field: 'Brand', operator: 'contains', value: '' },
  ]);

  const fields = [
    'Brand',
    'Model',
    'PriceEuro',
    'Range_Km',
    'TopSpeed_KmH',
    'AccelSec',
    'Efficiency_WhKm',
  ];

  const operators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
  ];

  const handleFilterChange = (index: number, key: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [key]: value };
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: 'Brand', operator: 'contains', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    const validFilters = filters.filter(f => {
      if (f.operator === 'isEmpty') return true;
      return f.value !== '';
    });
    onApplyFilters(validFilters);
  };

  const handleClear = () => {
    setFilters([{ field: 'Brand', operator: 'contains', value: '' }]);
    onApplyFilters([]);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <FilterAltIcon /> Advanced Filters
      </Typography>

      <Stack spacing={2}>
        {filters.map((filter, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select
              value={filter.field}
              onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {fields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>

            {/* Operator selector */}
            <Select
              value={filter.operator}
              onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {operators.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>

            {/* Value input */}
            {filter.operator !== 'isEmpty' && (
              <TextField
                value={filter.value}
                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                placeholder="Enter value"
                type={
                  ['greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'].includes(
                    filter.operator
                  )
                    ? 'number'
                    : 'text'
                }
                sx={{ flex: 1 }}
              />
            )}

            {/* Remove button */}
            {filters.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveFilter(index)}
              >
                Remove
              </Button>
            )}
          </Box>
        ))}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button variant="outlined" onClick={handleAddFilter}>
            Add Filter
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FilterPanel;
