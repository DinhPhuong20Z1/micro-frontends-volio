import {
    Observable,
} from 'rxjs';

export interface VPNProfile {
    id: number;
    server_id?: number; // (hubName/?)username
    name?: string;
    username: string;
    password?: string;
    content: string; // base64
    used_count: number;
    limit_used_count?: number;
    used_time: number;
    limit_used_time?: number;
    data_transfer: number;
    limit_data_transfer?: number;
    created_time: number; // seconds UTC
    expires_time?: number; // seconds UTC
}

export abstract class VPNProfilesData {
    abstract getVPNProfilesData(): Observable <VPNProfile[] > ;
}
