import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

import { ACCESS_TOKEN } from '../models/constant';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(
    private readonly lsService: LocalStorageService
  ) { }

  public getToken(): any {
    const accessToken = this.lsService.retrieve(ACCESS_TOKEN);
    return accessToken ? accessToken.replace(new RegExp('\"', 'g'), '') : accessToken;
  }
}
