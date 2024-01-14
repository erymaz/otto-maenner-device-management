import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cloneDeep } from 'lodash';

import { tableConfig } from './config';
import { NavLink, DoughnutConfig, ActionItem, TableConfig } from '../shared/models';
import { SidebarService } from '../shared/services/sidebar.service';
import { ApiService } from '../shared/services/api.service';
import { UtilService } from '../shared/services/util.service';
import { ModalConfirmComponent } from '../shared/modal-confirm/modal-confirm.component';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  activeNavLink!: NavLink | null;
  deviceUpToDate!: DoughnutConfig;
  deviceStatus!: DoughnutConfig;
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
    this.activeNavLink = this.sidebarService.findNavLink(this.sidebarService.navLinks, 'customers');
    if (this.activeNavLink) {
      this.sidebarService.emitEvent({ select: { navLink: this.activeNavLink, silent: true } });
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
    this.pageData();
  }

  pageData() {
    this.loading = true;
    this.apiService.paginatedCustomers().subscribe((data) => {
      this.items = data.map((entry) => {
        return {
          devicesNumber: entry.devices?.length || 0,
          devicesOutdated: entry.devices?.length || 0,
          devicesOffline: entry.devices?.filter((device) => !device.online).length || 0,
          ...entry
        };
      });
    }).add(() => this.loading = false);
  }

  onAdd() {
    const modal = this.modalService.open(CustomerModalComponent, { centered: true, backdrop: 'static' });
    modal.componentInstance.content = {
      title: 'MODALS.CUSTOMER.ADD_TITLE',
      confirm: 'MODALS.CUSTOMER.CONFIRM',
      abort: 'MODALS.CUSTOMER.ABORT'
    };
    modal.result.then((result) => {
      if (result?.action === 'submit' && result?.value.name) {
        this.apiService.createCustomer(result.value).subscribe({
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
            title: 'MODALS.DELETE_SELECTED_CUSTOMERS_CONFIRM.TITLE',
            body: 'MODALS.DELETE_SELECTED_CUSTOMERS_CONFIRM.BODY',
            confirm: 'MODALS.DELETE_SELECTED_CUSTOMERS_CONFIRM.CONFIRM',
            abort: 'MODALS.DELETE_SELECTED_CUSTOMERS_CONFIRM.ABORT'
          };
          deleteSelectedModal.result.then((result) => {}, () => { });
        }
        break;
      case 'delete':
        if (item.value?.id) {
          const deleteModal = this.modalService.open(ModalConfirmComponent, { centered: true, backdrop: 'static' });
          deleteModal.componentInstance.content = {
            title: 'MODALS.DELETE_CUSTOMER_CONFIRM.TITLE',
            body: 'MODALS.DELETE_CUSTOMER_CONFIRM.BODY',
            confirm: 'MODALS.DELETE_CUSTOMER_CONFIRM.CONFIRM',
            abort: 'MODALS.DELETE_CUSTOMER_CONFIRM.ABORT'
          };
          deleteModal.result.then((result) => {
            if (result) {
              this.apiService.deleteCustomer(item.value.id).subscribe({
                next: () => this.pageData(),
                error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
              });
            }
          }, () => { });
        }
        break;
      case 'edit':
        if (item.value?.id) {
          const editModal = this.modalService.open(CustomerModalComponent, { centered: true, backdrop: 'static' });
          editModal.componentInstance.customer = item.value;
          editModal.componentInstance.content = {
            title: 'MODALS.CUSTOMER.EDIT_TITLE',
            confirm: 'MODALS.CUSTOMER.SAVE',
            abort: 'MODALS.CUSTOMER.ABORT',
            delete: 'MODALS.CUSTOMER.DELETE'
          };
          editModal.result.then((result) => {
            switch (result?.action) {
              case 'submit':
                if (result?.value.name) {
                  this.apiService.updateCustomer({ id: item.value.id, name: result.value.name }).subscribe({
                    next: () => this.pageData(),
                    error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
                  });
                }
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
          this.router.navigate([`/customers/${item.value.id}`]);
        }
        break;
      default:
        break;
    }
  }
}
