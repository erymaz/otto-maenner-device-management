import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { tableConfig } from './config';
import { ActionItem, CustomerResponse, TableConfig } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services/api.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { ModalConfirmComponent } from 'src/app/shared/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  totalDevices = 0;
  config!: TableConfig;
  loading = false;
  items: any = [];
  customer!: CustomerResponse;
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
        this.apiService.customerById(params.id).subscribe({
          next: (v) => {
            this.config = cloneDeep(tableConfig);
            this.customer = v;
            const activeNavLink = this.sidebarService.findNavLink(this.sidebarService.navLinks, 'customers');
            if (activeNavLink) {
              this.sidebarService.emitEvent({ select: { navLink: activeNavLink, silent: true } });
            }
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

  onBack() {
    this.router.navigate(['/customers']);
  }

  onAction(item: ActionItem) {
    switch (item?.action) {
      case 'deleteSelected':
        break;
      case 'delete':
        break;
      case 'edit':
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

  onEdit() {
    const editModal = this.modalService.open(CustomerModalComponent, { centered: true, backdrop: 'static' });
    editModal.componentInstance.customer = this.customer;
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
            this.apiService.updateCustomer({ id: this.customer.id, name: result.value.name }).subscribe({
              next: (v) => this.customer = v,
              error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
            });
          }
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
      title: 'MODALS.DELETE_CUSTOMER_CONFIRM.TITLE',
      body: 'MODALS.DELETE_CUSTOMER_CONFIRM.BODY',
      confirm: 'MODALS.DELETE_CUSTOMER_CONFIRM.CONFIRM',
      abort: 'MODALS.DELETE_CUSTOMER_CONFIRM.ABORT'
    };
    deleteModal.result.then((result) => {
      if (result) {
        this.apiService.deleteCustomer(this.customer.id).subscribe({
          next: () => this.onBack(),
          error: (e: HttpErrorResponse) => this.utilService.notifyErrorMsg(e)
        });
      }
    }, () => { });
  }

}
