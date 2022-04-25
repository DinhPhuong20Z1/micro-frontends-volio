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
    abstract getAllVersions(): Observable<VolioResponse<VersionSource[]>>;
    abstract createVersion(data: VersionSource): Observable<VolioResponse<VersionSource>>;
    abstract updateVersion(data: VersionSource): Observable<VolioResponse<VersionSource>>;
}
