import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

import { DoughnutConfig } from 'src/app/shared/models/chart-config';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit, AfterViewInit {
  @Input() config!: DoughnutConfig;
  totalKpi!: number;

  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef;
  private doughnutChart!: Chart;

  ngOnInit(): void {
    if (this.config?.segments) {
      this.config.segments.forEach((k) => this.totalKpi = (this.totalKpi || 0) + k.value);
    }
  }

  ngAfterViewInit(): void {
    this.doughnutChart = new Chart(this.doughnutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [''],
        datasets: [
          {
            label: '',
            data: [100],
            backgroundColor: [
              '#e6e6e6'
            ]
          }
        ]
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        cutout: '64%',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
          ,
          tooltip: {
            enabled: false
          }
        }
      }
    });
    this.initData();
  }

  initData() {
    if (this.doughnutChart) {
      const datasets: { label?: string; data: number[]; backgroundColor: string[]; }[] = [];
      if (this.config?.segments) {
        datasets.push({
          data: this.config.segments.map((k) => k.value),
          backgroundColor: this.config.segments.map((k) => k.color)
        });
      }
      this.doughnutChart.data.datasets = datasets;
      this.doughnutChart.update('active');
    }
  }

}
