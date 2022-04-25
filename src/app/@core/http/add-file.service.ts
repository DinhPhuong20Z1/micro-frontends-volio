import {addFileData , addFile} from '../data/add-file';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VolioResponse } from '../data/volio_response';
import { HttpEvent } from '@angular/common/http';



@Injectable()
export class AddFileService extends addFileData {
    constructor(private httpClient: HttpClient) {
        super();
    }

    postAddFile(data: any): Observable<VolioResponse <addFile>> {
        const url = environment.apiUrl + "/file";

        return this.httpClient.post<VolioResponse<addFile>>(url, data);
    }
    putAddFileToAWS(data: any, linkUpload: string): Observable<HttpResponse<any>> {
        const url = linkUpload ;

        return this.httpClient.put<HttpResponse<any>>(url, data, {observe: 'response'});
    }
    putCompaleteUpload(data: any): Observable<VolioResponse <addFile>> {
        const url = environment.apiUrl + "/file";

        return this.httpClient.put<VolioResponse<addFile>>(url, data);
    }
}
