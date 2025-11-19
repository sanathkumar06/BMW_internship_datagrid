import fs from 'fs';
import path from 'path';
import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';
import csv from 'csv-parser';

dotenv.config();

/**
 * Initialize database - creates database and tables
 */
export async function initializeDatabase(): Promise<void> {
  let connection: Connection | undefined;

  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('Connected to MySQL server...');

    // Read SQL file
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute SQL
    await connection.query(schema);
    console.log('Database and tables created successfully');

    // Test connection to the new database
    await connection.query(`USE ${process.env.DB_NAME || 'cars_db'}`);

    // Check if table exists
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables created:', tables);

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Load CSV data into database
 */
export async function loadCsvData(): Promise<void> {
  let connection: Connection | undefined;

  try {
    // Connect to MySQL database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cars_db',
    });

    console.log('Connected to database');

    const csvPath = path.join(
      __dirname,
      '../../database/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv'
    );

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const cars: any[] = [];

    // Parse CSV file
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row: any) => {
          const car = {
            Brand: row.Brand?.trim() || null,
            Model: row.Model?.trim() || null,
            AccelSec: parseFloat(row.AccelSec) || null,
            TopSpeed_KmH: parseInt(row.TopSpeed_KmH) || null,
            Range_Km: parseInt(row.Range_Km) || null,
            Efficiency_WhKm: parseInt(row.Efficiency_WhKm) || null,
            FastCharge_KmH: parseInt(row.FastCharge_KmH) || null,
            RapidCharge: row.RapidCharge?.trim() || null,
            PowerTrain: row.PowerTrain?.trim() || null,
            PlugType: row.PlugType?.trim() || null,
            BodyStyle: row.BodyStyle?.trim() || null,
            Segment: row.Segment?.trim() || null,
            Seats: parseInt(row.Seats) || null,
            PriceEuro: parseInt(row.PriceEuro) || null,
            Date: row.Date?.trim() || null,
          };
          cars.push(car);
        })
        .on('end', async () => {
          try {
            console.log(`Read ${cars.length} cars from CSV file`);

            const insertQuery = `
              INSERT INTO cars (
                Brand, Model, AccelSec, TopSpeed_KmH, Range_Km, 
                Efficiency_WhKm, FastCharge_KmH, RapidCharge, PowerTrain, 
                PlugType, BodyStyle, Segment, Seats, PriceEuro, Date
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
                AccelSec = VALUES(AccelSec),
                TopSpeed_KmH = VALUES(TopSpeed_KmH),
                Range_Km = VALUES(Range_Km),
                Efficiency_WhKm = VALUES(Efficiency_WhKm),
                FastCharge_KmH = VALUES(FastCharge_KmH),
                RapidCharge = VALUES(RapidCharge),
                PowerTrain = VALUES(PowerTrain),
                PlugType = VALUES(PlugType),
                BodyStyle = VALUES(BodyStyle),
                Segment = VALUES(Segment),
                Seats = VALUES(Seats),
                PriceEuro = VALUES(PriceEuro)
            `;

            let insertedCount = 0;
            let updatedCount = 0;

            for (const car of cars) {
              try {
                const [result]: any = await connection!.query(insertQuery, [
                  car.Brand,
                  car.Model,
                  car.AccelSec,
                  car.TopSpeed_KmH,
                  car.Range_Km,
                  car.Efficiency_WhKm,
                  car.FastCharge_KmH,
                  car.RapidCharge,
                  car.PowerTrain,
                  car.PlugType,
                  car.BodyStyle,
                  car.Segment,
                  car.Seats,
                  car.PriceEuro,
                  car.Date,
                ]);

                // Check if record was inserted or updated
                if (result.affectedRows === 1 && result.insertId) {
                  insertedCount++;
                } else if (result.affectedRows === 2) {
                  updatedCount++;
                }
              } catch (error) {
                console.error(
                  `Error inserting car: ${car.Brand} ${car.Model}`,
                  error
                );
              }
            }

            console.log(`Inserted ${insertedCount} new cars`);
            console.log(`Updated ${updatedCount} existing cars`);

            // Verify data was inserted
            const [countResult]: any = await connection!.query(
              'SELECT COUNT(*) as total FROM cars'
            );
            console.log(`Total cars in database: ${countResult[0].total}`);

            if (connection) await connection.end();
            resolve();
          } catch (error) {
            console.error('Error inserting data:', error);
            if (connection) await connection.end();
            reject(error);
          }
        })
        .on('error', (error: Error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('CSV import failed:', error);
    if (connection) await connection.end();
    throw error;
  }
}

/**
 * Initialize database AND load CSV data
 */
export async function initializeDatabaseWithData(): Promise<void> {
  try {
    console.log('Starting database initialization...');

    // Create database and tables
    console.log('Creating database and tables...');
    await initializeDatabase();
    console.log();

    // Load CSV data
    console.log('Loading CSV data...');
    await loadCsvData();

    console.log('Database is ready...');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--init-only')) {
    initializeDatabase()
      .then(() => {
        console.log('Database initialization complete');
        process.exit(0);
      })
      .catch((error: Error) => {
        console.error('Database initialization failed:', error);
        process.exit(1);
      });
  } else if (args.includes('--load-csv')) {
    loadCsvData()
      .then(() => {
        console.log('CSV data loaded successfully');
        process.exit(0);
      })
      .catch((error: Error) => {
        console.error('CSV loading failed:', error);
        process.exit(1);
      });
  } else {
    initializeDatabaseWithData()
      .then(() => {
        process.exit(0);
      })
      .catch((error: Error) => {
        console.error('Setup failed:', error);
        process.exit(1);
      });
  }
}

export default {
  initializeDatabase,
  loadCsvData,
  initializeDatabaseWithData,
};
