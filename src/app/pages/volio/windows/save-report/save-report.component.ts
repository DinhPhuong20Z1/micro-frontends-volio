import * as XLSX from "xlsx";
import { Component, OnDestroy } from "@angular/core";
import {
    NbDateService,
    NbWindowRef,
    NbCalendarRange,
    NbDialogService,
} from "@nebular/theme";
import { SummaryData } from "../../../../@core/data/summary";
import {
    combineLatest,
    concat,
    merge,
    scheduled,
    Subscription,
    forkJoin,
} from "rxjs";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { saveAs } from "file-saver";
import { ErrorHandlerDialogComponent } from "../../dialogs/error-handler/error-handler.component";

@Component({
    templateUrl: "./save-report.component.html",
    styleUrls: ["save-report.component.scss"],
})
export class SaveReportWindowFormComponent implements OnDestroy {
    timeGroup = "Hour";
    timesGroup = ["Hour", "Day", "Month"];
    formatReport: any;
    timeRange: NbCalendarRange<Date>;
    constructor(
        private summaryService: SummaryData,
        private windowRef: NbWindowRef,
        protected dateService: NbDateService<Date>,
        private dialogService: NbDialogService
    ) {}

    close() {
        this.windowRef.close();
    }

    rangeMax: Date = new Date();
    rangeMin: Date = this.dateService.addDay(this.rangeMax, -3);
    timeGroupChanged(event: any) {
        switch (this.timeGroup) {
            case "Hour":
                this.rangeMax = new Date();
                this.rangeMin = this.dateService.addDay(this.rangeMax, -3);
                break;
            case "Day":
                this.rangeMax = new Date();
                this.rangeMin = this.dateService.addDay(this.rangeMax, -30);
                break;
            case "Month":
                this.rangeMax = new Date();
                this.rangeMin = this.dateService.addMonth(
                    this.rangeMax,
                    -3 * 12
                );
                break;
        }
    }

    filterFn = (date: any) => {
        if (!this.rangeMax || !this.rangeMin) {
            return true;
        }

        if (!date) {
            return false;
        }

        if (date.getTime && date.getTime() < this.rangeMin.getTime()) {
            return false;
        }

        if (date.getTime && date.getTime() > this.rangeMax.getTime()) {
            return false;
        }

        if (
            date.start &&
            date.start.getTime &&
            date.start.getTime() < this.rangeMin.getTime()
        ) {
            return false;
        }

        if (
            date.end &&
            date.end.getTime &&
            date.end.getTime() > this.rangeMax.getTime()
        ) {
            return false;
        }

        return true;
    };

    timePickerChange(event: any) {
        this.timeRange = event.value.timeRange;
    }

    summaryServiceStatsObs: Subscription;
    summaryServiceChartsObs: Subscription;
    saveReport() {
        console.log("timeGroup: ", this.timeGroup);
        console.log("formatReport: ", this.formatReport);
        console.log("timeRange: ", this.timeRange);

        this.summaryService
            .getSummaryFileReport(
                this.timeGroup.toLowerCase(),
                Math.round(this.timeRange.start.getTime() / 1000),
                Math.round(this.timeRange.end.getTime() / 1000),
                this.formatReport
            )
            .subscribe((resp) => {
                if (resp.message == "success") {
                    const content = atob(resp.data);
                    var wb = XLSX.read(resp.data, { type: "base64" });
                    XLSX.writeFile(wb, "report.xlsx");
                } else {
                    this.dialogService.open(ErrorHandlerDialogComponent, {
                        context: {
                            title: "Error",
                            description:
                                "Export data error: " + resp.data.message,
                        },
                    });
                }
            });
    }

    ngOnDestroy(): void {
        if (!!this.summaryServiceStatsObs) {
            this.summaryServiceStatsObs.unsubscribe();
        }

        if (!!this.summaryServiceChartsObs) {
            this.summaryServiceChartsObs.unsubscribe();
        }
    }
}
