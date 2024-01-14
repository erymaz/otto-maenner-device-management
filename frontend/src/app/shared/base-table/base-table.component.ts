import {
  Component,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
import { get } from 'lodash';
import * as moment from 'moment';

import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ActionItem, ActionType, Cell, CellButton, TableConfig } from '../models';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class BaseTableComponent {
  @Input() config!: TableConfig;
  @Input() items: any[] = [];
  @Input() loading: boolean = false;
  @Output() action = new EventEmitter<ActionItem>();
  @ViewChildren('rowCheckbox') checkboxes!: QueryList<CheckboxComponent>;

  checkedItems: any[] = [];
  allItemsChecked = false;

  get cells() {
    return this.config?.cells;
  }

  getCellData(item: any, cell: Cell) {
    return item && cell?.property ? get(item, cell.property) : null;
  }

  onAllItemChecked() {
    this.checkboxes.forEach((entry) => {
      entry.writeValue(this.allItemsChecked);
      entry.onChange();
    });
  }

  onItemChecked(checked: boolean, item: any) {
    if (!checked) {
      this.allItemsChecked = false;
      this.checkedItems = this.checkedItems?.filter((entry: any) => entry.id !== item?.id) || [];
    } else {
      if (!this.checkedItems?.find((entry: any) => entry.id === item?.id)) {
        this.checkedItems.push(item);
      }
    }
    if (this.config?.actionItems) {
      const actionItems = this.config.actionItems.filter((actionItem) => actionItem.type === ActionType.DROPDOWN_CHECKABLE);
      actionItems?.forEach((actionItem) => {
        if (actionItem.dropdown) {
          actionItem.dropdown.disabled = this.checkedItems?.length ? false : true;
        }
      });
    }
  }

  getDateFormatted(item: any, cell: Cell) {
    return item && cell?.property && cell?.format ? moment(get(item, cell.property)).format(cell.format) : null;
  }

  onAction(item: ActionItem) {
    this.action.emit({ ...item, checkedItems: this.checkedItems });
  }

  onItemCheckClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onRow(item: any) {
    this.action.emit({
      type: ActionType.TABLE,
      action: 'details',
      value: item
    });
  }

  onButton(item: any, btn: CellButton, event: MouseEvent) {
    event.stopPropagation();
    this.action.emit({
      type: ActionType.TABLE,
      action: btn.action,
      value: item
    });
  }
}
