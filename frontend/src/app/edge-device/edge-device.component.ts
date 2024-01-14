import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cloneDeep } from 'lodash';

import { tableConfig } from './config';
import { DoughnutConfig, NavLink, ActionItem, TableConfig, Legend } from '../shared/models';
import { SidebarService } from '../shared/services/sidebar.service';
import { ApiService } from '../shared/services/api.service';
import { UtilService } from '../shared/services/util.service';
import { ModalConfirmComponent } from '../shared/modal-confirm/modal-confirm.component';
import { EdgeDeviceModalComponent } from './edge-device-modal/edge-device-modal.component';

@Component({
  selector: 'app-edge-device',
  templateUrl: './edge-device.component.html',
  styleUrls: ['./edge-device.component.scss']
})
export class EdgeDeviceComponent implements OnInit {
  activeNavLink!: NavLink | null;
  deviceUpToDate!: DoughnutConfig;
  deviceStatus!: DoughnutConfig;
  totalDevices = 0;
  config!: TableConfig;
  loading = false;
  items: any = [];

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SidebarService,
    private readonly apiService: ApiService,
    private readonly utilService: UtilService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.config = cloneDeep(tableConfig);
    this.activeNavLink = this.sidebarService.findNavLink(this.sidebarService.navLinks, 'devices');
    if (this.activeNavLink) {
      this.sidebarService.emitEvent({ select: { navLink: this.activeNavLink, silent: true } });
    }
    this.totalDevices = 125;
    this.deviceUpToDate = {
      segments: [
        {
          value: 60,
          color: '#00608b',
          legend: {
            label: 'EDGE_DEVICES.ARE_NOT_UP_TO_DATE',
            color: '#00608b',
            value: 60
          }
        },
        {
          value: 65,
          color: '#0091d2',
          legend: {
            label: 'EDGE_DEVICES.ARE_UP_TO_DATE',
            color: '#00608b',
            value: 65
          }
        }
      ],
      showTotal: true,
      color: '#0091d2'
    };
    this.deviceStatus = {
      segments: [
        {
          value: 90,
          color: '#c58415',
          legend: {
            label: 'EDGE_DEVICES.ARE_ONLINE',
            color: '#c58415',
            value: 90
          }
        },
        {
          value: 35,
          color: '#f2a725',
          legend: {
            label: 'EDGE_DEVICES.ARE_OFFLINE',
            color: '#f2a725',
            value: 35
          }
        }
      ],
      showTotal: true,
      color: '#f2a725'
    };
    this.pageData();
  }

  pageData() {
    this.loading = true;
    this.apiService.paginatedDevices().subscribe((data) => {
      this.items = data.map((entry) => {
        return {
          statusLegend: {
            label: entry.online ? 'DEVICE.ONLINE' : 'DEVICE.OFFLINE',
            color: entry.online ? '#33d2c9' : '#8a8a8c',
            width: 8,
            height: 8
          } as Legend,
          ...entry
        };
      });
    }).add(() => this.loading = false);
  }

  onAdd() {
    const modal = this.modalService.open(EdgeDeviceModalComponent, { centered: true, backdrop: 'static' });
    modal.componentInstance.content = {
      title: 'MODALS.DEVICE.ADD_TITLE',
      confirm: 'MODALS.DEVICE.CONFIRM',
      abort: 'MODALS.DEVICE.ABORT'
    };
    modal.result.then((result) => {
      if (result?.action === 'submit') {
        this.apiService.createDevice(result.value).subscribe({
          next: () => this.pageData(),
          error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
        });
      }
    }, () => { });
  }

  onAction(item: ActionItem) {
    switch (item?.action) {
      case 'deleteSelected':
        if (item.checkedItems?.length) {
          const deleteSelectedModal = this.modalService.open(ModalConfirmComponent, { centered: true, backdrop: 'static' });
          deleteSelectedModal.componentInstance.content = {
            title: 'MODALS.DELETE_SELECTED_DEVICES_CONFIRM.TITLE',
            body: 'MODALS.DELETE_SELECTED_DEVICES_CONFIRM.BODY',
            confirm: 'MODALS.DELETE_SELECTED_DEVICES_CONFIRM.CONFIRM',
            abort: 'MODALS.DELETE_SELECTED_DEVICES_CONFIRM.ABORT'
          };
          deleteSelectedModal.result.then((result) => {
          }, () => { });
        }
        break;
      case 'delete':
        if (item.value?.id) {
          const deleteModal = this.modalService.open(ModalConfirmComponent, { centered: true, backdrop: 'static' });
          deleteModal.componentInstance.content = {
            title: 'MODALS.DELETE_DEVICE_CONFIRM.TITLE',
            body: 'MODALS.DELETE_DEVICE_CONFIRM.BODY',
            confirm: 'MODALS.DELETE_DEVICE_CONFIRM.CONFIRM',
            abort: 'MODALS.DELETE_DEVICE_CONFIRM.ABORT'
          };
          deleteModal.result.then((result) => {
            if (result) {
              this.apiService.deleteDevice(item.value.id).subscribe({
                next: () => this.pageData(),
                error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
              });
            }
          }, () => { });
        }
        break;
      case 'edit':
        if (item.value?.id) {
          const editModal = this.modalService.open(EdgeDeviceModalComponent, { centered: true, backdrop: 'static' });
          editModal.componentInstance.deviceRequest = item.value;
          editModal.componentInstance.content = {
            title: 'MODALS.DEVICE.EDIT_TITLE',
            confirm: 'MODALS.DEVICE.SAVE',
            abort: 'MODALS.DEVICE.ABORT',
            delete: 'MODALS.DEVICE.DELETE'
          };
          editModal.result.then((result) => {
            switch (result?.action) {
              case 'submit':
                this.apiService.updateDevice({ id: item.value.id, ...result.value }).subscribe({
                  next: () => this.pageData(),
                  error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
                });
                break;
              case 'delete':
                item.action = 'delete';
                this.onAction(item);
                break;
              default:
                break;
            }
          }, () => { });
        }
        break;
      case 'details':
        if (item.value?.id) {
          this.router.navigate([`/devices/${item.value.id}`]);
        }
        break;
      default:
        break;
    }
  }

}
