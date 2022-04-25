import { AuthsData, AuthToken } from '../data/auth';
import { Injectable } from '@angular/core';
import { VolioResponse } from '../data/volio_response';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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
}
