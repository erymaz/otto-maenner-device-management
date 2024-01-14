import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AngularSvgIconModule
  ],
  exports: [
    SidebarComponent,
    TranslateModule
  ]
})
export class CoreModule { }
