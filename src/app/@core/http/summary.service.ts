import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable,} from 'rxjs';
import { environment } from '../../../environments/environment';
import { VolioResponse } from '../data/volio_response';
import { SummaryChart, SummaryStats, SummaryData } from '../data/summary';
@Injectable()
export class SummaryService extends SummaryData {
    constructor(private httpClient: HttpClient){
        super()
    }

    getSummaryStats(): Observable<VolioResponse<SummaryStats>>{
        let url = environment.apiUrl + "/summary/stats"
        return this.httpClient.get<VolioResponse<SummaryStats>>(url)
    }

    getSummaryCharts(timeRange?: string, startTime?: number, endTime?: number): Observable< VolioResponse<SummaryChart> > {
        if (startTime > endTime) {
            const tmp = startTime
            startTime = endTime
            endTime = tmp
        }

        let url = environment.apiUrl + "/summary/charts?type=" + timeRange + "&start=" + startTime + "&end=" + endTime

        return this.httpClient.get<VolioResponse<SummaryChart>>(url)
    }

    getSummaryFileReport(timeRange?: string, startTime?: number, endTime?: number, fileType?: string): Observable< VolioResponse<string> > {
        if (startTime > endTime) {
            const tmp = startTime
            startTime = endTime
            endTime = tmp
        }

        let url = environment.apiUrl + "/summary/file?type=" + timeRange + "&start=" + startTime + "&end=" + endTime + "&file=" + fileType

        return this.httpClient.get<VolioResponse<SummaryChart>>(url)
    }
}
