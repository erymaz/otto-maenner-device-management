import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { DeviceResponse, DoughnutConfig } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services/api.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { EdgeDeviceModalComponent } from '../edge-device-modal/edge-device-modal.component';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-edge-device-details',
  templateUrl: './edge-device-details.component.html',
  styleUrls: ['./edge-device-details.component.scss']
})
export class EdgeDeviceDetailsComponent implements OnInit, OnDestroy {
  device!: DeviceResponse;
  deviceUpToDate!: DoughnutConfig;
  deviceStatus!: DoughnutConfig;
  unsubscribe = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly sidebarService: SidebarService,
    private readonly apiService: ApiService,
    private readonly utilService: UtilService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      if (params.id) {
        this.apiService.deviceById(params.id).subscribe({
          next: (v) => {
            this.device = v;
            const activeNavLink = this.sidebarService.findNavLink(this.sidebarService.navLinks, 'devices');
            if (activeNavLink) {
              this.sidebarService.emitEvent({ select: { navLink: activeNavLink, silent: true } });
            }
            this.deviceUpToDate = {
              segments: [
                {
                  value: 60,
                  color: '#00608b'
                },
                {
                  value: 65,
                  color: '#0091d2'
                }
              ],
              color: '#0091d2'
            };
            this.deviceStatus = {
              segments: [
                {
                  value: 90,
                  color: '#c58415'
                },
                {
                  value: 35,
                  color: '#f2a725'
                }
              ],
              color: '#f2a725'
            };
          },
          error: () => {
            this.onBack();
          }
        });
      } else {
        this.onBack();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getDateFormatted(date: string, format = 'DD.MM.YYYY') {
    return date ? moment(date).format(format) : null;
  }

  onBack() {
    this.router.navigate(['/devices']);
  }

  onEdit() {
    const editModal = this.modalService.open(EdgeDeviceModalComponent, { centered: true, backdrop: 'static' });
    editModal.componentInstance.deviceRequest = this.device;
    editModal.componentInstance.content = {
      title: 'MODALS.DEVICE.EDIT_TITLE',
      confirm: 'MODALS.DEVICE.SAVE',
      abort: 'MODALS.DEVICE.ABORT',
      delete: 'MODALS.DEVICE.DELETE'
    };
    editModal.result.then((result) => {
      switch (result?.action) {
        case 'submit':
          this.apiService.updateDevice({ id: this.device.id, ...result.value }).subscribe({
            next: (v) => this.device = v,
            error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
          });
          break;
        case 'delete':
          this.onDelete();
          break;
        default:
          break;
      }
    }, () => { });
  }

  onDelete() {
    const deleteModal = this.modalService.open(ModalConfirmComponent, { centered: true, backdrop: 'static' });
    deleteModal.componentInstance.content = {
      title: 'MODALS.DELETE_DEVICE_CONFIRM.TITLE',
      body: 'MODALS.DELETE_DEVICE_CONFIRM.BODY',
      confirm: 'MODALS.DELETE_DEVICE_CONFIRM.CONFIRM',
      abort: 'MODALS.DELETE_DEVICE_CONFIRM.ABORT'
    };
    deleteModal.result.then((result) => {
      if (result) {
        this.apiService.deleteDevice(this.device.id).subscribe({
          next: () => this.onBack(),
          error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
        });
      }
    }, () => { });
  }

}
