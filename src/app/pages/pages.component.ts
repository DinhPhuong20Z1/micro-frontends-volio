import { Component } from '@angular/core';
import { MENU_ITEMS, MENU_ITEMS_BOTTOM } from './pages-menu';

@Component({
    selector: 'ngx-pages',
    styleUrls: ['pages.component.scss'],
    template: `
    <ngx-one-column-layout>
        <nb-menu [items]="menu" id="main-menu"></nb-menu>
        <nb-menu [items]="menu2" class="bottom"></nb-menu>
        <router-outlet></router-outlet>
    </ngx-one-column-layout>
    `,
})
export class PagesComponent {
    menu = MENU_ITEMS;
    menu2 = MENU_ITEMS_BOTTOM;
}
