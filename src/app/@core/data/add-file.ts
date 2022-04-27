import {
    Observable
} from 'rxjs';
import { VolioResponse } from './volio_response';
import { HttpEvent, HttpResponse } from '@angular/common/http';

export interface addFile {
    name: string;
    mime_type: string;
    file_size: number;
    folder: string;
    ext: string;
    version_source_id: number;
}

export abstract class addFileData {
    abstract postAddFile(data: any): Observable<VolioResponse<addFile>>;
    abstract putAddFileToAWS(data: any, linkUpload: string): Observable<HttpResponse<any>>;
    abstract putCompaleteUpload(data: any): Observable<VolioResponse<addFile[]>>;
}
