import { CompleterService } from '@akveo/ng2-completer';
import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DefaultFilter, LocalDataSource} from 'ng2-smart-table';
import { Observable, of } from 'rxjs';

export interface Location {
    value: string;
    location_code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <input
        [ngModel]='value'
        (ngModelChange)='onModelChange($event)'
        nbInput
        type='text'
        [placeholder]='column.title'
        [nbAutocomplete]='autoNgModel'/>

    <nb-autocomplete #autoNgModel>
        <nb-option *ngFor='let option of filteredNgModelOptions$ | async' [value]='isLocationColumn?option.value:option'>
            <span *ngIf='!isLocationColumn'>{{option}}</span>
            <ngx-flag-name-location *ngIf='isLocationColumn' location_code='{{option.location_code}}' name='{{option.value}}'></ngx-flag-name-location>
        </nb-option>
    </nb-autocomplete>`,
})

export class AutoCompleteFilterComponent extends DefaultFilter implements OnInit, OnChanges {
    inputControl = new FormControl();

    isLocationColumn = false;
    constructor() {
        super();
    }

    options: any[] = [];
    optionsCheckedMap: Map<string, boolean> = new Map<string, boolean>();

    filteredNgModelOptions$: Observable<any[]>;
    value: string;

    ngOnInit() {
        this.updateData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateData();
    }

    updateData() {
        if (this.column.title.toLocaleLowerCase().includes('location')) {
            this.isLocationColumn = true;
        }

        if (this.isLocationColumn) {
            if (!!this.column.getFilterConfig() && !!this.column.getFilterConfig().data) {
                const dataRaw = this.column.getFilterConfig().data;
                for (const row of dataRaw) {
                    const location = row[this.column.id];
                    const location_code = row['location_code'];
                    if (!!location && !!!this.optionsCheckedMap[location]) {
                        this.optionsCheckedMap[location] = true;
                        this.options.push({
                            value: location,
                            location_code: location_code,
                        });
                    }
                }
            }
        } else {
            if (!!this.column.getFilterConfig() && !!this.column.getFilterConfig().data) {
                const dataRaw = this.column.getFilterConfig().data;
                for (const row of dataRaw) {
                    const data = row[this.column.id];
                    if (!!data && !!!this.optionsCheckedMap[data]) {
                        this.optionsCheckedMap[data] = true;
                        this.options.push(data);
                    }
                }
            }
        }
        this.filteredNgModelOptions$ = of(this.options);
    }

    private filterFunc(value: string): string[] {
        const filterValue = value.toLowerCase();
        this.query = value !== null ? value.toString() : '';
        this.setFilter();

        return this.options.filter(optionValue => optionValue.value.toLowerCase().includes(filterValue));
    }

    onModelChange(value: any) {
        this.filteredNgModelOptions$ = of(this.filterFunc(value));
    }
}
