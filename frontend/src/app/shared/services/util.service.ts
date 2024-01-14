import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class UtilService {

  constructor(
    private readonly toastrService: ToastrService
  ) { }

  matchCompare(compareTo: string) {
    return (control: any) => {
      if (!control || !control.parent) {
        return null;
      }
      const from = control;
      const to = control.parent.get(compareTo);
      if (!from || !to || from.value === to.value) {
        return null;
      }
      return { matchCompare: true };
    };
  }

  email(control: AbstractControl) {
    if (control && !control.value) {
      return null;
    } else if (control && control.value
      && control.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return null;
    }
    return { email: true };
  }

  notifyErrorMsg(e: HttpErrorResponse) {
    const error = e?.error?.error;
    if (e.status !== 504 && error) {
      this.toastrService.error(error.message);
    }
  }

}
