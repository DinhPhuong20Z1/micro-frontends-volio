import { DatePipe } from '@angular/common';
import {
    Component, ViewChild
} from '@angular/core';
import { NbCalendarRange, NbDateService, NbPopoverDirective, NbRangepickerComponent } from '@nebular/theme';
@Component({
    selector: 'ngx-date-range',
    template: `
        <input nbInput placeholder="Form Picker" [(ngModel)]="ngModelDate" [nbPopover]="selectTime" position="bottom" disabled>
        <ng-template #selectTime let-data>
            <nb-tabset>
                <nb-tab tabTitle="Now"></nb-tab>
                <nb-tab tabTitle="Hour">
                    <nb-calendar-range [(range)]="range"></nb-calendar-range>
                </nb-tab>
                <nb-tab tabTitle="Day">
                    <nb-calendar-range [(range)]="range"></nb-calendar-range>
                </nb-tab>
                <nb-tab tabTitle="Month">
                    <nb-calendar-range [(range)]="range"></nb-calendar-range>
                </nb-tab>
            </nb-tabset>

            <button nbButton status="info" fullWidth (click)="onPicked()">Oke</button>
        </ng-template>
    `,
})
export class DateRangeComponent {
    @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

    selectedItem: string = "Now"
    ngModelDate: string = "NOW"

    range: NbCalendarRange<Date>;

    constructor(private datePipe: DatePipe, protected dateService: NbDateService<Date>) {
        console.log("popover: ", this.popover)
        this.range = {
            start: this.dateService.addDay(this.monthStart, 3),
            end: this.dateService.addDay(this.monthEnd, -3),
        };
    }

    get monthStart(): Date {
        return this.dateService.getMonthStart(new Date());
    }

    get monthEnd(): Date {
        return this.dateService.getMonthEnd(new Date());
    }

    typeRangeChanged(event: any): void {
        console.log("popover: ", this.popover)
        console.log(event);
    }

    onPicked() {
        console.log("popover: ", this.popover)
        if (!!this.range.start && !!this.range.end) {
            this.popover.hide()
            console.log("Range: ", this.range)
            this.ngModelDate = this.datePipe.transform(this.range.start, 'dd/MM/yyyy') + " - " + this.datePipe.transform(this.range.end, 'dd/MM/yyyy')
        } else {
            console.log("Invalid date range: ", this.range)
        }
    }
}
