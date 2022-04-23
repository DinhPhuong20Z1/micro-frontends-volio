import { Observable } from 'rxjs';
import { VolioResponse } from './volio_response';
export interface VersionSource {
    id: number;
    version: string;
    game_version: string;
    description?: string;
    is_newest?: boolean;
    created_time?: number;
    updated_time?: number;
}

export abstract class VersionSourceData {
    abstract GetAllVersions(): Observable<VolioResponse<VersionSource[]>>;
    abstract CreateVersion(data: VersionSource): Observable<VolioResponse<VersionSource>>;
    abstract UpdateVersion(data: VersionSource): Observable<VolioResponse<VersionSource>>;
}
