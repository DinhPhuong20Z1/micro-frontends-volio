import { DatePipe } from '@angular/common';
import { NbCalendarRange, NbPopoverModule } from '@nebular/theme';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import {
    NbDateService,
    NbSidebarService,
} from '@nebular/theme';
import { interval, Observable } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ngx-floating-button',
    styleUrls: ['./floating-button.component.scss'],
    template: `
        <button [@showhide]="heading" nbButton shape="round" class="ngx-toggle-setting-container" id="cog-button" [nbPopover]="selectTime"><nb-icon icon="settings-2-outline" id="cog-icon"></nb-icon></button>
        <ng-template #selectTime let-data>
            <div class="row" style="width: 492px; padding: 0px; margin: 0px">
                <div class="col-4 col-sm-4 col-md-4" style="padding: 0px; margin: 0px">
                    <button nbButton status="primary" [outline]="typeRange=='now'" [ghost]="typeRange!='now'" fullWidth (click)="onClickNowButton()">Now</button>
                    <button nbButton status="primary" [outline]="typeRange=='hour'" [ghost]="typeRange!='hour'" fullWidth (click)="onClickHourButton()" ghost>Hour</button>
                    <button nbButton status="primary" [outline]="typeRange=='day'" [ghost]="typeRange!='day'" fullWidth (click)="onClickDayButton()" ghost>Day</button>
                    <button nbButton status="primary" [outline]="typeRange=='month'" [ghost]="typeRange!='month'" fullWidth (click)="onClickMonthButton()" ghost>Month</button>
                </div>
                <div class="col-8 col-sm-8 col-md-8" style="padding: 0px; text-align: center; margin: auto;">
                    <span class="h6">{{timeDisplay}}</span>
                    <nb-calendar-range *ngIf="typeRange!='now'" [(range)]="range" [(max)]="rangeMax" [(min)]="rangeMin" fullWidth (rangeChange)="onRangeChanged($event)"></nb-calendar-range>
                </div>

                <button nbButton status="info" fullWidth (click)="onPicked()" ghost status="primary" style="margin-top: 2px">Oke</button>
            </div>
        </ng-template>
    `,
    animations: [
        trigger('showhide', [
            state('invisible', style({opacity: '0'})),
            state('visible', style({opacity: '1'})),
            transition('invisible <=> visible', animate('1000ms ease')),
        ]),
    ],
})
export class FloatingButtonComponent implements OnInit, OnDestroy {
    @Output() OnRangeChanged = new EventEmitter<{start: number, end: number, type: string}>();
    timeDisplay: string;
    typeRange: string = "now";
    range: NbCalendarRange<Date>;
    rangeMax: Date;
    rangeMin: Date;

    timeDisplayInterval: any;

    index: number = 0;
    heading: string = 'invisible';
    constructor(private datePipe: DatePipe, protected dateService: NbDateService<Date>) {
        this.rangeMax = new Date();
        this.rangeMin = this.dateService.addDay(this.rangeMax, -3),
        this.range = {
            start: this.rangeMin,
            end: this.rangeMax,
        };

        interval(1000).subscribe(x => {
            this.heading = (this.heading === 'visible') ? 'invisible' : 'visible';
            if (x % 2 === 0) {
                this.index = (x / 2) % 3;
            }
        });
    }

    ngOnInit(): void {
        if (this.typeRange === "now") {
            this.timeDisplayInterval = interval(1000).subscribe(() => {
                this.timeDisplay = "Now: " + this.datePipe.transform(new Date(), 'HH:mm:ss dd/MM/yyyy');
            });
        }
    }

    ngOnDestroy(): void {
        if (!!this.timeDisplayInterval) {
            this.timeDisplayInterval.unsubscribe();
        }
    }

    onRangeChanged(event: any): void {
        if (!!this.timeDisplayInterval) {
            this.timeDisplayInterval.unsubscribe();
        }
        this.timeDisplay = "From: " + this.datePipe.transform(this.range.start, 'dd/MM/yyyy');
        if (this.range.end) {
            this.timeDisplay += " To: " + this.datePipe.transform(this.range.end, 'dd/MM/yyyy');
        }
    }

    onPicked() {
        if (!!this.range.start && !!this.range.end) {
            this.OnRangeChanged.emit({start: Math.round(this.range.start.getTime() / 1000), end: Math.round(this.range.end.getTime() / 1000), type: this.typeRange});
        }
    }

    onClickNowButton() {
        this.timeDisplay = "Now: " + this.datePipe.transform(new Date(), 'HH:mm:ss dd/MM/yyyy');
        this.typeRange = "now";
        this.timeDisplayInterval = interval(1000).subscribe(() => {
            this.timeDisplay = "Now: " + this.datePipe.transform(new Date(), 'HH:mm:ss dd/MM/yyyy');
        });
    }

    onClickHourButton() {
        this.rangeMax = new Date();
        this.rangeMin = this.dateService.addDay(this.rangeMax, -3),
        this.typeRange = "hour";
        if (!!this.timeDisplayInterval) {
            this.timeDisplayInterval.unsubscribe();
        }
    }

    onClickDayButton() {
        this.rangeMax = new Date();
        this.rangeMin = this.dateService.addDay(this.rangeMax, -30),
        this.typeRange = "day";
        if (!!this.timeDisplayInterval) {
            this.timeDisplayInterval.unsubscribe();
        }
    }

    onClickMonthButton() {
        this.rangeMax = new Date();
        this.rangeMin = this.dateService.addMonth(this.rangeMax, -3 * 12),
        this.typeRange = "month";
        if (!!this.timeDisplayInterval) {
            this.timeDisplayInterval.unsubscribe();
        }
    }
}
