export interface Legend {
  color?: string;
  shape?: 'rectangle' | 'circle';
  label?: string;
  value?: number;
  width?: number;
  height?: number;
}

export interface Segment {
  value: number;
  color: string;
  legend?: Legend;
}

export interface DoughnutConfig {
  segments: Segment[];
  showTotal?: boolean;
  color: string;
}
