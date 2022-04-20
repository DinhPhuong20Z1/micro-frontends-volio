import { AfterViewInit, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { UtilsFunc } from '../../../@core/data/utils';

@Component({
    selector: 'ngx-chart-area',
    template: `
    <nb-card>
        <nb-card-header>
            {{chartName}}
        </nb-card-header>
        <nb-card-body>
            <div echarts [options]="options" class="echart"></div>
        </nb-card-body>
    </nb-card>`,
    styleUrls: ['./chart-option.component.scss']
})
export class ChartAreaComponent implements OnChanges, OnDestroy {
    @Input() chartName: string;
    @Input() data: {label: string[], areas: {location: string, data: number[]}[]}

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService, private utilsFunc: UtilsFunc) {
        this.initAreaData()
    }

    legend: string[] = []
    label: string[] = []
    thisMaxData: number
    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.data && !!this.data.label && !!this.data.areas) {
            this.label = this.data.label
            for (let area of this.data.areas) {
                const country = this.utilsFunc.findLocations(area.location)
                area.location = !!country?country.name:area.location
                this.legend.push(area.location)
            }
            this.initAreaData()
        }
    }

    initAreaData() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;

            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: echarts.tooltipBackgroundColor,
                        },
                    },
                },
                legend: {
                    data: this.legend,
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: this.label,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLine: {
                        lineStyle: {
                            color: echarts.axisLineColor,
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: echarts.textColor,
                        },
                    },
                }, ],
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: echarts.axisLineColor,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: echarts.splitLineColor,
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: echarts.textColor,
                        },
                    },
                }, ],
                series: [
                    {
                        name: 'AF',
                        type: 'line',
                        stack: 'Total amount',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: echarts.textColor,
                                },
                            },
                        },
                        areaStyle: {
                            normal: {
                                opacity: echarts.areaOpacity
                            }
                        },
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                    },
                ],
            };
        });

        if (!!this.data) {
            this.options.series = []
            for(let area of this.data.areas) {
                let data = []
                for (let d of area.data ) {
                    if (d<0) {
                        data.push(d*-1)
                    } else {
                        data.push(d)
                    }
                }
                this.options.series.push({
                    name: area.location,
                    type: 'line',
                    stack: 'Total amount',
                    areaStyle: {
                        normal: {
                            opacity: echarts.areaOpacity
                        }
                    },
                    data: data,
                })
            }
        }
    }

    ngOnDestroy(): void {
        if (!!this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
