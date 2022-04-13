import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { FilesComponent } from './files/files.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [{
            path: 'profile',
            component: ProfileComponent,
        },
        {
            path: 'files',
            component: FilesComponent,
        },
        {
            path: '',
            redirectTo: 'files',
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
