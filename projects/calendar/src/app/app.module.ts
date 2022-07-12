import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
// import { FooterComponent, HeaderComponent } from 'src/app/@theme/components';
import { ContentComponent } from './@theme/container/content/content/content.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbActionsModule } from '@nebular/theme';
import { FooterComponent } from './@theme/container/footer/footer.component';
import { HeaderComponent } from './@theme/container/header/header.component';
import { HomePageComponent } from './pages/home-page/home-page/home-page.component';
import { IntroducePageComponent } from './pages/introduce-page/introduce-page/introduce-page.component';
import { ProductPageComponent } from './pages/product-page/product-page/product-page.component';
import { ActivityPageComponent } from './pages/activity/activity-page/activity-page.component';
import { LibraryPageComponent } from './pages/library-page/library-page/library-page.component';
import { RecruitPageComponent } from './pages/recruit-page/recruit-page/recruit-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { LoginComponent } from './pages/login/login.component';
import { PartnerComponent } from './pages/home-page/home-page/components/partner/partner.component';
import { RecruitmentComponent } from './pages/home-page/home-page/components/recruitment/recruitment.component';
import { OrientationComponent } from './pages/introduce-page/introduce-page/components/orientation/orientation/orientation.component';
import { LeaderComponent } from './pages/introduce-page/introduce-page/components/leader/leader.component';
import { TimeLineComponent } from './pages/introduce-page/introduce-page/components/time-line/time-line.component';
import { PostRecruitPageComponent, DialogRecruitPage } from './pages/recruit-page//components/post-recruit-page/post-recruit-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from '../material.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './@core/service/data.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full',  component: HomePageComponent },
  { path: 'gioi-thieu', component: IntroducePageComponent },
    { path: 'san-pham', component: ProductPageComponent },
    { path: 'hoat-dong', component: ActivityPageComponent },
    { path: 'thu-vien', component: LibraryPageComponent },
    { path: 'tuyen-dung', component: RecruitPageComponent },
    { path: 'tuyen-dung/:id', component: PostRecruitPageComponent },
    { path: 'lien-he', component: ContactPageComponent },
    { path: 'login', pathMatch: 'full', component: LoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,

        HeaderComponent,
        FooterComponent,
        HomePageComponent,
        RecruitmentComponent,
        PartnerComponent,
        IntroducePageComponent,
        ContentComponent,
        OrientationComponent,
        LeaderComponent,
        TimeLineComponent,
        ProductPageComponent,
        ActivityPageComponent,
        RecruitPageComponent,
        LibraryPageComponent,
        PostRecruitPageComponent,
        DialogRecruitPage,
        ContactPageComponent,
        LoginComponent,

  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(APP_ROUTES),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    NbEvaIconsModule,
    NbActionsModule,
    CarouselModule,
    HttpClientModule,
    MaterialExampleModule,
    NgImageSliderModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
