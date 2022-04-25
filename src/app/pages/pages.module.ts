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
} from "@nebular/theme";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { ProfileComponent } from "./profile/profile.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { InfiniteListComponent } from "./infinite-list/infinite-list.component";
import { NewsService } from "./news.service";
import { NewsPostComponent } from "./infinite-list/news-post/news-post.component";
import { AddFolderComponent } from './files/components/add-folder/add-folder.component';
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
        NbListModule,
        NbSelectModule,
        NbContextMenuModule,
        NbLayoutModule,
        Ng2SmartTableModule,
        NbAutocompleteModule,
    ],
    declarations: [
        PagesComponent,
        ProfileComponent,
        FsIconComponent,
        FilesComponent,
        FsIconComponent,
        InfiniteListComponent,
        NewsPostComponent,
        AddFolderComponent,
        VersionsComponent,
    ],
    providers: [NewsService],
})
export class PagesModule {}
