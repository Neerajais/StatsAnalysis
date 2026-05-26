export interface DashboardData {
  Account: string;
  Email: string;
  ES: string;
  Stage: string;
  Status: string;
  Owner: string;
  Source: string;
  Geography: string;
  [key: string]: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ESCount {
  name: string;
  value: number;
  percentage: number;
}

export interface StatusCount {
  name: string;
  value: number;
  percentage: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage: number;
}

/**
 * Validates CSV structure - checks for required columns
 */
export function validateCSVStructure(data: any[]): ValidationResult {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push('CSV file is empty');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  const headers = Object.keys(firstRow || {});

  // Check for required columns (case-insensitive)
  const requiredColumns = ['ES', 'Status', 'Owner'];
  const headerLower = headers.map(h => h.toLowerCase());

  for (const col of requiredColumns) {
    if (!headerLower.includes(col.toLowerCase())) {
      errors.push(`Missing required column: "${col}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extracts unique owner values from data
 */
export function getUniqueOwners(data: DashboardData[]): string[] {
  const owners = new Set<string>();
  data.forEach(row => {
    if (row.Owner && row.Owner.trim()) {
      owners.add(row.Owner.trim());
    }
  });
  return Array.from(owners).sort();
}

/**
 * Filters data by selected owners
 */
export function filterDataByOwners(
  data: DashboardData[],
  owners: Set<string> | null
): DashboardData[] {
  if (!owners || owners.size === 0) {
    return data;
  }
  return data.filter(row => owners.has(row.Owner?.trim()));
}

/**
 * Calculate ES counts and percentages
 */
export function calculateESCounts(data: DashboardData[]): ESCount[] {
  const counts: Record<string, number> = {};

  data.forEach(row => {
    const es = row.ES?.trim();
    if (es) {
      counts[es] = (counts[es] || 0) + 1;
    }
  });

  const total = data.length || 1;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 10000) / 100,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate Status counts and percentages
 */
export function calculateStatusCounts(data: DashboardData[]): StatusCount[] {
  const counts: Record<string, number> = {};

  data.forEach(row => {
    const status = row.Status?.trim();
    if (status) {
      counts[status] = (counts[status] || 0) + 1;
    }
  });

  const total = data.length || 1;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 10000) / 100,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Prepare ES data for doughnut chart
 */
export function prepareESChartData(counts: ESCount[]) {
  return counts.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
  }));
}

/**
 * Prepare Status data for bar chart
 */
export function prepareStatusChartData(counts: StatusCount[]) {
  return counts.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
  }));
}

/**
 * Parse CSV data using PapaParse
 */
export function parseCSVData(csvContent: string): Promise<DashboardData[]> {
  return new Promise((resolve, reject) => {
    // Dynamic import to avoid server-side issues
    import('papaparse').then(({ default: Papa }) => {
      try {
        const results = Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          transformHeader: (h: string) => h.trim(),
          transform: (value: string) => value?.trim() || '',
        });

        if (results.errors && results.errors.length > 0) {
          reject(new Error('Error parsing CSV: ' + results.errors[0].message));
          return;
        }

        const data = results.data as DashboardData[];
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Get color for chart values
 */
export const CHART_COLORS = [
  '#3b82f6', // Blue - chart-1
  '#f97316', // Orange - chart-2
  '#10b981', // Green - chart-3
  '#8b5cf6', // Purple - chart-4
  '#06b6d4', // Cyan - chart-5
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
