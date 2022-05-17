import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraComponent } from './extra.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExtraRoutingModule } from './extra.routing';
import { NbLayoutModule, NbCardModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';



@NgModule({
    declarations: [
        ExtraComponent,
        ChangePasswordComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        NbAuthModule,
        NbInputModule,
        NbButtonModule,
        NbIconModule,
        ExtraRoutingModule,
    ],
})
export class ExtraModule {}
