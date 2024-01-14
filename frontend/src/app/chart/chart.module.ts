import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
  Title,
  Chart
} from 'chart.js';

import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';

Chart.register(ArcElement, DoughnutController, Legend, Title, Tooltip);

@NgModule({
  declarations: [
    DoughnutChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DoughnutChartComponent
  ]
})
export class ChartModule { }
