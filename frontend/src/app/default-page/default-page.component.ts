import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavLink } from '../shared/models/nav-link';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})
export class DefaultPageComponent {
  navLinks: NavLink[] = [
    {
      id: 'devices',
      name: 'NAV_LINK.EDGE_DEVICES',
      url: '/devices',
      icon: 'devices',
      active: true
    },
    {
      id: 'customers',
      name: 'NAV_LINK.CUSTOMERS',
      url: '/customers',
      icon: 'users'
    }
  ];

  constructor(
    private readonly router: Router
  ) { }

  onNavLinkSelect(navLink: NavLink) {
    if (navLink?.id && navLink?.url) {
      this.router.navigate([navLink.url]);
    }
  }

}
