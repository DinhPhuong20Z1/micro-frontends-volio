import { Observable } from 'rxjs';
export interface Profile {
    id: string
    email: string
    verified_email: string
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
    hd: string
}

export abstract class GoogleOAuthData {
    abstract getProfileData(): Observable<Profile>
}
