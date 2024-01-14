import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { get } from 'lodash';

import { CustomerResponse, DeviceRequest } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services/api.service';

interface EdgeDeviceModalContent {
  title: string;
  confirm: string;
  abort: string;
  delete: string;
}

@Component({
  selector: 'app-edge-device-modal',
  templateUrl: './edge-device-modal.component.html',
  styleUrls: ['./edge-device-modal.component.scss']
})
export class EdgeDeviceModalComponent implements OnInit {
  form!: FormGroup;
  content!: EdgeDeviceModalContent;
  deviceRequest!: DeviceRequest;
  customers!: CustomerResponse[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NgbActiveModal,
    private readonly apiService: ApiService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      customerId: get(this.deviceRequest, 'customerId'),
      name: [get(this.deviceRequest, 'name'), Validators.required],
      device: [get(this.deviceRequest, 'device'), Validators.required]
    });
    this.apiService.paginatedCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  get name() {
    return this.form.get('name');
  }

  get device() {
    return this.form.get('device');
  }

  onSubmit() {
    if (this.name?.value) {
      this.name.setValue(this.name.value.trim());
    }
    if (this.device?.value) {
      this.device.setValue(this.device.value.trim());
    }
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.modal.close({ action: 'submit', value: this.form.value });
    }
  }

  onDelete() {
    this.modal.close({ action: 'delete' });
  }

  close(): void {
    this.modal.close();
  }

}
