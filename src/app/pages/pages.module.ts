import { FilesComponent } from './files/files.component';
import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages.routing';
import { NbCardModule, NbMenuModule, NbTreeGridModule, NbFormFieldModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        ReactiveFormsModule,
        NbFormFieldModule,
        NbInputModule,
        NbButtonModule,
        FormsModule,
        NbIconModule,
        NbCardModule,
        NbTreeGridModule,
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        MiscellaneousModule,
    ],
    declarations: [
        PagesComponent,
        ProfileComponent,
        FilesComponent,
    ],
})
export class PagesModule {}
