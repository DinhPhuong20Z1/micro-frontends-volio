import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
    NbAuthComponent,
    NbLoginComponent,
    NbLogoutComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';
import { OAuth2CallbackComponent } from './pages/volio/auth/callback/callback.component';

export const routes: Routes = [
    {
        path: 'calendar',
        loadChildren: () => import('../../projects/calendar/src/app/app.module').then(m => m.AppModule)
      },
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module')
            .then(m => m.PagesModule),
    },
    {
        path: 'extra',
        loadChildren: () => import('./extra/extra.module')
            .then(m => m.ExtraModule),
    },
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [{
                path: '',
                component: NbLoginComponent,
            },
            {
                path: 'callback',
                component: OAuth2CallbackComponent,
            },
            {
                path: 'login',
                component: NbLoginComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
    useHash: false,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
