import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbPopoverModule, NbSelectModule, NbTabsetModule, NbButtonModule, NbDatepickerModule, NbStepperModule, NbFormFieldModule, NbAutocompleteModule, NbCalendarRangeModule, NbSidebarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster'
import { ClientsLocationMapComponent } from './maps/clients-location-map/clients-location-map.component';
import { FlagNameLocationComponent } from './flag-name-location/flag-name-location.component';
import { NumberFilterComponent } from './tables/number-filter/number-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogDeleteProfileComponent } from './dialogs/dialog-delete-profile/dialog-delete-profile.component';
import { ServerDetailsComponent } from './server-detail/server-detail.component';
import { ServerInfoComponent } from './server-info/server-info.component';
import { ServerOverviewComponent } from './server-overview/server-overview.component';
import { RegionInfoComponent } from './region-info/region-info.component';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { ChartDataTransferComponent } from './charts/chart-line.component';
import { ChartsPieComponent } from './charts/chart-pie.component';
import { ChartAreaComponent } from './charts/chart-area.component';
import { ChartResourcesGaugeComponent } from './charts/chart-resource-gauge.component';
import { ServerStatusComponent } from './server-status/server-status.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { SaveReportWindowFormComponent } from './windows/save-report/save-report.component';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { AnimatedDigitDirective } from './directives/animated-digit.directive';
import { FadeInOutDirective } from './directives/fade-in-out.directive';
import { AutoCompleteFilterComponent } from './tables/auto-complete/auto-complete.component';
import { InputStringFilterComponent } from './tables/input-string/input-string.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { FloatingButtonComponent } from './floating-button/floatting-button.component';
import { ErrorHandlerDialogComponent } from './dialogs/error-handler/error-handler.component';
import { OAuth2CallbackComponent } from './auth/callback/callback.component';

const VolioComponents = [
    ChartDataTransferComponent, // charts
    ChartsPieComponent,
    ChartAreaComponent,
    ChartResourcesGaugeComponent,
    DialogDeleteProfileComponent, // Dialog
    ErrorHandlerDialogComponent,
    ClientsLocationMapComponent, // maps
    FlagNameLocationComponent, // main
    RegionInfoComponent,
    ServerDetailsComponent,
    ServerInfoComponent,
    ServerOverviewComponent,
    ServerStatusComponent,
    ClientsListComponent,
    StatsCardComponent,
    DateRangeComponent,
    FloatingButtonComponent,
    OAuth2CallbackComponent,
    NumberFilterComponent, // tables
    AutoCompleteFilterComponent,
    InputStringFilterComponent,
    SaveReportWindowFormComponent, // windows
    AnimatedDigitDirective, // directives
    FadeInOutDirective,
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        LeafletModule,
        LeafletMarkerClusterModule,
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
    ],
    declarations: [...VolioComponents],
    exports: [...VolioComponents],
    })

export class VolioComponentsModule {

}
