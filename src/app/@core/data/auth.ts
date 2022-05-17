import { Observable } from 'rxjs';
import { VolioResponse } from './volio_response';

export interface AuthToken {
    token: string;
    refresh_token?: string;
}

export interface UserTokenPassword {
    token?: string;
    new_password?: string;
    confirm_new_password?: string;
}

export abstract class  AuthsData {
    abstract changePassword(user: UserTokenPassword): Observable<VolioResponse<AuthToken>>;
    abstract swapToken(swapToken: string): Observable<VolioResponse<AuthToken>>;
}
