import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NavLink } from '../models/nav-link';

export interface SidebarSelect {
  navLink?: NavLink | null;
  silent?: boolean;
}

export interface SidebarAction {
  select?: SidebarSelect;
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
  navLinks: NavLink[] = [];
  activeNavLink = new BehaviorSubject<NavLink | undefined | null>(null);
  events = new BehaviorSubject<SidebarAction>({});
  eventsObservable = this.events.asObservable();
  activeNavLinkObservable = this.activeNavLink.asObservable();

  emitEvent(action: SidebarAction) {
    this.events.next(action);
  }

  findNavLink(navLinks: NavLink[] | undefined, id: string | undefined): NavLink | null {
    if (navLinks && id) {
      for (let i = 0; i < navLinks.length; i++) {
        if (navLinks[i].id === id) {
          return navLinks[i];
        }
      }
    }
    return null;
  }

}
