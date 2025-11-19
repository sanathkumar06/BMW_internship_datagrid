// Car data interface
export interface ICar {
  id?: number;
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_KmH: number;
  Range_Km: number;
  Efficiency_WhKm: number;
  FastCharge_KmH: number;
  RapidCharge: 'Yes' | 'No';
  PowerTrain: 'AWD' | 'RWD' | 'FWD';
  PlugType: string;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PriceEuro: number;
  Date: string;
}
