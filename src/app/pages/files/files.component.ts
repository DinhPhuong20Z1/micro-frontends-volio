import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    OnDestroy,
    ViewChild,
    HostListener
} from "@angular/core";
import {
    NbSortDirection,
    NbSortRequest,
    NbTreeGridDataSource,
    NbTreeGridDataSourceBuilder,
    NbDialogService,
    NbToastrService,
    NbGlobalPhysicalPosition,
    NbThemeService,
    NbContextMenuDirective,
    NbMenuService,
} from "@nebular/theme";
import { combineLatest, of, Subject } from "rxjs";
import { delay ,filter, map} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Router } from '@angular/router';
import { AddFolderComponent } from './components/add-folder/add-folder.component';

interface TreeNode<T> {
    data: T;
    superior?: T;
    children?: TreeNode<T>[];
}

interface FSEntry {
    name: string;
    size: string;
    kind: string;
    items?: number;
    drs: string;
}


@Component({
    selector: "ngx-files",
    templateUrl: "./files.component.html",
    styleUrls: ["./files.component.scss"],
})
export class FilesComponent implements OnInit, OnDestroy  {
    @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;
    private data: TreeNode<FSEntry>[] = [
        {
            data: {
                name: "Projects",
                size: "1.8 MB",
                items: 5,
                kind: "dir",
                drs: "123",
            },
            children: [
                {
                    data: {
                        name: "project-1.doc",
                        kind: "doc",
                        size: "240 KB",
                        drs: "123",
                    },
                },
                {
                    data: {
                        name: "project-2.doc",
                        kind: "doc",
                        size: "290 KB",
                        drs: "123",
                    },
                },
                {
                    data: {
                        name: "project-3",
                        kind: "txt",
                        size: "466 KB",
                        drs: "123",
                    },
                },
                {
                    data: {
                        name: "project-4.docx",
                        kind: "docx",
                        size: "900 KB",
                        drs: "123",
                    },
                },
            ],
        },
        {
            data: {
                name: "Reports",
                kind: "dir",
                size: "400 KB",
                items: 2,
                drs: "123",
            },
            children: [
                {
                    data: {
                        name: "Report 1",
                        kind: "doc",
                        size: "100 KB",
                        drs: "123",
                    },
                },
                {
                    data: {
                        name: "Report 2",
                        kind: "doc",
                        size: "300 KB",
                        drs: "123",
                    },
                },
            ],
        },
        {
            data: {
                name: "Other",
                kind: "dir",
                size: "109 MB",
                items: 2,
                drs: "123",
            },
            children: [
                {
                    data: {
                        name: "backup.bkp",
                        kind: "bkp",
                        size: "107 MB",
                        drs: "123",
                    },
                },
                {
                    data: {
                        name: "secret-note.txt",
                        kind: "txt",
                        size: "2 MB",
                        drs: "123",
                    },
                },
            ],
        },
    ];
    customColumn = "name";
    deleteColums = "delete";
    defaultColumns = ["size", "kind", "items", "drs"];
    allColumns = [this.customColumn, ...this.defaultColumns];
    dataSource: NbTreeGridDataSource<FSEntry>;
    sortColumn: string;
    sortDirection: NbSortDirection = NbSortDirection.NONE;
    positions = NbGlobalPhysicalPosition;
    private apiURL = "https://reqres.in/api/users?page=2";
    deleteId: any = {};
    deleteT: any = {};
    httpOptions: any;
    dataIndexFolder: any = {};
    dialog: TemplateRef<any>;

    selectedItem = '2';
    themes: [
        {name: "name 1", value: '0'},
        {name: "name 2", value: '1'},
        {name: "name 3", value: '2'},
    ]

    items = [
        { title: 'Thêm mới Folder' },
        { title: 'Xóa Folder' },
      ];

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
        private dialogService: NbDialogService,
        private dialogDetail: NbDialogService,
        private http: HttpClient,
        private downloadFile: NbToastrService,
        private menuService: NbMenuService,
    ) {
        this.dataSource = this.dataSourceBuilder.create(this.data);
    }

    ngOnInit(): void {
        //  this.httpOptions = {
        //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        // };
        // this.http.get(this.apiURL, this.httpOptions).subscribe((data) => {console.log('data',data);
        // })
        this.menuService.onItemClick().pipe(filter(({ tag }) => tag === 'AddFolderMenuContext'),
         map(({ item: { title } }) => title)).subscribe(title => {
            switch (title) {
                case "Thêm mới Folder":
                    this.addFolder();
                    break
                case "Xóa Folder":
                    this.delete();
                    break
                default:
                    this.addFolder();
                    break
            }
        })
    }
    addFolder() {
        this.dialogService.open(AddFolderComponent, {
            context: {
                dataIndexFolder : this.dataIndexFolder,
                data: this.data
            }

        });
    }

    open(row: any) {
        this.contextMenu.show();
        this.dataIndexFolder = row;
        return false;
      }

      @HostListener('document:click')
      close() {
        this.contextMenu.hide();
      }



    updateSort(sortRequest: NbSortRequest): void {
        this.sortColumn = sortRequest.column;
        this.sortDirection = sortRequest.direction;
    }

    getSortDirection(column: string): NbSortDirection {
        if (this.sortColumn === column) {
            return this.sortDirection;
        }
        return NbSortDirection.NONE;
    }

    getShowOn(index: number) {
        const minWithForMultipleColumns = 400;
        const nextColumnStep = 100;
        return minWithForMultipleColumns + nextColumnStep * index;
    }

    onDrop(event: any,  row: any) {
        console.log("event", event.dataTransfer.files[0]);
        this.getIndex(row, event.dataTransfer.files[0]);

        event.preventDefault();
    }
    onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }



    download(position, status) {
        window.open(
            "https://stackoverflow.com/questions/35138424/how-do-i-download-a-file-with-angular2-or-greater"
        );
        this.downloadFile.show(
            status || "Success",
            `Tải file xuống thành công`,
            { position, status }
        );
    }

    onClick(dialogDetail: TemplateRef<any>, row: any) {
        this.dialogDetail.open(dialogDetail);
        this.deleteId = row.data;
        this.deleteT = row;
        console.log("row.data", row.data);
    }

    delete() {
        let searchIndex;
        let searchIndexChild;
        for (let i = 0; i < this.data.length; i++) {
            if (
                this.deleteT &&
                this.deleteT.children &&
                this.deleteT.children.length > 0
            ) {
                searchIndex = this.data.findIndex(
                    (d) => d.data.name === this.deleteT.data.name
                );
            } else {
                if (
                    this.data[i].children.findIndex(
                        (d) => d.data.name === this.deleteT.data.name
                    ) >= 0
                ) {
                    searchIndexChild = this.data[i].children.findIndex(
                        (d) => d.data.name === this.deleteT.data.name
                    );
                    searchIndex = this.data.findIndex(
                        (d) => d.data.name === this.data[i].data.name
                    );
                }
            }
        }

        if (searchIndexChild) {
            this.data[searchIndex].children.splice(searchIndexChild, 1);
            this.dataSource = this.dataSourceBuilder.create(this.data);
        } else if (searchIndex && !searchIndexChild) {
            console.log("searchIndex", searchIndex);
            this.data.splice(searchIndex, 1);
            this.dataSource = this.dataSourceBuilder.create(this.data);
        }

        // const httpOptions = {
        //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        //     body: {ids: [this.deleteId.drs]}
        // };
        // this.http.delete<any>(this.apiURL, httpOptions).subscribe((data) => {});
        console.log("this.data", this.data);

        return of(this.data).pipe(delay(500));
    }

    getIndex(row: any, file: any) {
        let searchIndex;
        for (let i = 0; i < this.data.length; i++) {
            if (row && row.children && row.children.length > 0) {
                searchIndex = this.data.findIndex(
                    (d) => d.data.name === row.data.name
                );
            } else {
                if (
                    this.data[i].children.findIndex(
                        (d) => d.data.name === row.data.name
                    ) >= 0
                ) {
                    searchIndex = this.data.findIndex(
                        (d) => d.data.name === this.data[i].data.name
                    );
                }
            }
        }
        if (searchIndex) {
            this.data[searchIndex].children.push(file);
        }

        this.addHero(file);
    }
    addHero(file: any) {
        console.log("file", file);
        const formData = new FormData();
        formData.append("file", file, file.name);

        // return this.http.post(this.apiURL, file, httpOptions)
        this.http.post<any>(this.apiURL, formData).subscribe((data) => {});
    }

    ngOnDestroy(){
        console.log('123');
        this.httpOptions.unsubscribe()

    }
}

@Component({
    selector: "ngx-fs-icon",
    template: `
        <nb-tree-grid-row-toggle
            [expanded]="expanded"
            *ngIf="isDir(); else fileIcon"
        >
        </nb-tree-grid-row-toggle>
        <ng-template #fileIcon>
            <nb-icon icon="file-text-outline"></nb-icon>
        </ng-template>
    `,
})
export class FsIconComponent {
    @Input() kind: string;
    @Input() expanded: boolean;

    isDir(): boolean {
        return this.kind === "dir";
    }
}
