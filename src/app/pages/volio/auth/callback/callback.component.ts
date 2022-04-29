import { NbDialogService } from "@nebular/theme";
import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import {
    NbAuthResult,
    NbAuthService,
    NbTokenService,
    NbAuthJWTToken,
} from "@nebular/auth";
import { Router } from "@angular/router";
import { takeUntil, map } from "rxjs/operators";
import { AuthsData, AuthToken } from "../../../../@core/data/auth";
import { VolioResponse } from "../../../../@core/data/volio_response";
import { ErrorHandlerDialogComponent } from "../../dialogs/error-handler/error-handler.component";

@Component({
    selector: "ngx-google-oauth2-callback",
    template: `Authenticating...`,
})
export class OAuth2CallbackComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private authService: NbAuthService,
        private tokenService: NbTokenService,
        private router: Router,
        private tokenAuthService: AuthsData,
        private dialogService: NbDialogService,
    ) {
        // Need call swap token
        this.authService
            .authenticate("google")
            .pipe(takeUntil(this.destroy$))
            .subscribe((authResult: NbAuthResult) => {
                console.log("OAuth2CallbackComponent - Result: ", authResult);
                if (authResult.isSuccess()) {
                    this.tokenAuthService
                        .swapToken(authResult.getToken().getValue())
                        .subscribe(
                            (newToken: VolioResponse<AuthToken>) => {
                                console.log("NewToken after swap: ", newToken);
                                if (newToken.message === "error") {
                                    this.dialogService.open(
                                        ErrorHandlerDialogComponent,
                                        {
                                            context: {
                                                title: "Error",
                                                description:
                                                    "Can not swap this token: " +
                                                    newToken.message,
                                                showRetry: false,
                                                okeFunc: () => {
                                                    this.router.navigateByUrl(
                                                        "/auth/login",
                                                    );
                                                },
                                            },
                                        },
                                    );
                                } else if (
                                    !newToken.data ||
                                    !newToken.data.token
                                ) {
                                    this.dialogService.open(
                                        ErrorHandlerDialogComponent,
                                        {
                                            context: {
                                                title: "Error",
                                                description:
                                                    "Not found any token after swap",
                                                showRetry: false,
                                                okeFunc: () => {
                                                    this.router.navigateByUrl(
                                                        "/auth/login",
                                                    );
                                                },
                                            },
                                        },
                                    );
                                } else {
                                    console.log(
                                        "Will set token: ",
                                        newToken.data.token,
                                    );
                                    this.tokenService
                                        .set(
                                            new NbAuthJWTToken(
                                                newToken.data.token,
                                                "email",
                                            ),
                                        )
                                        .subscribe(
                                            () => {
                                                console.log(
                                                    "Was set token ",
                                                    newToken.data.token,
                                                );
                                            },
                                            (err) => {
                                                console.log(
                                                    "Set token failed: ",
                                                    err,
                                                );
                                            },
                                            () => {
                                                this.router.navigateByUrl(
                                                    "/pages/files",
                                                );
                                            },
                                        );
                                }
                            },
                            (err) => {
                                console.log("NewToken after swap error: ", err);
                            },
                        );
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
