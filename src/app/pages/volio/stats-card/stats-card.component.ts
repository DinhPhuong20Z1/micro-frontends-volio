import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { UtilsFunc } from '../../../@core/data/utils';

@Component({
    selector: 'ngx-stats-card',
    styleUrls: ['./stats-card.component.scss'],
    templateUrl: './stats-card.component.html',
})

export class StatsCardComponent implements OnChanges {
    constructor(private utilsService: UtilsFunc){}
    @Input() description: string


    @Input() stats: number;
    @Input() statsUnit: string = '';
    @Input() status: string = 'info';
    @Input() type: string;
    @Input() object: string = 'clients';

    @Input() statsFlip: number;
    @Input() statsFlipUnit: string = '';
    @Input() statusFlip: string = 'info';
    @Input() typeFlip: string;
    @Input() objectFlip: string = 'clients';

    @Input() statsExtra: number;
    @Input() statsExtraUnit: string = '';
    @Input() statusExtra: string = 'info';
    @Input() typeExtra: string;
    @Input() objectExtra: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.statsUnit) {
            if (this.statsUnit.toLowerCase() == "bytes" || this.statsUnit.toLowerCase() == "kib" || this.statsUnit.toLowerCase() == "kb" || this.statsUnit.toLowerCase() == "mb" || this.statsUnit.toLowerCase() == "gb") {
                let [statsF, objectF] = this.utilsService.dataTransferFriendly(this.stats)
                this.stats = statsF
                this.statsUnit = objectF
            }

            if (this.statsUnit.toLowerCase() == "seconds" || this.statsUnit.toLowerCase() == "hours" || this.statsUnit.toLowerCase() == "days" || this.statsUnit.toLowerCase() == "months") {
                let [statsF, objectF] = this.utilsService.secondsToDurationFriendly(this.stats)
                this.stats = statsF
                this.statsUnit = objectF
            }
        }

        if (!!this.statsFlipUnit) {
            if (this.statsFlipUnit.toLowerCase() == "bytes" || this.statsFlipUnit.toLowerCase() == "kib" || this.statsFlipUnit.toLowerCase() == "kb" || this.statsFlipUnit.toLowerCase() == "mb" || this.statsFlipUnit.toLowerCase() == "gb") {
                let [statsF, objectF] = this.utilsService.dataTransferFriendly(this.statsFlip)
                this.statsFlip = statsF
                this.statsFlipUnit = objectF
            }

            if (this.statsFlipUnit.toLowerCase() == "seconds" || this.statsFlipUnit.toLowerCase() == "hours" || this.statsFlipUnit.toLowerCase() == "days" || this.statsFlipUnit.toLowerCase() == "months") {
                let [statsF, objectF] = this.utilsService.secondsToDurationFriendly(this.statsFlip)
                this.statsFlip = statsF
                this.statsFlipUnit = objectF
            }
        }

        if (!!this.statsExtraUnit) {
            if (this.statsExtraUnit.toLowerCase() == "bytes" || this.statsExtraUnit.toLowerCase() == "kib" || this.statsExtraUnit.toLowerCase() == "kb" || this.statsExtraUnit.toLowerCase() == "mb" || this.statsExtraUnit.toLowerCase() == "gb") {
                let [statsF, objectF] = this.utilsService.dataTransferFriendly(this.statsExtra)
                this.statsExtra = statsF
                this.statsExtraUnit = objectF
            }

            if (this.statsExtraUnit.toLowerCase() == "seconds" || this.statsExtraUnit.toLowerCase() == "hours" || this.statsExtraUnit.toLowerCase() == "days" || this.statsExtraUnit.toLowerCase() == "months") {
                let [statsF, objectF] = this.utilsService.secondsToDurationFriendly(this.statsExtra)
                this.statsExtra = statsF
                this.statsExtraUnit = objectF
            }
        }
    }
}
