import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
    template: `<nb-checkbox status="success" (checkedChange)="onUpdateData($event)" [checked]="cell.getValue()!=''">Newest</nb-checkbox>`,
})

export class CheckboxEditorComponent extends DefaultEditor {
    constructor() {
        super();
    }

    // [checked]="value==true"
    onUpdateData(value: boolean) {
        this.cell.newValue = value;
    }
}
