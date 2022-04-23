import { AuthsData, AuthToken } from '../data/auth';
import { Injectable } from '@angular/core';
import { VolioResponse } from '../data/volio_response';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NbAuthService, NbAuthToken, NbTokenService, NbAuthJWTToken } from '@nebular/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthsService extends AuthsData {
    constructor(private httpClient: HttpClient, private authTokenService: NbTokenService) {
        super();
    }

    swapToken(swapToken: string): Observable<VolioResponse<AuthToken>> {
        console.log('swapToken123', swapToken);
        const url = environment.apiUrl + "/auth/swap";
        return this.httpClient.get<VolioResponse<AuthToken>>(url, {headers: {"Authorization": "Bearer " + swapToken}});
    }
}
