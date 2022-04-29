/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import {
    NbChatModule,
    NbDatepickerModule,
    NbDialogModule,
    NbIconLibraries,
    NbMenuModule,
    NbSidebarModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
import { AuthGuard } from './pages/volio/auth/guard/auth-guard';
import { VolioAuthInterceptor } from './pages/volio/interceptor/volio-auth-interceptor';
import { VolioComponentsModule } from './pages/volio/volio.module';

@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: VolioAuthInterceptor,
        multi: true,
    }, AuthGuard],

    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        NbChatModule.forRoot({
            messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
        }),
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(iconsLibrary: NbIconLibraries) {
        iconsLibrary.registerFontPack('fa', {
            packClass: 'fa',
            iconClassPrefix: 'fa',
        });
        iconsLibrary.registerFontPack('far', {
            packClass: 'far',
            iconClassPrefix: 'fa',
        });
        iconsLibrary.registerFontPack('ion', {
            iconClassPrefix: 'ion',
        });
    }
}
