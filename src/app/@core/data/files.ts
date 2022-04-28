import { Observable } from 'rxjs';
import { VolioResponse } from './volio_response';
import { HttpResponse, HttpEvent } from '@angular/common/http';

export interface DocumentInfo {
    id: string;
    bucket_name: string;
    name: string;
    type: string;
    parent_id?: string;
    key: string;
    access_hash: string;
    size?: number;
    size_string?: string;
    link_cdn?: string;
    ext?: string;
    mime_type?: string;
    thumb_id?: number;
    link_cdn_thumb?: string;
    ver_source_id: number;
    version?: string;
    game_version?: string;
    attributes?: string;
    owner_id: string;
    deleted?: number;
    created_time: number;
    created_time_string?: string;
    updated_time: number;
    updated_time_string?: string;
}

export abstract class FilesData {
    abstract getAllDocuments(versionID: number): Observable<VolioResponse<DocumentInfo[]>>;
    abstract getAllDocumentsByParent(versionID: number, parentPath: string): Observable<VolioResponse<DocumentInfo[]>> ;

    abstract addFolderData(versionID: number, name: string): Observable<VolioResponse <DocumentInfo[]>>;

    abstract addFile(data: any): Observable<VolioResponse<DocumentInfo>>;
    abstract uploadFileToAWS(data: any, linkUpload: string): Observable<HttpEvent<any>>;
    abstract completeUpload(data: any): Observable<VolioResponse<DocumentInfo[]>>;
}
