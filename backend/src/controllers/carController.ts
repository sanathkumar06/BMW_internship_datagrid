import { Request, Response, NextFunction } from 'express';
import { CarService } from '../services/carServices';

const carService = new CarService();

export class CarController {
  async getAllCarsForClientSide(req: Request, res: Response) {
    try {
      const result = await carService.getAllCars(1, 1000);
      res.json(result.data);
    } catch (error) {
      console.error('Error fetching all cars:', error);
      res.status(500).json({
        message: 'Error fetching cars',
        error: (error as Error).message,
      });
    }
  }

  // Can be used when server side pagination is implemented
  async getAllCars(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(1, parseInt(req.query.pageSize as string) || 10);

      if (pageSize > 1000) {
        return res.status(400).json({
          error: 'Page size cannot exceed 1000',
        });
      }

      const result = await carService.getAllCars(page, pageSize);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchCars(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.query as string)?.trim() || '';
      
      if (!query || query.length === 0) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const result = await carService.searchCars(query);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      next(error);
    }
  }


  async filterCars(req: Request, res: Response, next: NextFunction) {
    try {
      const filtersJson = req.body.filters; 
      
      if (!filtersJson || !Array.isArray(filtersJson)) {
        return res.status(400).json({
          error: 'Invalid filters format. Expected array of filter conditions.',
          example: {
            filters: [
              { field: 'Brand', operator: 'equals', value: 'Tesla' },
              { field: 'PriceEuro', operator: 'greaterThan', value: 50000 },
            ],
          },
        });
      }
      const result = await carService.filterCars(filtersJson);
      res.json({
        data: result,
        total: result.length,
        filters: filtersJson,
      });
    } catch (error) {
      console.error('Filter error:', error);
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }


  async getCarById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid car ID' });
      }

      const car = await carService.getCarById(id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      res.json({ data: car });
    } catch (error) {
      next(error);
    }
  }

  async deleteCar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid car ID' });
      }

      const deleted = await carService.deleteCar(id);
      if (!deleted) {
        return res.status(404).json({
          error: 'Car not found or already deleted',
        });
      }

      res.json({ message: 'Car deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }

  async getMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const metadata = await carService.getColumnMetadata();
      res.json(metadata);
    } catch (error) {
      next(error);
    }
  }
}
