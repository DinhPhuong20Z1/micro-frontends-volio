import {
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Server, ServersData, ServerStats } from '../../../@core/data/servers';
import { AfterViewInit, Input, OnChanges } from '@angular/core';
import { ClientsData, Client } from '../../../@core/data/clients';
import { Subscription } from 'rxjs';


@Component({
    selector: 'ngx-server-overview',
    templateUrl: './server-overview.component.html',
    styleUrls: ['./server-overview.component.scss'],
})
export class ServerOverviewComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() server: Server
    @Input() serverStats: ServerStats
    @Input() clients: Client[]

    makers: { Lat: number, Lng: number } [] = [];
    netInPercent: number = 0;
    netOutPercent: number = 0;

    constructor(private serversService: ServersData, private clientsService: ClientsData) {}

    ngAfterViewInit(): void {
        this.getServerCharts(1000)
    }

    ngOnChanges(): void {
        this.netInPercent = !!(this.server.net_input + this.server.net_output) ? Math.round(100 * this.server.net_input / (this.server.net_input + this.server.net_output)) : 0
        this.netOutPercent = !!(this.server.net_input + this.server.net_output) ? Math.round(100 * this.server.net_output / (this.server.net_input + this.server.net_output)) : 0
        for (const idx in this.clients) {
            this.makers.push({ Lat: this.clients[idx].latitude, Lng: this.clients[idx].longitude })
        }

    }

    clientsDistribution: { label: string[], areas: { location: string, data: number[] } }
    serversDistribution: { label: string[], areas: { location: string, data: number[] } }
    lineAvg: { name: string, value: number } []
    areaDataTransfer: { label: string, used_count: number, used_time: number, used_time_avg: number, data_transfer_avg: number } []
    areaPeakCCU: { name: string, value: number } []
    serversServiceChartsObs: Subscription
    getServerChartsTimeout: NodeJS.Timeout
    getServerCharts(timeout: number) {
        if (!!this.getServerChartsTimeout) {
            clearTimeout(this.getServerChartsTimeout)
        }
        if (!!this.serversServiceChartsObs) {
            this.serversServiceChartsObs.unsubscribe();
        }

        this.getServerChartsTimeout = setTimeout(() => {
            this.serversServiceChartsObs = this.serversService.getServersCharts(this.server.name).subscribe(resp => {
                console.log('ServerOverviewComponent - getServerCharts for server: ', this.server.name, ' resp: ', resp)
                if (!!resp && resp.message === "success" && !!resp.data) {
                    this.clientsDistribution = resp.data.clients_distribution
                    this.serversDistribution = resp.data.servers_distribution
                    this.lineAvg = resp.data.line_avg
                    this.areaDataTransfer = resp.data.area_data_transfer
                    this.areaPeakCCU = resp.data.area_peak
                }
            }, err => {
                console.log("ServerOverviewComponent call getServerCharts error: ", err)
            }, () => {
                this.getServerCharts(15 * 60000)
            })
        }, timeout)
    }

    ngOnDestroy(): void {
        if (!!this.getServerChartsTimeout) {
            clearTimeout(this.getServerChartsTimeout)
        }
        if (!!this.serversServiceChartsObs) {
            this.serversServiceChartsObs.unsubscribe();
        }
    }
}
