import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'ngx-menu-context',
    templateUrl: './menu-context.component.html',
    styleUrls: ['./menu-context.component.scss'],
})
export class MenuContextComponent implements OnInit {
    @Input() x = 0;
    @Input() y = 0;

    constructor() {}

    ngOnInit(): void {}
}
