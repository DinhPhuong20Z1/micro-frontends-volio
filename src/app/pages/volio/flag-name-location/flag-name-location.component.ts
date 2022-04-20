import {
    Component,
    OnChanges,
    OnInit,
    Input
} from '@angular/core';
import { UtilsFunc } from '../../../@core/data/utils';

@Component({
    selector: 'ngx-flag-name-location',
    styleUrls: ['./flag-name-location.component.scss', '../../../../assets/flags/flag-icons.scss'],
    template: `<span class=\"fi fi-{{location_code}}\"></span> {{name}}`,
})
export class FlagNameLocationComponent implements OnInit {
    @Input() location_code: string; // data from parent
    @Input() name: string;

    @Input() value; // data from table
    @Input() rowData;

    constructor(private utilsFunc: UtilsFunc){}

    ngOnInit(): void {
        if (!!this.value) {
            this.name = this.value;
        }

        if (!!this.rowData) {
            this.location_code = this.rowData.location_code
        }
    }
}
