import { NumberFilterComponent } from '../tables/number-filter/number-filter.component';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Region } from '../../../@core/data/regions';
import { AutoCompleteFilterComponent } from '../tables/auto-complete/auto-complete.component';
import { UtilsFunc } from '../../../@core/data/utils';
import { OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-region-info',
    styleUrls: ['./region-info.component.scss'],
    templateUrl: './region-info.component.html',
})

export class RegionInfoComponent implements OnInit, OnChanges {
    @Input() region: Region

    dataTransferConverted: number = 0;
    unit: string = 'bytes';

    settings: any = {
        actions: false
    }

    source: LocalDataSource = new LocalDataSource();
    constructor(private utilsFunc: UtilsFunc, private router: Router) {}


    ngOnInit(): void {
        this.updateTableSettings

        if (!!this.region) {
            this.source.load(this.region.servers)
        }
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.region) {
            this.onCovertDataTransfer(this.region.data_transfer)
        }
        this.updateTableSettings()
    }

    updateTableSettings() {
        this.settings = {
            actions: false,
            edit: {
                editButtonContent: '<i class="nb-edit"></i>',
                saveButtonContent: '<i class="nb-checkmark"></i>',
                cancelButtonContent: '<i class="nb-close"></i>',
            },
            delete: {
                deleteButtonContent: '<i class="nb-trash"></i>',
                confirmDelete: true,
            },
            columns: {
                id: {
                    sort: true,
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent
                    },
                    title: 'ID',
                    type: 'number',
                },
                name: {
                    title: 'Server Name',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                },
                ip: {
                    title: 'IP',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                },
                local_ip: {
                    title: 'Local IP',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                },
                cpu: {
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                    title: 'CPU',
                    type: 'number',
                },
                cup_percent: {
                    title: 'CPU Percent',
                    type: 'number',
                    filter: false
                },
                ram: {
                    title: 'RAM',
                    type: 'number',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                },
                ram_percent: {
                    title: 'RAM Percent',
                    type: 'number',
                    filter: false,
                },
                type: {
                    title: 'Type',
                    type: 'string',
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.region.servers,
                            from: "ServerDetailsComponent"
                        }
                    },
                },
                status: {
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent
                    },
                    title: 'Status',
                    type: 'number',
                },
                data_transfer: {
                    filter: false,
                    title: 'Data Transfer',
                    type: 'number',
                    valuePrepareFunction: this.utilsFunc.dataTransferToString,
                },
            },
        };

        if (!!this.region) {
            this.source.load(this.region.servers)
        }

    }

    onCovertDataTransfer(dataTransfer: number) {
        [this.dataTransferConverted, this.unit] = this.utilsFunc.dataTransferFriendly(dataTransfer)
    }

    onUserRowSelect(event: any) {
        if (!!event.data) {
            this.router.navigateByUrl("/pages/servers?name="+event.data.location_code)
        }
        console.log("onUserRowSelect: ",event)
    }
}

