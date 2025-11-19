export interface ICar {
  id?: number;
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_KmH: number;
  Range_Km: number;
  Efficiency_WhKm: number;
  FastCharge_KmH: number;
  RapidCharge: 'Yes' | 'No' | string;
  PowerTrain: 'AWD' | 'RWD' | 'FWD' | string;
  PlugType: string;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PriceEuro: number;
  Date: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Filter operators for advanced filtering
 */
export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'greaterThan'
  | 'lessThan';

/**
 * IFilter - Represents a single filter condition
 */
export interface IFilter {
  column: keyof ICar;
  operator: FilterOperator;
  value: any;
}
