import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CoreModule } from '../core/core.module';
import { StatusLegendComponent } from './status-legend/status-legend.component';
import { ActionDropdownComponent } from './action-dropdown/action-dropdown.component';
import { ActionSearchComponent } from './action-search/action-search.component';
import { BaseTableComponent } from './base-table/base-table.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';

@NgModule({
  declarations: [
    StatusLegendComponent,
    ActionDropdownComponent,
    ActionSearchComponent,
    BaseTableComponent,
    CheckboxComponent,
    ModalConfirmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AngularSvgIconModule,
    NgbDropdownModule,
    NgSelectModule
  ],
  exports: [
    CoreModule,
    AngularSvgIconModule,
    NgbDropdownModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    StatusLegendComponent,
    ActionDropdownComponent,
    ActionSearchComponent,
    BaseTableComponent,
    CheckboxComponent,
    ModalConfirmComponent
  ]
})
export class SharedModule { }
