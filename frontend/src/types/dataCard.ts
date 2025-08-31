export interface DataCard {
  id: string;
  title: string;
  symbol?: string; // e.g., 'BTCUSDT'
  timeframe?: string; // e.g., '1h', '4h', '1d'
  useGlobalTimeframe?: boolean; // Whether to use global timeframe or individual
  data?: Array<{ time: string | number; value: number }>; // Chart data
  createdAt: Date;
  updatedAt: Date;
}

export interface DataCardCreateInput {
  title: string;
  symbol?: string;
  timeframe?: string;
  useGlobalTimeframe?: boolean;
}

export interface DataCardUpdateInput {
  title?: string;
  chartType?: 'area' | 'candlestick' | 'line';
  symbol?: string;
  timeframe?: string;
  useGlobalTimeframe?: boolean;
}

export const TIMEFRAMES = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
] as const;