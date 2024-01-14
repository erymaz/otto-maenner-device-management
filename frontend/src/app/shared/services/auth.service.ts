import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

import { RoleType } from '../models/role-types';
import { ACCESS_TOKEN, FRONTEND_LANGUAGE_PRELOAD_ORDER, REMEMBER_LOCALE } from '../models/constant';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private readonly jwtHelperService: JwtHelperService,
    private readonly translate: TranslateService,
    private readonly lsService: LocalStorageService
  ) { }

  isAuthenticated(token = null): boolean {
    const accessToken = token || this.getAccessToken();
    try {
      if (accessToken && !this.jwtHelperService.isTokenExpired(accessToken)) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  getRoles(): RoleType[] {
    const token = this.getDecodedToken();
    return token?.roles || [];
  }

  hasSystemRole(): boolean {
    const token = this.getDecodedToken();
    return token?.roles?.includes(RoleType.SYSTEM) || false;
  }

  hasAdminRole(): boolean {
    const token = this.getDecodedToken();
    return token?.roles?.includes(RoleType.ADMIN) || false;
  }

  hasUserRole(): boolean {
    const token = this.getDecodedToken();
    return token?.roles?.includes(RoleType.USER) || false;
  }

  login(accessToken: string) {
    this.setAccessToken(accessToken);
  }

  logout() {
    this.lsService.clear(ACCESS_TOKEN);
  }

  getDecodedToken() {
    if (this.isAuthenticated()) {
      return this.jwtHelperService.decodeToken(this.getAccessToken());
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    if (token) {
      try {
        return this.jwtHelperService.isTokenExpired(token);
      } catch (error) {
        console.error(error);
      }
    }
    return true;
  }

  refreshToken(): boolean {
    if (this.isAuthenticated()) {
      const expirationTimestamp = this.jwtHelperService.getTokenExpirationDate(
        this.getAccessToken()
      );
      const ts = expirationTimestamp ? expirationTimestamp.getTime() : null;
      if (ts && (ts - Date.now()) < (8.64e+7)) {
        return true;
      }
    }
    return false;
  }

  getAccessToken(): string {
    return this.retrieve(ACCESS_TOKEN);
  }

  setAccessToken(accessToken: string): void {
    this.store(ACCESS_TOKEN, accessToken);
  }

  initLanguage() {
    if (!FRONTEND_LANGUAGE_PRELOAD_ORDER?.length) {
      this.translate.addLangs(['en']);
    }
    this.translate.setDefaultLang('en');
    this.setLocale(this.getLocale());
  }

  setLocale(locale: string) {
    const defaultLocale = 'en';
    const language = locale || defaultLocale;
    this.store(REMEMBER_LOCALE, language);
    moment.locale(language);
    this.translate.use(language).subscribe({
      error: (err) => {
        this.translate.use(defaultLocale);
        moment.locale(defaultLocale);
        this.store(REMEMBER_LOCALE, defaultLocale);
        console.error(err);
      }
    });
  }

  getLocale() {
    return this.retrieve(REMEMBER_LOCALE);
  }

  private retrieve(key: string) {
    try {
      return this.lsService.retrieve(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private store(key: string, value: any) {
    try {
      this.lsService.store(key, value);
    } catch (error) {
      console.error(error);
    }
  }
}
