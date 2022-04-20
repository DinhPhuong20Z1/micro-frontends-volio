import { Server } from './servers';
import {
    Observable
} from 'rxjs';
import { VolioResponse } from './volio_response';

export interface Region {
    location: string;
    location_code: string;
    clients_count?: number;
    used_count?: number;
    used_time?: number;
    data_transfer?: number; // Kb
    servers?: Server[];
}

export abstract class RegionsData {
    abstract getRegionsData(): Observable < VolioResponse<Region[] >>;
}
