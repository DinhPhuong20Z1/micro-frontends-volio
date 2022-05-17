import { Routes, RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';

import { ExtraComponent } from './extra.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';

const routes: Routes = [{
    path: '',
    component: ExtraComponent,
    children: [
        {
            path: 'change-password',
            component: ChangePasswordComponent,
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
export class ExtraRoutingModule {}
