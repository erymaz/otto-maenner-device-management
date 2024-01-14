import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Dropdown, ActionItem, ActionType } from '../models/action-item';

@Component({
  selector: 'app-action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.scss']
})
export class ActionDropdownComponent {
  @Input() dropdown?: Dropdown;
  @Input() filteredActionItem?: ActionItem | null;
  @Output() action = new EventEmitter<ActionItem>();

  onAction(item: ActionItem) {
    if (this.dropdown?.filtered && item.type !== ActionType.SEARCH) {
      if (this.filteredActionItem === item) {
        this.filteredActionItem = null;
        this.action.emit();
        return;
      }
      this.filteredActionItem = item;
    } else if (item.type === ActionType.SEARCH) {
      this.filteredActionItem = item.value?.length ? item : null;
    }
    this.action.emit(item);
  }
}
