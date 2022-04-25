import { Component, OnInit, OnDestroy } from '@angular/core';
import { NumberFilterComponent } from '../volio/tables/number-filter/number-filter.component';
import { AutoCompleteFilterComponent } from '../volio/tables/auto-complete/auto-complete.component';
import { UtilsFunc } from '../../@core/data/utils';
import { VersionSource, VersionSourceData } from '../../@core/data/version_source';
import { Subscription } from 'rxjs';
import { CheckboxEditorComponent } from '../volio/tables/checkbox-editor/checkbox-editor.component';
import { LocalDataSource } from 'ng2-smart-table';
import { CheckboxCellComponent } from '../volio/tables/checkbox-cell/checkbox-cell.component';

@Component({
    selector: 'ngx-versions',
    templateUrl: './versions.component.html',
    styleUrls: ['./versions.component.scss'],
})

export class VersionsComponent implements OnInit, OnDestroy {
    versionDataSetting: any = {
        actions: {
            delete: false,
        },
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
        },
        filters: {

        },
        columns: {
            id: {
                sort: true,
                filter: {
                    type: "custom",
                    component: NumberFilterComponent,
                },
                addable: false,
                editable: false,
                title: 'ID',
                type: 'number',
                width: '5%',
            },
            version: {
                title: 'Version',
                type: 'string',
                editable: false,
                filter: {
                    type: "custom",
                    component: AutoCompleteFilterComponent,
                    config: {
                        data: [],
                    },
                },
            },
            game_version: {
                title: 'Game Version',
                type: 'string',
                editable: false,
                filter: {
                    type: "custom",
                    component: AutoCompleteFilterComponent,
                    config: {
                        data: [],
                    },
                },
            },
            description: {
                title: 'Description',
                type: 'string',
                filter: false,
                editable: true,
            },
            is_newest: {
                title: 'Is Newest',
                type: 'custom',
                renderComponent: CheckboxCellComponent,
                filter: false,
                editable: true,
                editor: {
                    type: 'custom',
                    component: CheckboxEditorComponent,
                },
            },
            created_time: {
                editable: false,
                filter: false,
                addable: false,
                title: 'Created Time',
                type: 'string',
                valuePrepareFunction: this.utilsFunc.secondsToLocalString,
            },
            updated_time: {
                editable: false,
                filter: false,
                addable: false,
                title: 'Updated Time',
                type: 'string',
                valuePrepareFunction: this.utilsFunc.secondsToLocalString,
            },
        },
    };

    versionsData: VersionSource[];
    versionServiceObs: Subscription;
    constructor(private versionService: VersionSourceData, private utilsFunc: UtilsFunc) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.versionServiceObs = this.versionService.getAllVersions().subscribe(resp => {
                if (!!resp && resp.message === "success") {
                    this.versionsData = resp.data;
                    console.log("VersionsComponent - GetAllVersions this.versionsData: ", this.versionsData);
                }
            }, err => {
                console.log("VersionsComponent call GetAllVersions error: ", err);
            }, () => {
                this.updateTableSettings();
            });
        });
    }

    updateTableSettings() {
        this.versionDataSetting = {
            actions: {
                delete: false,
            },
            add: {
                addButtonContent: '<i class="nb-plus"></i>',
                createButtonContent: '<i class="nb-checkmark"></i>',
                cancelButtonContent: '<i class="nb-close"></i>',
                confirmCreate: true,
            },
            edit: {
                editButtonContent: '<i class="nb-edit"></i>',
                saveButtonContent: '<i class="nb-checkmark"></i>',
                cancelButtonContent: '<i class="nb-close"></i>',
                confirmSave: true,
            },
            filters: {

            },
            columns: {
                id: {
                    sort: true,
                    filter: {
                        type: "custom",
                        component: NumberFilterComponent,
                    },
                    addable: false,
                    editable: false,
                    title: 'ID',
                    type: 'number',
                    width: '5%',
                },
                version: {
                    title: 'Version',
                    type: 'string',
                    editable: false,
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.versionsData,
                        },
                    },
                },
                game_version: {
                    title: 'Game Version',
                    type: 'string',
                    editable: false,
                    filter: {
                        type: "custom",
                        component: AutoCompleteFilterComponent,
                        config: {
                            data: this.versionsData,
                        },
                    },
                },
                description: {
                    title: 'Description',
                    type: 'string',
                    filter: false,
                    editable: true,
                },
                is_newest: {
                    title: 'Is Newest',
                    type: 'custom',
                    renderComponent: CheckboxCellComponent,
                    filter: false,
                    editable: true,
                    editor: {
                        type: 'custom',
                        component: CheckboxEditorComponent,
                    },
                },
                created_time: {
                    editable: false,
                    filter: false,
                    addable: false,
                    title: 'Created Time',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                },
                updated_time: {
                    editable: false,
                    filter: false,
                    addable: false,
                    title: 'Updated Time',
                    type: 'string',
                    valuePrepareFunction: this.utilsFunc.secondsToLocalString,
                },
            },
        };
    }

    onCreateConfirm(event: any): void {
        console.log("onCreateConfirm - event: ", event);

        const data = event.newData;
        if (!data.is_newest) {
            data.is_newest = false;
        }
        data.id = 0;
        data.created_time = 0;
        data.updated_time = 0;

        console.log("onCreateConfirm: ", data);
        this.versionService.createVersion(data).subscribe(resp => {
            console.log("CreateVersion Resp: ", resp);
            event.confirm.resolve(data);
            if (resp.data) {
                this.versionsData = resp.data;
            }
        }, err => {
            console.log("CreateVersion Error: ", err);
            event.confirm.reject();
        });
    }

    onSaveConfirm(event: any): void {
        const data = event.newData;
        if (!data.is_newest) {
            data.is_newest = false;
        }
        data.created_time = 0;
        data.updated_time = 0;

        console.log("onCreateConfirm: ", data);
        this.versionService.updateVersion(data).subscribe(resp => {
            console.log("UpdateVersion Resp: ", resp);
            event.confirm.resolve(data);
            if (resp.data) {
                this.versionsData = resp.data;
            }
        }, err => {
            console.log("UpdateVersion Error: ", err);
            event.confirm.reject();
        });

    }


    ngOnDestroy(): void {
        if (!!this.versionServiceObs) {
            this.versionServiceObs.unsubscribe();
        }
    }
}
