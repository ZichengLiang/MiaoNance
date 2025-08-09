export interface Note {
  id: string;
  title: string;
  content: string;
  symbol: string; // Which trading pair this note belongs to
  timestamp?: number; // Optional timestamp for chart marks
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCreateInput {
  title: string;
  content: string;
  symbol: string;
  timestamp?: number;
}

export interface NoteUpdateInput {
  title?: string;
  content?: string;
  timestamp?: number;
}

export interface ChartMark {
  time: number | string;
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text?: string;
  size?: number;
}