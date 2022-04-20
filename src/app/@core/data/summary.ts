import {
    Observable
} from 'rxjs';
import { VolioResponse } from './volio_response';


export interface SummaryStats {
    data_transfer?: number
    data_transfer_avg?: number
    peak_ccu?: number
    peak_max?: number
    region_count?: number
    server_count?: number
    used_count?: number
    used_time?: number
    used_time_avg?: number
}

export interface SummaryChart {
    area_data_transfer?: {label: string[], areas: {location: string, data: number[]}}
    area_peak?: {label: string[], areas: {location: string, data: number[]}}
    clients_distribution?: {name: string, value: number}[]
    line_avg?: {label:string, used_count: number, used_time: number, used_time_avg: number, data_transfer_avg: number}[]
    servers_distribution?: {name: string, value: number}[]
}


export abstract class SummaryData {
    abstract getSummaryStats(): Observable<VolioResponse<SummaryStats>>;
    abstract getSummaryCharts(timeRange?: string, startTime?: number, endTime?: number): Observable< VolioResponse<SummaryChart> >;
    abstract getSummaryFileReport(timeRange?: string, startTime?: number, endTime?: number, fileType?: string): Observable< VolioResponse<string> >;
}
