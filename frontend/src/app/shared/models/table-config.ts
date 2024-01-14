import { ActionItem } from './action-item';

export enum CellType {
  TEXT = 'TEXT',
  DATETIME = 'DATETIME',
  STATUS = 'STATUS',
  BUTTONS = 'BUTTONS'
}

export interface CellButton {
  action: string;
  name?: string;
  icon?: string;
  classes?: any;
}

export interface Cell {
  type: CellType;
  property?: string;
  format?: string;
  sortable?: boolean;
  title?: string;
  buttons?: CellButton[];
  classes?: any;
}

export interface TableConfig {
  actionItems?: ActionItem[],
  checkable?: boolean;
  cells: Cell[];
}