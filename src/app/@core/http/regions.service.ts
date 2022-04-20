import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegionsData, Region } from '../data/regions';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VolioResponse } from '../data/volio_response';


@Injectable()
export class RegionsService extends RegionsData {
    constructor(private httpClient: HttpClient){
        super()
    }

    getRegionsData(): Observable < VolioResponse<Region[]> > {
        let url = environment.apiUrl + "/regions/info"

        return this.httpClient.get<VolioResponse<Region[]>>(url)
    }
}
