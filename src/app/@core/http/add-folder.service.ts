import {AddFolderData ,AddFolder} from '../data/add-folder';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VolioResponse } from '../data/volio_response';



@Injectable()
export class AddFolderService extends AddFolderData {
    constructor(private httpClient: HttpClient){
        super()
    }

    postAddFolderData(name: string): Observable<VolioResponse <AddFolder[]>>{
        let url = environment.apiUrl + "/folder"

        return this.httpClient.post<VolioResponse<AddFolder[]>>(url,{folder: name, version_source_id: 1})
    }
}
