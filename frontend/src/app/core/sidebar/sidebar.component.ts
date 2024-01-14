import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavLink } from 'src/app/shared/models/nav-link';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() navLinks: NavLink[] = [];
  @Input() activeNavLink?: NavLink;
  @Output() navLinkSelect = new EventEmitter<any>();

  links?: NavLink[];
  selectedNavLink?: NavLink | null;
  unsubscribe = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.links = cloneDeep(this.navLinks) || [];
    this.sidebarService.navLinks = this.links;
    this.selectedNavLink = cloneDeep(this.activeNavLink);
    this.sidebarService.eventsObservable.pipe(takeUntil(this.unsubscribe)).subscribe((action) => {
      if (action.select?.navLink) {
        this.onSelect(action.select?.navLink, action.select?.silent);
      }
    });
  }

  ngOnDestroy() {
    this.sidebarService.navLinks = [];
    this.sidebarService.activeNavLink.next(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSelect(navLink: NavLink | undefined | null, silent = false) {
    this.selectedNavLink = navLink;
    this.sidebarService.activeNavLink.next(navLink);
    if (!silent) {
      this.navLinkSelect.emit(this.selectedNavLink);
    }
  }

  onLogo() {
    this.router.navigate(['/']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
