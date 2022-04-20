import {
    Component,
    OnChanges,
    OnInit,
    Input
} from '@angular/core';
import { UtilsFunc } from '../../../@core/data/utils';

@Component({
    selector: 'ngx-server-status',
    styleUrls: ['./server-status.component.scss'],
    template: `<nb-icon status="danger" nbPopover="{{statusPopover}}" nbPopoverTrigger="hint" nbPopoverPlacement="top" class="icon" icon="{{statusIcon}}" pack="fa" [ngStyle]="{'color': statusColor}"></nb-icon>`,
})
export class ServerStatusComponent implements OnInit {
    @Input() status: any; // data from parent
    statusIcon: string
    statusColor: string
    statusPopover: string

    constructor(private utilsFunc: UtilsFunc){}

    ngOnInit(): void {
        // 0 - offline, 1 - bad, 2 - normal, 3 - good, 4 - great
        switch (this.status) {
            case "0":
                this.statusIcon = 'battery-empty'
                this.statusColor = 'gray'
                this.statusPopover = 'Server is offline'
                break
            case "1":
                this.statusIcon = 'battery-quarter'
                this.statusColor = 'turquoise'
                this.statusPopover = 'Server\'s health is bad'
                break
            case "2":
                this.statusIcon = 'battery-half'
                this.statusPopover = 'Server\'s health is normal'
                break
            case "3":
                this.statusIcon = 'battery-three-quarters'
                this.statusColor = 'mediumorchid'
                this.statusPopover = 'Server\'s health good'
                break
            default:
                this.statusIcon = 'battery-full'
                this.statusColor = 'gold'
                this.statusPopover = 'Server\'s health great'
                break
        }
    }
}
