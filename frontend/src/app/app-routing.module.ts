import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultPageComponent } from './default-page/default-page.component';
import { RoleType } from './shared/models/role-types';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'devices', pathMatch: 'full' },
  {
    path: '',
    component: DefaultPageComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        data: { roles: [RoleType.SYSTEM, RoleType.ADMIN, RoleType.USER] },
        path: 'devices',
        loadChildren: () => import('./edge-device/edge-device.module').then((m) => m.EdgeDeviceModule)
      },
      {
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        data: { roles: [RoleType.SYSTEM, RoleType.ADMIN, RoleType.USER] },
        path: 'customers',
        loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
