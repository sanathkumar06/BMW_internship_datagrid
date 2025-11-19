CREATE DATABASE IF NOT EXISTS cars_db;
USE cars_db;

CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Brand VARCHAR(100) NOT NULL,
  Model VARCHAR(100) NOT NULL,
  AccelSec DECIMAL(5, 1),
  TopSpeed_KmH INT,
  Range_Km INT,
  Efficiency_WhKm INT,
  FastCharge_KmH INT,
  RapidCharge VARCHAR(10),
  PowerTrain VARCHAR(50),
  PlugType VARCHAR(50),
  BodyStyle VARCHAR(50),
  Segment VARCHAR(10),
  Seats INT,
  PriceEuro INT,
  Date VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_brand (Brand),
  INDEX idx_model (Model),
  INDEX idx_price (PriceEuro),
  UNIQUE KEY unique_car (Brand, Model, Date)
);