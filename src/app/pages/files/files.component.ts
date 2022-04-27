import {
    Component,
    Input,
    OnInit,
    TemplateRef,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import {
    NbSortDirection,
    NbSortRequest,
    NbTreeGridDataSource,
    NbTreeGridDataSourceBuilder,
    NbDialogService,
    NbToastrService,
    NbGlobalPhysicalPosition,
    NbContextMenuDirective,
    NbMenuService,
} from "@nebular/theme";
import { of, Subscription } from 'rxjs';
import { delay, filter, map } from "rxjs/operators";
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { VersionSourceData, VersionSource } from '../../@core/data/version_source';
import { VolioResponse } from '../../@core/data/volio_response';
import { FilesData, DocumentInfo } from '../../@core/data/files';
import { UtilsFunc } from '../../@core/data/utils';
import { NbWindowService } from '@nebular/theme';
import { addFile, addFileData } from "../../@core/data/add-file";
import { HttpResponse } from '@angular/common/http';

interface TreeNode < T > {
    data: T;
    superior?: T;
    children?: TreeNode < T > [];
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
    @Input() type: string;
    @Input() expanded: boolean;

    isDir(): boolean {
        return this.type === "dir";
    }
}


@Component({
    selector: "ngx-files",
    templateUrl: "./files.component.html",
    styleUrls: ["./files.component.scss"],
})
export class FilesComponent implements OnInit, OnDestroy {
    @ViewChild(NbContextMenuDirective) contextMenu: NbContextMenuDirective;
    @ViewChild('escClose', { read: TemplateRef }) escCloseTemplate: TemplateRef<HTMLElement>;

    nameUpload: string;
    autoInput: string;
    addFiles: any;
    disableUpload: any = true;
    disableButtonUpload: any = false;
    buttonLoading: any = false;

    fileName = '';
    versionSelected: VersionSource;
    versionsTag: VersionSource[] = [];
    sourceTreeData: TreeNode<DocumentInfo>[] = [];

    deleteColumns = "delete";
    customColumn = "name";
    defaultColumns = ["type", "ext", "mime_type", "size_string", "access_hash"];
    allColumns = [this.customColumn, ...this.defaultColumns];

    dataSource: NbTreeGridDataSource<VersionSource> ;
    sortColumn: string;
    sortDirection: NbSortDirection = NbSortDirection.NONE;
    positions = NbGlobalPhysicalPosition;
    deleteT: any = {};
    dataIndexFolder: any = {};
    dialog: TemplateRef < any > ;

    selectedItem = '2';
    themes: [
        { name: "name 1", value: '0' },
        { name: "name 2", value: '1' },
        { name: "name 3", value: '2' },
    ];

    items = [
        { title: 'Thêm mới Folder' },
        { title: 'Xóa Folder' },
    ];

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<VersionSource> ,
        private dialogService: NbDialogService,
        private windowService: NbWindowService,
        private menuService: NbMenuService,
        private versionSourceService: VersionSourceData,
        private fileService: FilesData,
        private utilsFunc: UtilsFunc,
        private toastrService: NbToastrService,
        private versionAddFileService: addFileData,
    ) {
        this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
    }

    versionSourceServiceObs: Subscription;
    ngOnInit(): void {
        this.menuService.onItemClick().pipe(filter(({ tag }) => tag === 'AddFolderMenuContext'),
            map(({ item: { title } }) => title)).subscribe(title => {
            switch (title) {
                case "Thêm mới Folder":
                    this.addFolder();
                    break;
                case "Xóa Folder":
                    this.delete();
                    break;
                default:
                    this.addFolder();
                    break;
            }
        });

        setTimeout(() => {
            this.versionSourceServiceObs = this.versionSourceService.getAllVersions().subscribe((resp: VolioResponse<VersionSource[]>) => {
                if (resp.message === "success" && resp.data) {
                    this.versionsTag = [];
                    this.versionsTag = resp.data;
                    if (!this.versionSelected && this.versionsTag.length > 0) {
                        this.versionSelected = this.versionsTag[0];
                        this.autoInput = this.versionSelected.version;
                    }
                }
            }, err => {}, () => {
                if (this.versionSelected) {
                    this.getFileSystem(this.versionSelected.id, "/");
                }
            });
        });
    }

    fileServiceObs: Subscription;
    getFileSystem(versionID: number, parentPath: string) {
        console.log("getFileSystem: ", versionID, parentPath);
        this.fileServiceObs = this.fileService.getAllDocuments(versionID).subscribe((resp: VolioResponse<DocumentInfo[]>) => {
            console.log("getAllDocuments: ", resp);

            const node: TreeNode<DocumentInfo> = {data: {
                id: "",
                bucket_name: "",
                name: "",
                type: "dir",
                key: "",
                access_hash: "",
                ver_source_id: this.versionSelected.id,
                owner_id: "",
                created_time: 0,
                updated_time: 0,
            }, children: []};

            this.createNodeSource(resp.data, new Map<string, boolean>(), node);

            this.sourceTreeData = node.children;
            console.log("this.sourceTreeData: ", this.sourceTreeData);
            this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
        });
    }



    createNodeSource(listFiles: DocumentInfo[], mapAdded: Map<string, boolean>, parentNode: TreeNode<DocumentInfo>) {
        console.log("createNodeSource - parentNode: ", parentNode);
        if (!mapAdded) {
            mapAdded = new Map<string, boolean>();
        }

        for (const document of listFiles) {
            document.size_string = document.size ? this.utilsFunc.dataBytesToString(document.size) : "";
            document.created_time_string = document.created_time ? this.utilsFunc.secondsToLocalString(document.created_time) : "";
            document.updated_time_string = document.updated_time ? this.utilsFunc.secondsToLocalString(document.updated_time) : "";

            if (!document.parent_id) {
                document.parent_id = "";
            }
            console.log("   ==> Document: ", document.key, document.parent_id, mapAdded[document.key], document.parent_id === parentNode.data.id);
            if (!mapAdded[document.key] && document.parent_id === parentNode.data.id) {
                mapAdded[document.key] = true;
                const node = {data: document, children: []};
                if (document.type === "dir" || document.type === "file") {
                    this.createNodeSource(listFiles, mapAdded, node);
                }

                parentNode.children.push(node);
            }
        }

        console.log("createNodeSource - after parentNode: ", parentNode);
    }

    showFileDetail(dialogDetail: TemplateRef<any>, document: DocumentInfo) {
        if (document.type === "dir" || document.type === "folder") {
            return;
        }

        this.dialogService.open(dialogDetail, { autoFocus: true, context: document});
    }

    addFolder() {
        this.dialogService.open(AddFolderComponent, {
            context: {
                dataIndexFolder: this.dataIndexFolder,
                data: this.sourceTreeData,
            },
        });
    }

    open(row: any) {
        this.contextMenu.show();
        this.dataIndexFolder = row;
        return false;
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

    onDrop(event: any, row: any, windowForm: any) {
        console.log("onDrop", event.dataTransfer.files[0]);
        console.log("onDrop1", event.dataTransfer.files);



        this.getIndex(row, event.dataTransfer.files[0]);

        event.currentTarget.classList.remove("blink_me");

        this.windowService.open(
            windowForm,
            { title: 'Tải File lên', hasBackdrop: true, context: {file: event.dataTransfer.files[0], row: row.data} },
        );

        event.stopPropagation();
        event.preventDefault();
    }

    onDragOver(event, row) {
        console.log("onDragOver: ", event);
        console.log("onDragOver - Row: ", row);

        event.currentTarget.className = "blink_me";
        row.expanded = true;
        event.stopPropagation();
        event.preventDefault();
    }

    onDragLeave(event, row) {
        console.log("onDragLeave: ", event);

        event.currentTarget.classList.remove("blink_me");

        event.stopPropagation();
        event.preventDefault();
    }


    onDragCDK(event) {
        console.log("onDragCDK: ", event);
    }

    onDropCDK(event) {
        console.log("onDropCDK: ", event);
    }

     submitAdd(position, status, dataFile: any, nameUpload: string)  {
        console.log('dataFile', dataFile);

        const ext = dataFile.file.name.split(".");
        const checkPartSplit = dataFile.row.key.split("");
        const checkPartFilter = checkPartSplit.filter(i => i === "/").length === 1 && dataFile.row.type === 'file';
        const indexKeySearch = dataFile.row.key.lastIndexOf("/");
        const checkKey = dataFile.row.key.substr(0, indexKeySearch );
        const checkType = dataFile.row.type === 'file' ? checkKey : dataFile.row.key;
        const data = {
            name: nameUpload ? nameUpload : dataFile.file.name,
            mime_type: dataFile.file.type,
            file_size: dataFile.file.size,
            folder: checkPartFilter ? '' : checkType,
            ext:  ext.length > 0 ? ext[ext.length - 1] : null,
            version_source_id: dataFile.row.ver_source_id,
        };




        this.versionSourceServiceObs = this.versionAddFileService.postAddFile(data).subscribe((resp: VolioResponse<addFile[]>) => {
            if (resp.message === "success" && resp.data) {
                this.fileName =  dataFile.file.name;
                const parentLinkUpload = resp.data.upload_links;
                let linkUpload;
                const partsFile = [];
                this.disableUpload = true;
                this.buttonLoading = true;
                // let current = 0
                // let remaining = dataFile.file.size
                for (let i = 0; i < parentLinkUpload.length; i++) {
                    // if (remaining <= 0 ) {
                    //     break
                    // }

                    // let data
                    // if (remaining <= resp.data.part_split_size) {
                    //     data = dataFile.file.slice(current, dataFile.file.size)
                    // } else {
                    //     data = dataFile.file.slice(current, current +resp.data.part_split_size)
                    //     current += resp.data.part_split_size
                    // }


                    const formData = new FormData();
                    formData.append("thumbnail", dataFile.file, this.fileName);


                    linkUpload = parentLinkUpload[i].link;
                    if (linkUpload) {
                        this.versionSourceServiceObs = this.versionAddFileService.putAddFileToAWS(formData, linkUpload ).subscribe((respHeader: HttpResponse<any>) => {
                            const Etag = respHeader.headers.get("Etag");
                            if (Etag) {
                                const listpartsFile = {
                                    etag: Etag,
                                    part_idx:  parentLinkUpload[i].part_idx,
                                };
                                const data = {
                                    file_id: resp.data.id,
                                    upload_id:  resp.data.upload_id,
                                    uploaded_parts: partsFile.concat(listpartsFile),
                                };
                                this.versionSourceServiceObs = this.versionAddFileService.putCompaleteUpload(data).subscribe((resp: VolioResponse<addFile[]>) => {
                                    this.disableButtonUpload = true;
                                    this.buttonLoading = false;
                                     this.toastrService.show(status || 'Success', `Tải file lên thành công`, { position, status });
                                }, err => {}, () => {
                                    if (this.versionSelected) {
                                        this.getFileSystem(this.versionSelected.id, "/");
                                    }
                                });
                            }
                        }, err => {}, () => {

                        });
                    }
                }









            }
        }, err => {}, () => {
            if (this.versionSelected) {
                this.getFileSystem(this.versionSelected.id, "/");
            }
        });



    }


    download(position, status) {
        window.open(
            "https://stackoverflow.com/questions/35138424/how-do-i-download-a-file-with-angular2-or-greater",
        );
    }

    delete() {
        let searchIndex;
        let searchIndexChild;
        for (let i = 0; i < this.sourceTreeData.length; i++) {
            if (
                this.deleteT &&
                this.deleteT.children &&
                this.deleteT.children.length > 0
            ) {
                searchIndex = this.sourceTreeData.findIndex(
                    (d) => d.data.id === this.deleteT.data.id,
                );
            } else {
                if (
                    this.sourceTreeData[i].children.findIndex(
                        (d) => d.data.id === this.deleteT.data.id,
                    ) >= 0
                ) {
                    searchIndexChild = this.sourceTreeData[i].children.findIndex(
                        (d) => d.data.id === this.deleteT.data.id,
                    );
                    searchIndex = this.sourceTreeData.findIndex(
                        (d) => d.data.id === this.sourceTreeData[i].data.id,
                    );
                }
            }
        }

        if (searchIndexChild) {
            this.sourceTreeData[searchIndex].children.splice(searchIndexChild, 1);
            this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
        } else if (searchIndex && !searchIndexChild) {
            console.log("searchIndex", searchIndex);
            this.sourceTreeData.splice(searchIndex, 1);
            this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
        }

        console.log("this.sourceTreeData", this.sourceTreeData);

        return of(this.sourceTreeData).pipe(delay(500));
    }

    getIndex(row: any, file: any) {
        let searchIndex;
        for (let i = 0; i < this.sourceTreeData.length; i++) {
            if (row && row.children && row.children.length > 0) {
                searchIndex = this.sourceTreeData.findIndex(
                    (d) => d.data.id === row.data.id,
                );
            } else {
                if (
                    this.sourceTreeData[i].children.findIndex(
                        (d) => d.data.id === row.data.id,
                    ) >= 0
                ) {
                    searchIndex = this.sourceTreeData.findIndex(
                        (d) => d.data.id === this.sourceTreeData[i].data.id,
                    );
                }
            }
        }
        if (searchIndex) {
            this.sourceTreeData[searchIndex].children.push(file);
        }

        this.addFile(file);
    }

    addFile(file: any) {
        console.log("file", file);
        const formData = new FormData();
        formData.append("file", file, file.name);
    }

    onChange(event: any) {
        console.log("onChange: ", event);
    }

    onVersionSelectionChange(event: any) {
        console.log(event);
    }

    ngOnDestroy() {
    }
}
