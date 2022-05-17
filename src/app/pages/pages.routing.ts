import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { FilesComponent } from './files/files.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from './volio/auth/guard/auth-guard';
import { OAuth2CallbackComponent } from './volio/auth/callback/callback.component';
import { VersionsComponent } from './versions/versions.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [{
            path: 'profile',
            component: ProfileComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'versions',
            component: VersionsComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'files',
            component: FilesComponent,
            canActivate: [AuthGuard],
        },
        {
            path: "callback",
            component: OAuth2CallbackComponent,
        },
        {
            path: '',
            redirectTo: 'versions',
            pathMatch: 'full',
        },
        {
            path: '**',
            component: NotFoundComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
