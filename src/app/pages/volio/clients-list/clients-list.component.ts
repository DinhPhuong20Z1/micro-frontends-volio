import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NumberFilterComponent } from '../tables/number-filter/number-filter.component';
import { Client, ClientsData } from '../../../@core/data/clients';
import { UtilsFunc } from '../../../@core/data/utils';
import { FlagNameLocationComponent } from '../flag-name-location/flag-name-location.component';
import { AutoCompleteFilterComponent } from '../tables/auto-complete/auto-complete.component';
import { AfterViewInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngx-clients-list',
    styleUrls: ['./clients-list.component.scss'],
    templateUrl: './clients-list.component.html',
})
export class ClientsListComponent implements OnChanges {
    @Input() clients: Client[] = []

    clientsDataSource: LocalDataSource = new LocalDataSource();

    clientsDataTableSettings: any = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        }
    }

    constructor(private utilsFunc: UtilsFunc, private clientsService: ClientsData) {
        this.updateTableSettings()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.clients) {
            this.clientsDataSource.load(this.clients)
            this.updateTableSettings()
        }
    }

    updateTableSettings(): void {
        // Tab clients
        this.clientsDataTableSettings = {
            actions: {
                add: false,
                edit: false,
                delete: false,
            },
            filters: {

            },
            columns: {
                client_id: {
                    sort: true,
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent
                    },
                    editable: false,
                    title: 'ID',
                    type: 'number',
                    width: '5%'
                },
                peer_id: {
                    title: 'Device ID',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.clients
                        }
                    },
                },
                common_name: {
                    title: 'Profile',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.clients
                        }
                    },
                },
                real_ip: {
                    title: 'IP',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.clients
                        }
                    },
                },
                location: {
                    title: 'Location',
                    type: 'custom',
                    renderComponent: FlagNameLocationComponent,
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.clients
                        }
                    },
                },
                data_transfer: {
                    filter: false,
                    title: 'Data Transfer',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.dataTransferToString,
                },
                connected_time: {
                    filter: false,
                    title: 'Connected Time',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                },
                last_ping_time: {
                    filter: false,
                    title: 'Last Ping',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                },
                online_time: {
                    filter: false,
                    title: 'Online Time',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.secondsToDurationString
                }
            },
        };
    }
}

