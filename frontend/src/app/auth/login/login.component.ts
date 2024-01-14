import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  errorMsg?: string | null;
  unsubscribe = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly utilService: UtilService
  ) { }

  ngOnInit() {
    this.authService.logout();
    this.form = this.fb.group({
      email: [null, [Validators.required, this.utilService.email]],
      password: [null, Validators.required]
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

  onSubmit() {
    this.form.markAllAsTouched();
    this.errorMsg = null;
    if (this.form.valid) {
      this.form.disable({ emitEvent: false });
      this.apiService.login(
        { email: this.email?.value, password: this.password?.value }
      ).subscribe({
        next: (v) => {
          if (v?.body?.data?.accessToken) {
            this.authService.login(v.body.data.accessToken);
            this.router.navigate(['/devices']);
          } else {
            this.translateService.get('AUTH.INVALID_CREDENTIALS').subscribe((v) => this.errorMsg = v);
          }
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
