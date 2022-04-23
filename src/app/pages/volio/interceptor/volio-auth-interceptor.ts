import { Injectable, Component, OnDestroy } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { NbTokenService } from '@nebular/auth';
import { ErrorHandlerDialogComponent } from '../dialogs/error-handler/error-handler.component';
import { NbDialogService } from '@nebular/theme';
import { throwError, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class VolioAuthInterceptor implements HttpInterceptor, OnDestroy {
    token: any;
    tokenString: string;
    tokenSubscription: Subscription;
    tokenChangeSubscription: Subscription;
    constructor(private authService: NbTokenService, private dialogService: NbDialogService) {
        this.tokenSubscription = this.authService.get().subscribe(token => {
            this.token = token;
        });
        this.tokenChangeSubscription = this.authService.tokenChange().subscribe(token => {
            this.token = token;
        });
    }

    intercept(req: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
        if (req.url.indexOf('/auth/login') < 0 || req.url.indexOf('/auth/swap') >= 0) {
            req = req.clone({ headers: req.headers.set('App', "JacaSource") });
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + (this.token.token.access_token ? this.token.token.access_token : this.token.toString())) });
        }

        return next.handle(req).pipe(catchError((response) => {
            console.log("intercept: ", response.error);

            if (req.url.indexOf('/auth/') < 0) {
                this.dialogService.open(ErrorHandlerDialogComponent, {
                    context: {
                        title: 'Error',
                        description: "Can not execute request: " + response.error.data.message,
                    },
                });
            }

            return throwError(response);
        })); // .pipe(rateLimit(20, 15000));
    }

    ngOnDestroy() {
        if (!!this.tokenSubscription) {
            this.tokenSubscription.unsubscribe();
        }
        if (!!this.tokenChangeSubscription) {
            this.tokenChangeSubscription.unsubscribe;
        }
    }
}
