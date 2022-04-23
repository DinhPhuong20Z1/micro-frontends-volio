import {
    Observable
} from 'rxjs';
import { VolioResponse } from './volio_response';

export interface AddFolder {
    folder: string;
    version_source_id: number;
}

export abstract class AddFolderData {
    abstract postAddFolderData(name: string): Observable<VolioResponse<AddFolder[]>>;
}
