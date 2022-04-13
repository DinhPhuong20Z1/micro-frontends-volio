import { Component, OnDestroy } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ngx-one-column-layout',
    styleUrls: ['./one-column.layout.scss'],
    template: `
    <nb-layout windowMode>
        <nb-layout-header fixed>
            <ngx-header></ngx-header>
        </nb-layout-header>

        <nb-sidebar class='menu-sidebar' tag='menu-sidebar' responsive>
            <ng-content select='#main-menu'></ng-content>
            <ng-content select='nb-menu.bottom'></ng-content>
        </nb-sidebar>

        <nb-layout-column>
            <ng-content select='router-outlet'></ng-content>
        </nb-layout-column>

        <nb-layout-footer fixed>
            <ngx-footer></ngx-footer>
        </nb-layout-footer>
    </nb-layout>`,
})
export class OneColumnLayoutComponent implements OnDestroy {
    private destroy$: Subject < void > = new Subject < void > ();

    menuServiceObs: any;
    constructor(private menuService: NbMenuService, private breakpointService: NbMediaBreakpointsService, private sidebarService: NbSidebarService) {
        const { sm, xl } = this.breakpointService.getBreakpointsMap();
        this.menuServiceObs = this.menuService.onItemSelect().pipe(takeUntil(this.destroy$)).subscribe((event: { tag: string, item: any }) => {
            if (document.documentElement.clientWidth < sm) {
                this.sidebarService.collapse('menu-sidebar');
            } else if (document.documentElement.clientWidth < xl) {
                this.sidebarService.compact('menu-sidebar');
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.menuServiceObs.unsubscribe();
    }
}
