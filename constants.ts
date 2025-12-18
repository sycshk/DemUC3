import { Department, CostItem, GlobalDrivers, WaterfallDataPoint } from './types';

export const COLORS = {
  swire: '#002D62',
  coke: '#F40009',
  success: '#008751',
  grey: '#94A3B8',
  lightBlue: '#E6F0FF',
};

export const INITIAL_DRIVERS: GlobalDrivers = {
  inflationRate: 2.5,
  fxRate: 7.8, // USD to HKD default
  gdpGrowth: 3.0,
};

export const DEPARTMENTS: Department[] = [
  { id: '1', name: 'Human Resources', head: 'Alice Wong', status: 'Submitted', totalBudget: 2500000, lastYearActuals: 2300000 },
  { id: '2', name: 'Information Technology', head: 'David Chen', status: 'Draft', totalBudget: 4200000, lastYearActuals: 3800000 },
  { id: '3', name: 'Marketing', head: 'Sarah Lee', status: 'Review', totalBudget: 1800000, lastYearActuals: 1900000 },
  { id: '4', name: 'Supply Chain', head: 'Mike Ross', status: 'Approved', totalBudget: 3500000, lastYearActuals: 3200000 },
  { id: '5', name: 'Finance Centre', head: 'Jessica Su', status: 'Draft', totalBudget: 1200000, lastYearActuals: 1100000 },
];

export const INITIAL_COST_ITEMS: CostItem[] = [
  {
    id: 'c1',
    category: 'Staff',
    glCode: '500100',
    description: 'Base Salaries',
    type: 'OpEx',
    monthlyValues: Array(12).fill(150000),
    isLocked: true, // Driven by headcount
  },
  {
    id: 'c2',
    category: 'Staff',
    glCode: '500200',
    description: 'Health Insurance',
    type: 'OpEx',
    monthlyValues: Array(12).fill(12000),
    isLocked: true, 
  },
  {
    id: 'c3',
    category: 'Office',
    glCode: '600100',
    description: 'Office Rental (HQ)',
    type: 'OpEx',
    monthlyValues: Array(12).fill(45000),
    isLocked: false,
  },
  {
    id: 'c4',
    category: 'IT',
    glCode: '700500',
    description: 'Server Upgrades',
    type: 'CapEx',
    monthlyValues: [0, 0, 50000, 0, 0, 0, 50000, 0, 0, 0, 0, 0],
    isLocked: false,
  },
  {
    id: 'c5',
    category: 'Travel',
    glCode: '650100',
    description: 'Regional Visits',
    type: 'OpEx',
    monthlyValues: Array(12).fill(5000),
    isLocked: false,
  },
];

// Data for Waterfall Chart (Bridge)
// Start: 10M, Inflation: +0.5, Projects: +1.5, Headcount: +1.0, Savings: -0.5, End: 12.5
export const WATERFALL_DATA: WaterfallDataPoint[] = [
  { name: '2024 Actuals', value: 10.0, start: 0, isTotal: true, fill: COLORS.grey },
  { name: 'Inflation', value: 0.5, start: 10.0, fill: COLORS.coke }, // Using red to show cost increase (negative impact on profit, but here represents budget increase) - typically budget increase is neutral or specific color. Let's use Swire Blue for neutral increments.
  { name: 'New Projects', value: 1.5, start: 10.5, fill: COLORS.swire },
  { name: 'Headcount', value: 1.0, start: 12.0, fill: COLORS.swire },
  { name: 'Savings', value: 0.5, start: 12.5, fill: COLORS.success }, // Green for savings (drops the budget need)
  { name: '2025 Budget', value: 12.5, start: 0, isTotal: true, fill: COLORS.swire },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
