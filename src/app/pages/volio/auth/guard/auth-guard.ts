import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NbTokenService, NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private tokenService: NbTokenService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.tokenService.get().pipe(map((token: NbAuthJWTToken)=>{
            if (token.isValid()) {
                return true;
            }

            this.router.navigate(['/page/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }))
    }
}
