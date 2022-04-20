import { ErrorHandlerDialogComponent } from "./../dialogs/error-handler/error-handler.component";
import { Component, Input, OnDestroy } from "@angular/core";
import { saveAs } from "file-saver";
import { LocalDataSource } from "ng2-smart-table";
import { NumberFilterComponent } from "../tables/number-filter/number-filter.component";
import { Server, ServersData, ServerStats } from "../../../@core/data/servers";
import { ClientsData, Client } from "../../../@core/data/clients";
import { UtilsFunc } from "../../../@core/data/utils";
import { VPNProfile, VPNProfilesData } from "../../../@core/data/profile";
import { NbDialogService, NbDialogRef } from "@nebular/theme";
import { DialogDeleteProfileComponent } from "../dialogs/dialog-delete-profile/dialog-delete-profile.component";
import { InputStringFilterComponent } from "../tables/input-string/input-string.component";
import { AutoCompleteFilterComponent } from "../tables/auto-complete/auto-complete.component";
import { Subscription } from "rxjs";
import { TemplateRef } from "@angular/core";

@Component({
    selector: "ngx-server-detail",
    styleUrls: ["./server-detail.component.scss"],
    templateUrl: "./server-detail.component.html",
})
export class ServerDetailsComponent implements OnDestroy {
    @Input() server: Server;
    statusIcon: string = "battery-empty";
    statusColor: string = "";
    statusPopover: string = "";

    // Tab Overview
    serverServiceObs: Subscription;
    serverStats: ServerStats;

    // Tab clients
    clients: Client[];
    clientDataObs: any;

    // Tab Profiles
    profiles: VPNProfile[];
    profilesDataTableSettings: any = {
        actions: {
            add: false,
            edit: false,
            delete: false,
        },
    };

    profilesDataSource: LocalDataSource = new LocalDataSource();
    profileDataObs: any;

    constructor(
        private serverService: ServersData,
        private profilesService: VPNProfilesData,
        private clientsService: ClientsData,
        private dialogService: NbDialogService,
        private utilsFunc: UtilsFunc
    ) {}

    ngAfterViewInit(): void {
        this.getServerCharts(1000);
    }

    getServerChartsTimeout: NodeJS.Timeout;
    getServerCharts(timeout: number) {
        if (!!this.getServerChartsTimeout) {
            clearTimeout(this.getServerChartsTimeout);
        }
        if (!!this.serverServiceObs) {
            this.serverServiceObs.unsubscribe();
        }

        this.getServerChartsTimeout = setTimeout(() => {
            this.serverServiceObs = this.serverService
                .getServersStat(this.server.name)
                .subscribe(
                    (resp) => {
                        console.log(
                            "ServerDetailsComponent call getServersData Resp: ",
                            resp
                        );
                        if (resp.message === "success") {
                            this.serverStats = resp.data;
                            this.clients = resp.data.clients;
                            this.profiles = resp.data.profiles;
                            this.profilesDataSource.load(resp.data.profiles);
                        }
                    },
                    (err) => {
                        console.log(
                            "ServerDetailsComponent call getServersData error: ",
                            err
                        );
                    },
                    () => {
                        this.initProfileTable();
                        this.getServerCharts(5000);
                    }
                );
        }, timeout);
    }

    initProfileTable() {
        this.profilesDataTableSettings = {
            actions: {
                add: false,
                edit: false,
                delete: false,
            },
            columns: {
                id: {
                    sort: true,
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent,
                    },
                    title: "ID",
                    type: "number",
                    width: "5%",
                },
                name: {
                    title: "name",
                    type: "string",
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.profiles,
                            from: "ServerDetailsComponent",
                        },
                    },
                },
                used_count: {
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent,
                    },
                    title: "Used Count",
                    type: "number",
                },
                used_time: {
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent,
                    },
                    title: "Used Time",
                    type: "number",
                },
                created_time: {
                    filter: false,
                    title: "Created Time",
                    type: "string",
                    valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                },
                // expires_time: {
                //     filter: false,
                //     title: 'Expires Time',
                //     type: 'string',
                //     valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                // },
            },
        };

        this.initDataShow(this.server);

        // 0 - offline, 1 - bad, 2 - normal, 3 - good, 4 - great
        switch (this.server.status) {
            case 0:
                this.statusIcon = "battery-empty";
                this.statusColor = "gray";
                this.statusPopover = "Server is offline";
                break;
            case 1:
                this.statusIcon = "battery-quarter";
                this.statusColor = "turquoise";
                this.statusPopover = "Server's health is bad";
                break;
            case 2:
                this.statusIcon = "battery-half";
                this.statusPopover = "Server's health is normal";
                break;
            case 3:
                this.statusIcon = "battery-three-quarters";
                this.statusColor = "mediumorchid";
                this.statusPopover = "Server's health good";
                break;
            default:
                this.statusIcon = "battery-full";
                this.statusColor = "gold";
                this.statusPopover = "Server's health great";
                break;
        }
    }

    createdTimeStr: string = "NaN";
    timePopover: string = "Not found any data";
    dataTransferConvert: number;
    dataTransferUnit: string = "Kb";
    dataTransferConverted: string;

    initDataShow(server: Server) {
        let date = new Date(server.created_time * 1000);
        this.createdTimeStr = date.toLocaleString();
        this.timePopover = date.toUTCString();

        this.dataTransferConverted = this.utilsFunc.dataTransferToString(
            server.data_transfer
        );
    }

    onUserRowSelect(event: any, dialog: TemplateRef<any>) {
        try {
            this.dialogService.open(dialog, {
                context: { content: event.data.content, name: event.data.name },
            });
        } catch (error) {
            this.dialogService.open(ErrorHandlerDialogComponent, {
                context: {
                    title: "Error",
                    description: "Error: " + error,
                    showRetry: false,
                },
            });
        }
    }

    onSaveClick(
        dialog: NbDialogRef<any>,
        data: { content: string; name: string }
    ) {
        if (!!data) {
            try {
                const content = atob(data.content);
                const blob = new Blob([content], {
                    type: "text/plain;charset=utf-8",
                });
                saveAs(blob, data.name + ".ovpn");
            } catch (error) {
                this.dialogService.open(ErrorHandlerDialogComponent, {
                    context: {
                        title: "Error",
                        description: "Error: " + error,
                        showRetry: false,
                    },
                });
            }
        }
        dialog.close();
    }

    ngOnDestroy(): void {
        if (!!this.clientDataObs) {
            this.clientDataObs.unsubscribe();
        }

        if (!!this.profileDataObs) {
            this.profileDataObs.unsubscribe();
        }
    }
}
