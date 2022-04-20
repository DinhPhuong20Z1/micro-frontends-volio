import { Observable } from 'rxjs';
import { VolioResponse } from './volio_response';

export interface AuthToken {
    token: string;
    refresh_token?: string;
}

export abstract class  AuthsData {
    abstract swapToken(swapToken: string): Observable<VolioResponse<AuthToken>>
}
