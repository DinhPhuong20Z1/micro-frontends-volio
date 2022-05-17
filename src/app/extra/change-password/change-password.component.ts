import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthResult, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { ErrorHandlerDialogComponent } from '../../pages/volio/dialogs/error-handler/error-handler.component';
import { AuthsService } from '../../@core/http/auth.service';
import { AuthsData, UserTokenPassword, AuthToken } from '../../@core/data/auth';
import { VolioResponse } from '../../@core/data/volio_response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'ngx-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    redirectDelay: number = 0;
    showMessages: any = {};
    strategy: string = '';

    submitted = false;
    errors: string[] = [];
    messages: string[] = [];
    user: UserTokenPassword = {};

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.user.token = params['token'];
            if (!this.user.token) {
                this.submitted = false;
                this.errors = ["Your link is invalid, try again"];
            }
        });
    }

    constructor(protected authService: AuthsData,
        protected cd: ChangeDetectorRef,
        protected router: Router,
        private route: ActivatedRoute,
        private dialogService: NbDialogService) {
        this.strategy = 'email';
        this.redirectDelay = 500;
        this.showMessages = {
            success: true,
            error: true,
        };
    }

    changePassword(): void {
        this.errors = this.messages = [];
        this.submitted = true;
        if (!this.user.token) {
            this.dialogService.open(ErrorHandlerDialogComponent, {
                context: {
                    title: 'Error',
                    description: "Your link is invalid",
                    showRetry: false,
                },
            });
        }

        this.authService.changePassword(this.user).subscribe((response: VolioResponse<any>) => {
            this.submitted = false;
            if (response.message === "success") {
                this.messages = ["Your password was changed"];
            } else {
                this.errors = [response.data.message];
            }

            setTimeout(() => {
                return this.router.navigateByUrl("/auth/login");
            }, this.redirectDelay);

            this.cd.detectChanges();
        }, (err: HttpErrorResponse) => {
            this.errors = [err.error.data.message];
            this.submitted = false;
            this.cd.detectChanges();
        });
    }
}
