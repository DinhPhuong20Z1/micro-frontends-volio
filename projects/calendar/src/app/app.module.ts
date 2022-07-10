import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { HomePageComponent } from './home-page/home-page.component';
// import { FooterComponent, HeaderComponent } from 'src/app/@theme/components';
import { ContentComponent } from './@theme/container/content/content/content.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbActionsModule } from '@nebular/theme';
import { FooterComponent } from './@theme/container/footer/footer.component';
import { HeaderComponent } from './@theme/container/header/header.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full',  component: HomePageComponent },
  { path: 'gioi-thieu', component: HomePageComponent },
  { path: 'san-pham', component: HomePageComponent },
  { path: 'hoat-dong', component: HomePageComponent },
  { path: 'thu-vien', component: HomePageComponent },
  { path: 'tuyen-dung', component: HomePageComponent },
  { path: 'tuyen-dung/:id', component: HomePageComponent },
  { path: 'lien-he', component: HomePageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    ContentComponent,
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(APP_ROUTES),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    NbEvaIconsModule,
    NbActionsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }