import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DefaultFilter} from 'ng2-smart-table';

@Component({
    template: `
    <input
        nbInput
        type='text'
        [placeholder]='column.title'
        [ngModel]='value'
        (ngModelChange)='onModelChange($event)'/>`,
})

export class InputStringFilterComponent extends DefaultFilter implements OnInit, OnChanges {
    value: any;
    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {}

    onModelChange(value: any) {
        console.log('onModelChange - value: ', value)
        this.query = value !== null ? value.toString() : '';
        this.setFilter();
    }
}
