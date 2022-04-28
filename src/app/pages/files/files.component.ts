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
    NbWindowRef,
} from "@nebular/theme";
import { forkJoin, from, of, Subscription, throwError } from 'rxjs';
import { delay, filter, map, catchError, mergeMap, tap, switchMap } from 'rxjs/operators';
import { AddFolderComponent } from './components/add-folder/add-folder.component';
import { VersionSourceData, VersionSource } from '../../@core/data/version_source';
import { VolioResponse } from '../../@core/data/volio_response';
import { FilesData, DocumentInfo } from '../../@core/data/files';
import { UtilsFunc } from '../../@core/data/utils';
import { NbWindowService } from '@nebular/theme';
import { HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';

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
    @ViewChild('uploadForm', { read: TemplateRef }) uploadForm: TemplateRef<HTMLElement>;
    @ViewChild('uploadFolderWarning', { read: TemplateRef }) uploadFolderWarning: TemplateRef<HTMLElement>;
    uploadWindowRef: NbWindowRef;

    nameUpload: string;
    autoInput: string;
    addFiles: any;
    disableUpload: any = false;
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
        private versionAddFileService: FilesData,
    ) {
        this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
    }

    simulateHttp(val: any, d: number) {
        return of(val).pipe(delay(d));
    }

    versionSourceServiceObs: Subscription;
    ngOnInit(): void {
        const list = [1, 2, 3, 4];
        console.log("TEST ngOnInit");

        from(list).pipe(map(file => {
            return file;
        }), mergeMap(file => {
            return this.simulateHttp(file + " user saved ", 1000).pipe(map(r => {
                return {file, r};
            }));
        }),
        mergeMap(resp1 => {
            return this.simulateHttp(" data reloaded " + resp1.r, 2000);
        }),
        map(r => {
            console.log("TEST 1: ", r);
            return r;
        }),
        filter(resp => resp.indexOf("4") > 0),
        ).subscribe( (r) => {
                console.log("TEST 2:", r);
                console.log("TEST ------------");
            },
                console.error,
                () => console.log('TEST completed httpResult$'),
            );


        // const saveUser$ = this.simulateHttp(" user saved ", 1000);

        // const httpResult$ = saveUser$.pipe(
        //     switchMap(sourceValue => {
        //         console.log("TEST 1: ", sourceValue);
        //         return this.simulateHttp(sourceValue + " data reloaded ", 2000);
        //         },
        //     ),
        // );
        // httpResult$.subscribe( (r) => {
        //     console.log("TEST 2:", r);
        // },
        //     console.error,
        //     () => console.log('completed httpResult$'),
        // );


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



    createNodeSource(listFiles: DocumentInfo[], mapAdded: Map < string, boolean > , parentNode: TreeNode<DocumentInfo>) {
        // console.log("createNodeSource - parentNode: ", parentNode);
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
            // console.log("   ==> Document: ", document.key, document.parent_id, mapAdded[document.key], document.parent_id === parentNode.data.id);
            if (!mapAdded[document.key] && document.parent_id === parentNode.data.id) {
                mapAdded[document.key] = true;
                const node = {data: document, children: []};
                if (document.type === "dir" || document.type === "file") {
                    this.createNodeSource(listFiles, mapAdded, node);
                }

                parentNode.children.push(node);
            }
        }

        // console.log("createNodeSource - after parentNode: ", parentNode);
    }

    showFileDetail(dialogDetail: TemplateRef < any > , document: DocumentInfo) {
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

    parseFileEntry(fileEntry) {
        return new Promise((resolve, reject) => {
            fileEntry.file(
                file => {
                    resolve(file);
                },
                err => {
                    reject(err);
                },
            );
        });
    }

    parseDirectoryEntry(directoryEntry: FileSystemDirectoryEntry) {
        const directoryReader = directoryEntry.createReader();
        return new Promise((resolve, reject) => {
            directoryReader.readEntries(
                entries => {
                    resolve(entries);
                },
                err => {
                    reject(err);
                },
            );
        });
    }


    uploadProcess: Map<string, number> = new Map<string, number>();
    trackItem (index, item: any) {
        return item;
    }

    onDrop(event: any, row: any, windowForm: any) {
        const files: any[] = event.dataTransfer.files;
        console.log("onDrop", event);
        console.log("onDrop dataTransfer", files);

        let isValid = true;
        const items = event.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                console.log("onDrop - entry: ", entry);

                if (entry.isFile) {
                    console.log("onDrop - isFile: ", entry);
                } else if (entry.isDirectory) {
                    isValid = false;
                    break;

                }
            }
        }

        event.currentTarget.classList.remove("blink_me");


        if (isValid) {
            for (const file of files) {
                this.uploadProcess.set(file.name, 0);
            }
            const header = "Upload " + files.length + (( files.length > 1) ? ' files' : ' file');
            this.uploadWindowRef = this.windowService.open(windowForm, { title: header, hasBackdrop: true, context: {files: files, processes: this.uploadProcess, row: row.data} });
            this.uploadWindowRef.onClose.subscribe(() => {
                this.uploadProcess = new Map<string, number>();
            });
        } else {
            this.dialogService.open<any>(this.uploadFolderWarning, { autoFocus: true, context: {message: "Can not upload folder"}});
        }

        event.stopPropagation();
        event.preventDefault();
    }

    onDragOver(event, row) {
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



    uploadFiles(data: any) {
        if (data.files.length <= 0 ) {
            this.dialogService.open<any>(this.uploadFolderWarning, { autoFocus: true, context: {message: "Not fond any files"}});
        }

        const row = data.row;
        const files = data.files;
        console.log("Data: ", data);


        from(files).pipe(switchMap((file: any) => {
            return of("haha" + file.name);
        }),
        switchMap((file, resp1: any) => {
            console.log("Step 1 F: ", file);
            console.log("Step 1 R: ", resp1);
            return resp1;
        }),
        switchMap((resp2: any) => {
            console.log("Step 2: ", resp2);
            return resp2;
        }),
        tap(all => all)).subscribe(r => {
            console.log("RESULT: ", r);
        }, e => {
            console.log("ERROR: ", e);
        }, () => {});

        return;

        forkJoin([from(files).pipe(mergeMap<any, any>((file: any) => {
            const ext = file.name.split(".");
            const checkPartSplit = row.key.split("");
            const checkPartFilter = checkPartSplit.filter(i => i === "/").length === 1 && row.type === 'file';
            const indexKeySearch = row.key.lastIndexOf("/");
            const checkKey = row.key.substr(0, indexKeySearch );
            const checkType = row.type === 'file' ? checkKey : row.key;
            const dataUpload = {
                name: file.name,
                mime_type: file.type,
                file_size: file.size,
                folder: checkPartFilter ? '' : checkType,
                ext:  ext.length > 0 ? ext[ext.length - 1] : null,
                ver_source_id: row.ver_source_id,
            };

            console.log("dataUpload: ", dataUpload);
            return of(this.versionAddFileService.addFile(dataUpload).subscribe(resp => {
                console.log("dataUpload addFile: ", resp);
                if (resp.message === "success" && resp.data) {
                    this.fileName =  file.name;
                    const parentLinkUpload = resp.data.upload_links;
                    let linkUpload;
                    const partsFile = [];
                    this.disableUpload = true;
                    this.buttonLoading = true;
                    for (let i = 0; i < parentLinkUpload.length; i++) {
                        const formData = new FormData();
                        formData.append("file", file, this.fileName);
                        linkUpload = parentLinkUpload[i].link;
                        if (linkUpload) {
                            return of(this.versionAddFileService.uploadFileToAWS(formData, linkUpload ).pipe(map((event: HttpEvent<any>, count: number) => {
                                switch (event.type) {
                                    case HttpEventType.Sent:
                                        console.log(`Uploading file "${file.name}" of size ${file.size}.`);
                                    break;
                                    case HttpEventType.UploadProgress:
                                        const percentDone = Math.round(100 * event.loaded / event.total);
                                        console.log( `File "${file.name}" is ${percentDone}% uploaded.`);
                                        data.processes.set(file.name, percentDone);
                                        break;
                                    case HttpEventType.Response:
                                        console.log( `File "${file.name}" was completely uploaded!`);
                                        break;
                                    default:
                                        console.log( `File "${file.name}" surprising upload event: ${event.type}.`);
                                }

                                return event;
                            }), filter((event: HttpEvent<any>) => {
                                return event.type === HttpEventType.Response;
                            })).pipe(map((headerResp: any) => {
                                console.log("Upload: ", headerResp);
                                const Etag = headerResp.headers.get("Etag");
                                if (Etag) {
                                    const listPartsFile = {
                                        etag: Etag,
                                        part_idx:  parentLinkUpload[i].part_idx,
                                    };
                                    const dataUploaded = {
                                        file_id: resp.data.id,
                                        upload_id:  resp.data.upload_id,
                                        uploaded_parts: partsFile.concat(listPartsFile),
                                    };
                                    console.log("dataUploaded: ", dataUploaded);
                                    return this.versionAddFileService.completeUpload(dataUploaded).pipe(map(resp2 => {
                                        console.log("dataUpload completeUpload: ", resp2);

                                        this.disableButtonUpload = true;
                                        this.buttonLoading = false;
                                        this.toastrService.show( `File upload successfully`, { status: 'success' });
                                    }));
                                }
                            })));
                        }
                    }
                } else {
                    this.dialogService.open<any>(this.uploadFolderWarning, {autoFocus: true, context: {message: resp.data.message}});
                    if (this.uploadWindowRef) {
                        this.uploadWindowRef.close();
                    }
                }
            }, err => {
                this.dialogService.open<any>(this.uploadFolderWarning, {autoFocus: true, context: {message: err.data.message}});
                if (this.uploadWindowRef) {
                    this.uploadWindowRef.close();
                }
            }, () => {
                if (this.versionSelected) {
                    this.getFileSystem(this.versionSelected.id, "/");
                }
                this.disableUpload = false;
            }));
        } ))]).subscribe(r => {
            console.log("RESULT: ", r);
        }, e => {
            console.log("ERROR: ", e);
        }, () => {
            console.log("COMPLETED");
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
            if (this.deleteT && this.deleteT.children && this.deleteT.children.length > 0) {
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
