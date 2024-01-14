import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { get } from 'lodash';

import { CustomerRequest } from 'src/app/shared/models';

interface CustomerModalContent {
  title: string;
  confirm: string;
  abort: string;
  delete: string;
}

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent implements OnInit {
  form!: FormGroup;
  content!: CustomerModalContent;
  customer!: CustomerRequest;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [get(this.customer, 'name'), Validators.required]
    });
  }

  get name() {
    return this.form.get('name');
  }

  onSubmit() {
    if (this.name?.value) {
      this.name.setValue(this.name.value.trim());
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
