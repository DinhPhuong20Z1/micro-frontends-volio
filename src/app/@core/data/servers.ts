import {
    Observable
} from 'rxjs';
import { Client } from './clients';
import { VolioResponse } from './volio_response';


export interface Server {
    id: number;
    location: string;
    location_code: string;
    name: string;
    ip: string;
    local_ip: string;
    cpu?: number;
    ram?: number;
    cpu_percent?: number;
	ram_percent?: number;
	net_input?: number;
	net_output?: number;
    type: string; // OpenVPN, EtherVPN,...
    status?: number; // 0 - offline, 1 - bad, 2 - normal, 3 - good, 4 - great
    used_count?: number;
    used_time?: number;
    data_transfer?: number;
    created_time: number; // seconds UTC
    updated_time?: number; // seconds UTC
}

export interface ServerStats {
    profiles?: any
    clients?: Client[]

    peak_max?: number

    used_count?: number
    used_time?: number
    used_time_avg?: number
    data_transfer?: number
    data_transfer_avg?: number
}

export interface ServerCharts {
    area_data_transfer?: {label: string[], areas: {location: string, data: number[]}}
    area_peak?: {label: string[], areas: {location: string, data: number[]}}
    clients_distribution?: {name: string, value: number}[]
    line_avg?: {label:string, used_count: number, used_time: number, used_time_avg: number, data_transfer_avg: number}[]
    servers_distribution?: {name: string, value: number}[]
}

export abstract class ServersData {
    abstract getServersData(params?: {id?: number, name?: string, ip?: string, region?: string}): Observable< VolioResponse<Server[]> >;
    abstract getServersStat(name: string): Observable< VolioResponse<ServerStats> >;
    abstract getServersCharts(name: string): Observable< VolioResponse<ServerCharts> >
}
