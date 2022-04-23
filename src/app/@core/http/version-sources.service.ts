import { Observable } from 'rxjs';
import { VersionSource, VersionSourceData } from '../data/version_source';
import { VolioResponse } from '../data/volio_response';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VersionSourcesService extends VersionSourceData {
    constructor(private httpClient: HttpClient) {
        super();
    }

    GetAllVersions(): Observable<VolioResponse<VersionSource[]>> {
        const url = environment.apiUrl + "/version";

        return this.httpClient.get<VolioResponse<VersionSource[]>>(url);
    }

    CreateVersion(data: VersionSource): Observable<VolioResponse<VersionSource>> {
        const url = environment.apiUrl + "/version";

        return this.httpClient.post<VolioResponse<VersionSource>>(url, data);
    }

    UpdateVersion(data: VersionSource): Observable<VolioResponse<VersionSource>> {
        const url = environment.apiUrl + "/version";

        return this.httpClient.put<VolioResponse<VersionSource>>(url, data);
    }
}
