import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchCarById } from '../services/api';
import { ICar } from '../types/car';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();

  useEffect(() => {
    const loadCar = async () => {
      if (!id) {
        setError('Invalid car ID');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCarById(parseInt(id));
        setCar(data);
      } catch (err) {
        setError('Failed to load car details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading car details...
        </Typography>
      </Container>
    );
  }

  if (error || !car) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Car not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to DataGrid
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 4,
            ml: 0.75,
            mt: 3,
            color: theme.customColors.blueButton,
            fontSize: '1.1rem',
            textTransform: 'none',
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          Back to DataGrid
        </Button>

        {/* Main Card */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0 8px 32px rgba(100, 121, 163, 0.1)',
          }}
        >
          {/* Blue Header Banner */}
          <Box
            sx={{
              background: theme.customColors.headerGradientStart,
              color: theme.palette.background.paper,
              p: { xs: 3, md: '40px 44px 30px 44px' },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  fontSize: { xs: '1.75rem', md: '2.3rem' },
                  lineHeight: 1.2,
                  letterSpacing: 0,
                }}
              >
                {car.Brand} {car.Model}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '24px',
                  px: 2.25,
                  py: 0.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                {car.Segment} Segment
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 0,
                  letterSpacing: 1.4,
                  fontSize: '1rem',
                  color: theme.palette.secondary.contrastText,
                  fontWeight: 500,
                }}
              >
                PRICE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.6rem' },
                  mt: 0,
                  mb: 0.5,
                }}
              >
                €{car.PriceEuro.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Two Column Layout - Flexible */}
          <Box sx={{ p: { xs: 2.25, md: '38px 38px 8px 38px' } }}>
            <Box
              sx={{
                display: 'flex',
                gap: 5,
                justifyContent: 'center',
                mb: 2.5,
                flexWrap: 'wrap',
              }}
            >
              {/* Performance Section */}
              <Paper
                variant="outlined"
                sx={{
                  p: '28px 32px 20px 32px',
                  backgroundColor: theme.customColors.cardBackground,
                  borderRadius: '14px',
                  border: `1px solid ${theme.customColors.cardBorder}`,
                  flex: '1 1 45%',
                  minWidth: { xs: '100%', md: '340px' },
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.625,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.35rem',
                  }}
                >
                  Performance
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Acceleration (0-100)
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.AccelSec}s
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Top Speed
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.TopSpeed_KmH} km/h
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Range
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.Range_Km} km
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Efficiency
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.Efficiency_WhKm} Wh/km
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Specifications Section */}
              <Paper
                variant="outlined"
                sx={{
                  p: '28px 32px 20px 32px',
                  backgroundColor: theme.customColors.cardBackground,
                  borderRadius: '14px',
                  border: `1px solid ${theme.customColors.cardBorder}`,
                  flex: '1 1 45%',
                  minWidth: { xs: '100%', md: '340px' },
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.625,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '1.35rem',
                  }}
                >
                  Specifications
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Body Style
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.BodyStyle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Seats
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.Seats}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Powertrain
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.PowerTrain}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Fast Charge
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.FastCharge_KmH} km/h
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.text.secondary, fontSize: '1.08rem' }}
                    >
                      Plug Type
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '1.16rem' }}
                    >
                      {car.PlugType}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DetailPage;
