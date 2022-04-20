
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoogleOAuthData, Profile } from '../data/google-oauth';

const GoogleURL = `https://www.googleapis.com/oauth2/v2/userinfo`

@Injectable()
export class GoogleOAuthService extends GoogleOAuthData {
    constructor(private httpClient: HttpClient){
        super()
    }

    getProfileData(): Observable<Profile> {
        let url = GoogleURL
        return this.httpClient.get<Profile>(url)
    }
}
