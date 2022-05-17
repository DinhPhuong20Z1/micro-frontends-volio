import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
    selector: 'ngx-extra',
    templateUrl: './extra.component.html',
    styleUrls: ['./extra.component.scss'],
})
export class ExtraComponent implements OnDestroy {
    private destroy$ = new Subject < void > ();

    subscription: any;

    authenticated: boolean = false;
    token: string = '';

    constructor(protected location: Location) {}

    back() {
        this.location.back();
        return false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
