import { Router } from 'express';
import { CarController } from '../controllers/carController';

export const carRoutes = Router();

const carController = new CarController();

// Get all cars
carRoutes.get('/cars/all', (req, res) => carController.getAllCarsForClientSide(req, res));

// Search cars
carRoutes.get('/cars/search', (req, res, next) => carController.searchCars(req, res, next));

// Filter cars 
carRoutes.post('/cars/filter', (req, res, next) => carController.filterCars(req, res, next));

// Paginated list
carRoutes.get('/cars', (req, res, next) => carController.getAllCars(req, res, next));

// Get by ID
carRoutes.get('/cars/:id', (req, res, next) => carController.getCarById(req, res, next));

// Delete
carRoutes.delete('/cars/:id', (req, res, next) => carController.deleteCar(req, res, next));

export default carRoutes;
