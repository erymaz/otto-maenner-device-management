export enum ActionType {
  SELECT = 'SELECT',
  SEARCH = 'SEARCH',
  DROPDOWN = 'DROPDOWN',
  DROPDOWN_CHECKABLE = 'DROPDOWN_CHECKABLE',
  TABLE = 'TABLE'
}

export interface Dropdown {
  label?: string;
  toggle: string;
  filtered?: boolean;
  actionItems?: ActionItem[];
  disabled?: boolean;
}

export interface ActionItem {
  type: ActionType;
  action?: string;
  value?: any;
  checkedItems?: any[];
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  dropdown?: Dropdown;
  classes?: any;
}