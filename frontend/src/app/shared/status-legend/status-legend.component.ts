import { Component, Input } from '@angular/core';

import { Legend } from '../models/chart-config';

@Component({
  selector: 'app-status-legend',
  templateUrl: './status-legend.component.html',
  styleUrls: ['./status-legend.component.scss']
})
export class StatusLegendComponent {
  @Input() legend?: Legend;
}
