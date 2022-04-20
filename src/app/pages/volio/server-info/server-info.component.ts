import {
    Component,
    Input,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { NumberFilterComponent } from '../tables/number-filter/number-filter.component';
import { Server } from '../../../@core/data/servers';
import { UtilsFunc } from '../../../@core/data/utils';
import { OnChanges } from '@angular/core';

@Component({
    selector: 'ngx-server-info',
    styleUrls: ['./server-info.component.scss'],
    templateUrl: './server-info.component.html',
})
export class ServerInfoComponent implements OnInit, OnChanges {
    @Input() server: Server
    @Input() isActive: boolean = false

    source: LocalDataSource = new LocalDataSource();

    constructor(private utilsFunc: UtilsFunc) {}

    ngOnInit(): void {
        this.initDataShow(this.server)
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initDataShow(this.server)
    }

    createdTimeStr: string = "NaN"
    timePopover: string = "Not found any data"
    dataTransferConverted: string
    initDataShow(server: Server) {
        let date = new Date(server.created_time*1000);
        this.createdTimeStr = date.toLocaleString()
        this.timePopover = date.toUTCString()

        this.dataTransferConverted = this.utilsFunc.dataTransferToString(server.data_transfer)
    }
}

