import { AuthsData, AuthToken } from '../data/auth';
import { Injectable } from '@angular/core';
import { VolioResponse } from '../data/volio_response';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { NbAuthService, NbAuthToken, NbTokenService, NbAuthJWTToken } from '@nebular/auth';
import { Observable, throwError } from 'rxjs';
import { DocumentInfo, FilesData } from '../data/files';
import { NbDialogService } from '@nebular/theme';
import { ErrorHandlerDialogComponent } from '../../pages/volio/dialogs/error-handler/error-handler.component';

@Injectable()
export class FilesService extends FilesData {
    constructor(private httpClient: HttpClient, private dialogService: NbDialogService) {
        super();
    }

    getAllDocumentsByParent(versionID: number, parentPath: string): Observable<VolioResponse<DocumentInfo[]>> {
        if (versionID < 1) {
            this.dialogService.open(ErrorHandlerDialogComponent, {
                context: {
                    title: 'Error',
                    description: "Need choose a version",
                },
            });

            return throwError("not found version for this request");
        }

        const url = environment.apiUrl + "/dir?vid=" + versionID + "&path=" + parentPath;

        return this.httpClient.get<VolioResponse<DocumentInfo[]>>(url);
    }

    getAllDocuments(versionID: number): Observable<VolioResponse<DocumentInfo[]>> {
        if (versionID < 1) {
            this.dialogService.open(ErrorHandlerDialogComponent, {
                context: {
                    title: 'Error',
                    description: "Need choose a version",
                },
            });

            return throwError("not found version for this request");
        }

        const url = environment.apiUrl + "/file?vid=" + versionID;

        return this.httpClient.get<VolioResponse<DocumentInfo[]>>(url);
    }

    addFolder(versionID: number, name: string): Observable<VolioResponse <DocumentInfo[]>> {
        const url = environment.apiUrl + "/dir";

        return this.httpClient.post<VolioResponse<DocumentInfo[]>>(url, {folder: name, ver_source_id: versionID});
    }

    addFile(data: any): Observable<VolioResponse <DocumentInfo>> {
        const url = environment.apiUrl + "/file";

        return this.httpClient.post<VolioResponse<DocumentInfo>>(url, data);
    }

    uploadFileToAWS(linkUpload: string,  fileBinary: any): Observable<HttpEvent<any>> {
        const url = linkUpload ;

        return this.httpClient.request("PUT", url, {body: fileBinary, observe: 'events', reportProgress: true});
        // return this.httpClient.put<HttpEvent<any>>(url, data, {observe: 'response', reportProgress: true});
    }

    completeUpload(data: any): Observable<VolioResponse <DocumentInfo>> {
        const url = environment.apiUrl + "/file";

        return this.httpClient.put<VolioResponse<DocumentInfo>>(url, data);
    }

    deleteFile(versionID: number, key: string): Observable<VolioResponse<any>> {
        const url = environment.apiUrl + "/file";

        return this.httpClient.delete<VolioResponse<any>>(url, {body: {key: key, ver_source_id: versionID}});
    }

    deleteFolder(versionID: number, key: string): Observable<VolioResponse<any>> {
        const url = environment.apiUrl + "/dir";

        return this.httpClient.delete<VolioResponse<any>>(url, {body: {key: key, ver_source_id: versionID}});
    }
}
