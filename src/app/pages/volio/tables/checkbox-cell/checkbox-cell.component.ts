import { AfterViewInit } from '@angular/core';
import {
    Component,
    Input,
} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `<nb-checkbox status="{{value==true?'success':'info'}}" (click)="onButtonClick($event)" [checked]="value==true" (checkedChange)="checkedChange($event)">Newest</nb-checkbox>`,
})
export class CheckboxCellComponent implements ViewCell, AfterViewInit {
    @Input() value; // data from table
    @Input() rowData;

    initValue: string | number;
    ngAfterViewInit(): void {
        this.initValue = this.value;
    }


    onButtonClick(event: MouseEvent) {
        event.preventDefault();
        this.value = this.initValue;
    }

    checkedChange(event) {
        this.value = this.initValue;
    }
}
