import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { ChartModule } from '../chart/chart.module';
import { SharedModule } from '../shared/shared.module';
import { CustomerComponent } from './customer.component';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerModalComponent,
    CustomerDetailsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ChartModule,
    SharedModule
  ]
})
export class CustomerModule { }
