import { AfterViewInit, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { UtilsFunc } from '../../../@core/data/utils';

@Component({
    selector: 'ngx-pie',
    template: `
    <nb-card>
        <nb-card-header>
            {{chartName}}
        </nb-card-header>
        <nb-card-body>
            <div echarts [options]="options" class="echart"></div>
        </nb-card-body>
    </nb-card>
    `,
    styleUrls: ['./chart-option.component.scss']
})
export class ChartsPieComponent implements OnChanges, OnDestroy {
    @Input() chartName: string;
    @Input() data: {name: string, value: number}[]

    options: any = {};
    themeSubscription: any;

    legend: string[]
    seriesData: {name:string, value: number}[]

    constructor(private theme: NbThemeService, private utilsFunc: UtilsFunc) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.data) {
            this.legend = []
            for (const d of this.data) {
                const country = this.utilsFunc.findLocations(d.name)
                !!country?d.name = country.name:d.name=d.name
                this.legend.push(d.name)

            }
        }

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors = config.variables;
            const echarts: any = config.variables.echarts;

            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.legend,
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                series: [{
                    name: 'Countries',
                    type: 'pie',
                    radius: '80%',
                    center: ['50%', '50%'],
                    data: this.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: echarts.itemHoverShadowColor,
                        },
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: echarts.axisLineColor,
                            },
                        },
                    },
                }, ],
            };
        });
    }

    ngOnDestroy(): void {
        if (!!this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
