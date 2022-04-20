import {
    AfterViewInit,
    Component,
    OnDestroy,
    Input,
    SimpleChanges
} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import { OnChanges } from '@angular/core';

@Component({
    selector: 'ngx-resource-gauge',
    template: `
    <nb-card>
            <nb-card-header>{{chartName}}</nb-card-header>
            <nb-card-body>
            <div echarts [options]="options" [merge]="updateOptions" class="echart"></div>
            </nb-card-body>
        </nb-card>
    `,
})
export class ChartResourcesGaugeComponent implements AfterViewInit,OnChanges, OnDestroy {
    @Input() chartName: string
    @Input() value: string
    @Input() unit: string
    @Input() unitFormatter: string

    themeSubscription: any;
    options: any

    constructor(private theme: NbThemeService) {}

    ngOnInit(): void {
        this.options = {
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
                {
                    name: 'Indicator',
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: "{value}" +this.unitFormatter
                    },
                    data: [
                        {
                            value: this.value,
                            name: this.unit
                        }
                    ]
                }
            ]};
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateOptions = {
            series: [{
                detail: {
                    valueAnimation: true,
                    formatter: "{value}" +this.unitFormatter
                },
                data: [
                    {
                        value: this.value,
                        name: this.unit
                    }
                ]
            }]
        };
    }

    timer: any
    updateOptions: any
    ngAfterViewInit() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const eChart: any = config.variables.echarts;
        });

        // this.timer = setInterval( () =>{
        //     const random = +(Math.random() * 60).toFixed(2);
        //     this.updateOptions = {
        //         series: [{
        //             data: [
        //                 {
        //                     value: random,
        //                     name: this.unit
        //                 }
        //             ]
        //         }]
        //     };

        // }, 2000);
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
        clearInterval(this.timer)
    }
}
