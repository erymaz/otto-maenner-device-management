import { Injectable } from '@angular/core';
import {
  Router,
  Route,
  CanActivate,
  CanActivateChild,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { intersection } from 'lodash';

import { RoleType } from '../models/role-types';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.data && route.data.roles) {
      return this.checkRoles(route.data.roles);
    }
    return this.checkAuthentication();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    if (route.data && route.data.roles) {
      return this.checkRoles(route.data.roles);
    }
    return this.checkAuthentication();
  }

  private checkRoles(roles: RoleType[] = []) {
    if (this.authService.isAuthenticated()) {
      if (roles?.length && !intersection(roles, this.authService.getRoles())?.length) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  private checkAuthentication(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
