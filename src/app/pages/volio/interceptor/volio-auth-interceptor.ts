import { Injectable, Component, OnDestroy } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NbTokenService } from '@nebular/auth';
import { ErrorHandlerDialogComponent } from '../dialogs/error-handler/error-handler.component';
import { NbDialogService } from '@nebular/theme';
import { throwError, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { VolioResponse } from '../../../@core/data/volio_response';
@Injectable()
export class VolioAuthInterceptor implements HttpInterceptor, OnDestroy {
    token: any;
    tokenString: string;
    tokenSubscription: Subscription;
    tokenChangeSubscription: Subscription;
    constructor(private router: Router, private authService: NbTokenService, private dialogService: NbDialogService) {
        this.tokenSubscription = this.authService.get().subscribe(token => {
            this.token = token;
        });
        this.tokenChangeSubscription = this.authService.tokenChange().subscribe(token => {
            this.token = token;
        });
    }

    intercept(req: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
        if ((req.url.indexOf('/auth/login') < 0 && req.url.indexOf('amazonaws.com') < 0) || req.url.indexOf('/auth/swap') >= 0) {
            req = req.clone({ headers: req.headers.set('App', "JacaSource") });
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + (this.token.token.access_token ? this.token.token.access_token : this.token.toString())) });
        }

        return next.handle(req).pipe(map((response:  any) => {
            if (response.body != null && response.body.message === 'error') {
                this.dialogService.open(ErrorHandlerDialogComponent, {
                    context: {
                        title: 'Error',
                        description: response.body.data.message,
                        showRetry: false,
                    },
                });
                throw new Error(response.body.data.message);
            }

            return response;
        }), catchError((response) => {
            if (req.headers.get("error-handler") === "no") {
                throw(response);
            } else if (req.url.indexOf('/auth/') < 0) {
                if (!response.error.data) {
                    this.dialogService.open(ErrorHandlerDialogComponent, {
                        context: {
                            title: 'Error',
                            description: "Please check you connection",
                        },
                    });
                } else if (response.error.status === 403) {
                    this.dialogService.open(ErrorHandlerDialogComponent, {
                        context: {
                            title: 'Error',
                            description: "You need login to access this resource",
                            showRetry: false,
                            okeFunc: () => {
                                this.router.navigateByUrl(
                                    "/auth/login",
                                );
                            },
                        },
                    });
                } else {
                    this.dialogService.open(ErrorHandlerDialogComponent, {
                        context: {
                            title: 'Error',
                            description: "Can not execute request: " + response.error.data.message,
                        },
                    });
                }
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
