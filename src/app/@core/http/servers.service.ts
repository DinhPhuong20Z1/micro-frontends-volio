import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    of as observableOf,
    Observable,
    throwError
} from 'rxjs';
import {
    ServersData,
    Server
} from '../data/servers';
import { environment } from '../../../environments/environment';
import { VolioResponse } from '../data/volio_response';
import { ServerStats, ServerCharts } from '../data/servers';
import { map } from 'rxjs/operators';
@Injectable()
export class ServersService extends ServersData {
    constructor(private httpClient: HttpClient){
        super()
    }

    getServersData(params?: {id?: number, name?: string, ip?: string, region?: string}): Observable< VolioResponse<Server[]> >{
        let url = environment.apiUrl + "/servers/info"
        if (!!params && !!params.id) {
            url += "?id=" + params.id
        } else if (!!params && !!params.name) {
            url +=  "/servers/info?name=" + params.name
        } else if (!!params && !!params.ip) {
            url +=  "/servers/info?ip=" + params.ip
        } else if (!!params && !!params.region) {
            url += "/servers/info?region=" + params.region
        }

        return this.httpClient.get<VolioResponse<Server[]>>(url)
    }

    getServersStat(serverName: string): Observable< VolioResponse<ServerStats> > {
        let url = environment.apiUrl + "/servers/stats?name=" + serverName

        return this.httpClient.get<VolioResponse<ServerStats>>(url).pipe(map(response => {
            if (!!response && !!response.data && !!response.data.clients)
            for (let client of response.data.clients) {
                client.location_code = client.location_code.toLowerCase()
            }
            return response
        }))
    }

    getServersCharts(name: string): Observable< VolioResponse<ServerCharts> > {
        let url = environment.apiUrl + "/servers/charts?name=" + name

        return this.httpClient.get<VolioResponse<ServerCharts>>(url)
    }
}
