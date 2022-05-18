import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbPopoverModule, NbSelectModule, NbTabsetModule, NbButtonModule, NbDatepickerModule, NbStepperModule, NbFormFieldModule, NbAutocompleteModule, NbCalendarRangeModule, NbSidebarModule, NbCheckboxModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { FlagNameLocationComponent } from './flag-name-location/flag-name-location.component';
import { NumberFilterComponent } from './tables/number-filter/number-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogDeleteProfileComponent } from './dialogs/dialog-delete-profile/dialog-delete-profile.component';
import { AnimatedDigitDirective } from './directives/animated-digit.directive';
import { FadeInOutDirective } from './directives/fade-in-out.directive';
import { AutoCompleteFilterComponent } from './tables/auto-complete/auto-complete.component';
import { InputStringFilterComponent } from './tables/input-string/input-string.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { FloatingButtonComponent } from './floating-button/floatting-button.component';
import { ErrorHandlerDialogComponent } from './dialogs/error-handler/error-handler.component';
import { OAuth2CallbackComponent } from './auth/callback/callback.component';
import { CheckboxEditorComponent } from './tables/checkbox-editor/checkbox-editor.component';
import { CheckboxCellComponent } from './tables/checkbox-cell/checkbox-cell.component';
import { UploaderWindowComponent } from './windows/uploader-window/uploader-window.component';
import { MenuContextComponent } from './menu-context/menu-context.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDateFnsDateModule } from '@nebular/date-fns';

const VolioComponents = [
    DialogDeleteProfileComponent, // Dialog
    ErrorHandlerDialogComponent,
    FlagNameLocationComponent, // main
    DateRangeComponent,
    FloatingButtonComponent,
    OAuth2CallbackComponent,
    NumberFilterComponent, // tables
    CheckboxCellComponent,
    CheckboxEditorComponent,
    AutoCompleteFilterComponent,
    InputStringFilterComponent,
    AnimatedDigitDirective, // directives
    FadeInOutDirective,
    MenuContextComponent, // menu
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        NbCardModule,
        NbIconModule,
        NbAccordionModule,
        NbEvaIconsModule,
        NgxEchartsModule,
        NbPopoverModule,
        Ng2SmartTableModule,
        NbTabsetModule,
        NbSelectModule,
        NbDialogModule.forRoot(),
        NbInputModule,
        NbButtonModule,
        NbDatepickerModule,
        NbStepperModule,
        NbFormFieldModule,
        NbDateFnsDateModule,
        NbAutocompleteModule,
        NbCalendarRangeModule,
        NbSidebarModule,
        NbCheckboxModule,
    ],
    declarations: [...VolioComponents, UploaderWindowComponent, MenuContextComponent],
    exports: [...VolioComponents],
    })

export class VolioComponentsModule {

}
