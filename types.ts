export type Currency = 'HKD' | 'USD' | 'CNY';
export type Scenario = 'Base' | 'Best' | 'Worst';
export type BudgetStatus = 'Draft' | 'Submitted' | 'Approved' | 'Review';

export interface Department {
  id: string;
  name: string;
  head: string;
  status: BudgetStatus;
  totalBudget: number;
  lastYearActuals: number;
}

export interface KPI {
  label: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down' | 'neutral';
  alert?: boolean;
}

export interface CostItem {
  id: string;
  category: 'Staff' | 'Office' | 'IT' | 'Projects' | 'Travel';
  glCode: string;
  description: string;
  type: 'OpEx' | 'CapEx';
  monthlyValues: number[]; // 0-11 for Jan-Dec
  isLocked?: boolean; // For calculated rows
}

export interface WaterfallDataPoint {
  name: string;
  value: number; // The visual height of the bar (absolute delta)
  start: number; // The starting y-position
  isTotal?: boolean;
  fill?: string;
}

// Global Driver State
export interface GlobalDrivers {
  inflationRate: number;
  fxRate: number;
  gdpGrowth: number;
}
