import { FilesComponent, FsIconComponent } from "./files/files.component";
import { NgModule } from "@angular/core";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages.routing";
import {
    NbCardModule,
    NbMenuModule,
    NbTreeGridModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbSelectModule,
    NbContextMenuModule,
    NbLayoutModule,
    NbProgressBarModule,
    NbSpinnerModule,
} from "@nebular/theme";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { ProfileComponent } from "./profile/profile.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { VersionsComponent } from './versions/versions.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbAutocompleteModule } from '@nebular/theme';

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
        NbEvaIconsModule,
        NbIconModule,
        NbProgressBarModule,
        NbListModule,
        NbSelectModule,
        NbContextMenuModule,
        NbLayoutModule,
        Ng2SmartTableModule,
        NbAutocompleteModule,
        NbSpinnerModule,
    ],
    declarations: [
        PagesComponent,
        ProfileComponent,
        FsIconComponent,
        FilesComponent,
        FsIconComponent,
        VersionsComponent,
    ],
})
export class PagesModule {}
