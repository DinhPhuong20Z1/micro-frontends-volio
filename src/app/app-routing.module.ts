import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'calendar',
    loadChildren: () => import('../../projects/calendar/src/app/pages/home-page/home-page/home-page.component').then(m => m.HomePageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
