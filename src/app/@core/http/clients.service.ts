import { VolioResponse } from './../data/volio_response';
import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { Client, ClientsData } from '../data/clients';
import { of as observableOf, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { time } from 'console';

@Injectable()
export class ClientsService extends ClientsData {
    constructor(private httpClient: HttpClient){
        super()
    }

    getClientsData(server?: string): Observable< VolioResponse<Client[]> > {
        let url = environment.apiUrl + "/clients/info"
        if (!!server) {
            url += "?server=" + server
        }

        return this.httpClient.get<VolioResponse<Client[]>>(url).pipe(map(response => {
            let timeNow = Math.floor(Date.now() / 1000);
            for (let client of response.data) {
                let r: number = +client.bytes_received;
                let s: number = +client.bytes_sent;
                client.online_time = timeNow - client.connected_time
                client.data_transfer = r+s
                client.location_code = client.location_code.toLowerCase()
            }
            return response
        }))
    }
}
