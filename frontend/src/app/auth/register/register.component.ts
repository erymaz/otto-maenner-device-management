import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  errorMsg?: string | null;
  success = false;
  unsubscribe = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly utilService: UtilService
  ) { }

  ngOnInit() {
    this.authService.logout();
    this.form = this.fb.group({
      email: [null, [Validators.required, this.utilService.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
      repeatPassword: [null, [Validators.required, this.utilService.matchCompare('password')]]
    });
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.errorMsg = null);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get repeatPassword() {
    return this.form.get('repeatPassword');
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.errorMsg = null;
    if (this.form.valid) {
      this.form.disable({ emitEvent: false });
      this.apiService.createUser(
        { email: this.email?.value.trim(), password: this.password?.value }
      ).subscribe({
        next: () => {
          this.success = true;
        },
        error: (e: HttpErrorResponse) => {
          const error = e?.error?.error;
          if (e.status !== 504 && error) {
            this.errorMsg = error.message;
          }
        }
      }).add(() => this.form.enable({ emitEvent: false }));
    }
  }

}
