import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import DataGridPage from './pages/DataGridPage';
import DetailPage from './pages/DetailPage';



function App() {
  return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<DataGridPage />} />
          <Route path="/car/:id" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
  );
}

export default App;
