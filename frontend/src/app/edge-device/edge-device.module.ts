import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdgeDeviceRoutingModule } from './edge-device-routing.module';
import { ChartModule } from '../chart/chart.module';
import { SharedModule } from '../shared/shared.module';
import { EdgeDeviceComponent } from './edge-device.component';
import { EdgeDeviceDetailsComponent } from './edge-device-details/edge-device-details.component';
import { EdgeDeviceModalComponent } from './edge-device-modal/edge-device-modal.component';

@NgModule({
  declarations: [
    EdgeDeviceComponent,
    EdgeDeviceDetailsComponent,
    EdgeDeviceModalComponent
  ],
  imports: [
    CommonModule,
    EdgeDeviceRoutingModule,
    ChartModule,
    SharedModule
  ]
})
export class EdgeDeviceModule { }
