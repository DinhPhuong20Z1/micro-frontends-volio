import { VolioResponse } from './volio_response';
import { Observable } from 'rxjs';

export interface Client {
    client_id: string;
    peer_id: string;
    common_name: string;
    username: string;
    hostname?: string;
    real_ip: string;
    location: string;
    location_code: string;
    latitude?: number;
	longitude?: number;
    server_name: string;
    virtual_ip: string;
    bytes_received?: string;
    bytes_sent?: string;
    data_transfer?: number;
    connected_at?: string;
    connected_time: number; // seconds UTC
    last_ping_at?: string;
    last_ping_time?: number; // seconds UTC
    online_time?: number; // seconds UTC
}

export abstract class ClientsData {
    abstract getClientsData(server?: string): Observable< VolioResponse<Client[]> >;
}
