import {
    Component,
    AfterViewInit,
    OnDestroy,
    Input,
    SimpleChanges
} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import { OnChanges } from '@angular/core';

@Component({
    selector: 'ngx-chart-line',
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

export class ChartDataTransferComponent implements OnChanges, OnDestroy {
    @Input() chartName: string
    @Input() data: {label: string, used_count: number, used_time_avg: number, data_transfer_avg: number}[]

    options: any = {};
    themeSubscription: any;

    constructor(private theme: NbThemeService) {
        this.initLineData()
    }

    legend: string[] = []
    usedCount: number[] = []
    usedTimeAvg: number[] = []
    dataTransfer: number[] = []

    ngOnChanges(changes: SimpleChanges): void {
        if (!!this.data) {
            this.legend = []
            for (const d of this.data) {
                this.legend.push(d.label)
                this.usedCount.push(!!d.used_count?d.used_count:0)
                this.usedTimeAvg.push(!!d.used_time_avg?d.used_time_avg:0)
                this.dataTransfer.push(!!d.data_transfer_avg?Math.round(d.data_transfer_avg/(1024*1024)):0)
            }

            this.initLineData()
        }
    }

    initLineData() {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
            const colors: any = config.variables;
            const echarts: any = config.variables.echarts;

            this.options = {
                backgroundColor: echarts.bg,
                color: [colors.success, colors.info, colors.warning],
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross',
                    },
                },
                legend: {
                    data: ['DataTransferAvg', 'TimeUsedAvg', 'UsedCount'],
                    textStyle: {
                        color: echarts.textColor,
                    },
                },
                grid: {
                    top: 70,
                    bottom: 50,
                },
                xAxis: [{
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true,
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors.info,
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: echarts.textColor,
                            },
                        },
                        axisPointer: {
                            label: {
                                formatter: params => {
                                    return (
                                        'Data transfer avg:  ' + params.value + (params.seriesData.length>0? '：' + params.seriesData[0].data +' Mb': '0 Mb') + "\n" +
                                        'Time used avg:  ' + params.value + (params.seriesData.length>1 ? '：' + params.seriesData[1].data : '0 second') + "\n" +
                                        'Used count:  ' + params.value + (params.seriesData.length>2 ? '：' + params.seriesData[2].data : '0')
                                    );
                                },
                            },
                        },
                        data: this.legend,
                    }
                ],
                yAxis: [{
                    type: 'value',
                    position: "left",
                    name: "DataTransferAvg",
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
                        formatter: '{value} Mb',
                        textStyle: {
                            color: echarts.textColor,
                        },
                    },
                },
                {
                    type: 'value',
                    position: "right",
                    name: "TimeUsedAvg",
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
                        formatter: '{value} seconds',
                        textStyle: {
                            color: echarts.textColor,
                        },
                    },
                },
            ],
                series: [
                    {
                        name: 'DataTransferAvg',
                        type: 'line',
                        smooth: true,
                        data: this.dataTransfer,
                    },
                    {
                        name: 'TimeUsedAvg',
                        yAxisIndex: 1,
                        type: 'line',
                        smooth: true,
                        data: this.usedTimeAvg,
                    },
                    {
                        name: 'UsedCount',
                        type: 'line',
                        smooth: true,
                        data: this.usedCount,
                    },

                ],
            };
        });
    }

    ngOnDestroy(): void {
        if(!!this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
