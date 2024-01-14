import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EdgeDeviceComponent } from './edge-device.component';
import { EdgeDeviceDetailsComponent } from './edge-device-details/edge-device-details.component';

const routes: Routes = [
  { path: '', component: EdgeDeviceComponent },
  { path: ':id', component: EdgeDeviceDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdgeDeviceRoutingModule { }
