export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

export type FilterOperator = 
  | 'contains' 
  | 'equals' 
  | 'startsWith' 
  | 'endsWith' 
  | 'isEmpty' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterThanOrEqual' 
  | 'lessThanOrEqual';
