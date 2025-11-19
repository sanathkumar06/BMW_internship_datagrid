import pool from '../databaseConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ICar, IFilter } from '../types/car'
import { FilterCondition } from '../types/filter';


export class CarService {

  /**
   * Fetch all cars with pagination
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of records per page
   */
  async getAllCars(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const connection = await pool.getConnection();

    try {
      const [[countResult]] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM cars'
      );
      const total = (countResult as any).total;
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cars LIMIT ? OFFSET ?',
        [pageSize, offset]
      );

      return {
        data: rows as ICar[],
        total,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error fetching all cars:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Search cars by text query
   * Searches in Brand, Model
   */
  async searchCars(query: string): Promise<ICar[]> {
    const connection = await pool.getConnection();
    try {
      const searchQuery = `%${query}%`;
      
      const [rows] = await connection.query(
        `
        SELECT * FROM cars 
        WHERE 
          Brand LIKE ? OR 
          Model LIKE ? OR 
          PriceEuro LIKE ?
        ORDER BY Brand ASC, Model ASC
        `,
        [searchQuery, searchQuery, searchQuery]
      );

      return rows as ICar[];
    } finally {
      connection.release();
    }
  }


  /**
   * Filter cars by different criteria
   */
  async filterCars(filters: FilterCondition[]): Promise<ICar[]> {
    const connection = await pool.getConnection();
    try {
      if (!filters || filters.length === 0) {
        const [rows] = await connection.query('SELECT * FROM cars');
        return rows as ICar[];
      }

      let whereClause = '';
      const params: (string | number)[] = [];

      filters.forEach((filter, index) => {
        if (index > 0) {
          whereClause += ' AND ';
        }

        const { field, operator, value } = filter;

        switch (operator) {
          case 'contains':
            whereClause += `${field} LIKE ?`;
            params.push(`%${value}%`);
            break;

          case 'equals':
            whereClause += `${field} = ?`;
            params.push(value);
            break;

          case 'startsWith':
            whereClause += `${field} LIKE ?`;
            params.push(`${value}%`);
            break;

          case 'endsWith':
            whereClause += `${field} LIKE ?`;
            params.push(`%${value}`);
            break;

          case 'isEmpty':
            whereClause += `(${field} IS NULL OR ${field} = '')`;
            break;

          case 'greaterThan':
            whereClause += `${field} > ?`;
            params.push(Number(value));
            break;

          case 'lessThan':
            whereClause += `${field} < ?`;
            params.push(Number(value));
            break;

          case 'greaterThanOrEqual':
            whereClause += `${field} >= ?`;
            params.push(Number(value));
            break;

          case 'lessThanOrEqual':
            whereClause += `${field} <= ?`;
            params.push(Number(value));
            break;

          default:
            throw new Error(`Unknown operator: ${operator}`);
        }
      });

      const query = `SELECT * FROM cars WHERE ${whereClause} ORDER BY Brand ASC, Model ASC`;

      const [rows] = await connection.query(query, params);
      return rows as ICar[];
    } finally {
      connection.release();
    }
  }

  /**
   * Get single car by ID
   */
  async getCarById(id: number): Promise<ICar | undefined> {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM cars WHERE id = ?',
        [id]
      );

      return (rows[0] as ICar) || undefined;
    } catch (error) {
      console.error('Error fetching car by ID:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete car by ID
   */
  async deleteCar(id: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM cars WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get column metadata for UI
   */
  async getColumnMetadata() {
    return {
      columns: [
        { name: 'Brand', type: 'string', filterable: true },
        { name: 'Model', type: 'string', filterable: true },
        { name: 'AccelSec', type: 'number', filterable: true },
        { name: 'TopSpeed_KmH', type: 'number', filterable: true },
        { name: 'Range_Km', type: 'number', filterable: true },
        { name: 'Efficiency_WhKm', type: 'number', filterable: true },
        { name: 'FastCharge_KmH', type: 'number', filterable: true },
        { name: 'RapidCharge', type: 'string', filterable: true },
        { name: 'PowerTrain', type: 'string', filterable: true },
        { name: 'PlugType', type: 'string', filterable: true },
        { name: 'BodyStyle', type: 'string', filterable: true },
        { name: 'Segment', type: 'string', filterable: true },
        { name: 'Seats', type: 'number', filterable: true },
        { name: 'PriceEuro', type: 'number', filterable: true },
        { name: 'Date', type: 'string', filterable: true },
      ],
    };
  }
}

export default CarService;
