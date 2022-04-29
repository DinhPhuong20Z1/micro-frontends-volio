import {
    Component,
    Input,
    OnInit,
    TemplateRef,
    OnDestroy,
    ViewChild,
    HostListener,
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
import { VersionSourceData, VersionSource } from '../../@core/data/version_source';
import { VolioResponse } from '../../@core/data/volio_response';
import { FilesData, DocumentInfo } from '../../@core/data/files';
import { UtilsFunc } from '../../@core/data/utils';
import { NbWindowService, NbDialogRef } from '@nebular/theme';
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
    @ViewChild('dialogInformation', { read: TemplateRef }) dialogInformation: TemplateRef<HTMLElement>;
    @ViewChild('addNewFolder', { read: TemplateRef }) addNewFolder: TemplateRef<HTMLElement>;

    uploadWindowRef: NbWindowRef;

    autoInput: string;
    windowUploadButton = "Upload";

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

    menuContextItem = [
        { title: 'New folder' },
        { title: 'Delete item' },
    ];

    @HostListener('document:click')
    close() {
        if (this.contextMenu) {
            this.contextMenu.hide();
        }
    }

    styleBlock: HTMLStyleElement;
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
        this.styleBlock = document.createElement('style');
        this.dataSource = this.dataSourceBuilder.create(this.sourceTreeData);
    }

    simulateHttp(val: any, d: number) {
        return of(val).pipe(delay(d));
    }

    versionSourceServiceObs: Subscription;
    ngOnInit(): void {
        // const list = [1, 2, 3, 4];
        // console.log("TEST ngOnInit");

        // from(list).pipe(map(file => {
        //     return file;
        // }), mergeMap(file => {
        //     return this.simulateHttp(file + " user saved ", 1000).pipe(map(r => {
        //         return {file, r};
        //     }));
        // }),
        // mergeMap(resp1 => {
        //     return this.simulateHttp(" data reloaded " + resp1.r, 2000);
        // }),
        // map(r => {
        //     console.log("TEST 1: ", r);
        //     return r;
        // }),
        // filter(resp => resp.indexOf("4") > 0),
        // ).subscribe( (r) => {
        //         console.log("TEST 2:", r);
        //         console.log("TEST ------------");
        //     },
        //         console.error,
        //         () => console.log('TEST completed httpResult$'),
        //     );


        this.menuService.onItemClick().pipe(filter(({ tag }) => tag === 'sourceMenuContext'),
            map(({ item: { title } }) => title)).subscribe(title => {
                console.log("onItemClick menu context: ", title, this.menuContextItemSelected);
                const data = this.menuContextItemSelected;
                if (data) {
                    switch (title) {
                        case "New folder":
                            this.openAddFolderDialog({new: "", data: data});
                            break;
                        case "Delete item":
                            if (data.type === "dir" || data.type === "folder") {
                                this.fileService.deleteFolder(data.ver_source_id, data.key).pipe(filter(r => r.message === "success" && r.status === 200)).subscribe(resp => {
                                    this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "File " + data.name + " deleted successfully"}});
                                    this.initSourceTree();
                                }, err => {
                                    console.error(err);
                                    this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "Folder " + data.name + " deleted failed"}});
                                });
                            } else {
                                this.fileService.deleteFile(data.ver_source_id, data.key).pipe(filter(r => r.message === "success" && r.status === 200)).subscribe(resp => {
                                    this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "File " + data.name + " deleted successfully"}});
                                    this.initSourceTree();
                                }, err => {
                                    console.error(err);
                                    this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "Folder " + data.name + " deleted failed"}});
                                });
                            }

                            break;
                    }
                }
        });

        this.getAllVersions(this.initSourceTree);
    }

    getAllVersions(callback: Function) {
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
                if (callback) {
                    callback.call(this);
                }
            });
        });
    }

    initSourceTree() {
        if (this.versionSelected) {
            this.getFileSystem(this.versionSelected.id, "/");
        }
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

        if (listFiles.length === 0 && parentNode.data.id === "" && parentNode.data.name === "" && parentNode.data.key === "") {
            parentNode.children.push({data: {
                id: "",
                bucket_name: "",
                name: "Nothing, drag and drop files here",
                type: "",
                key: "",
                access_hash: "",
                ver_source_id: this.versionSelected.id,
                owner_id: "",
                created_time: 0,
                updated_time: 0,
            }, children: []});
            return;
        }

        for (const document of listFiles) {
            document.size_string = document.size ? this.utilsFunc.dataBytesToString(document.size) : "";
            document.created_time_string = document.created_time ? this.utilsFunc.secondsToLocalString(document.created_time) : "";
            document.updated_time_string = document.updated_time ? this.utilsFunc.secondsToLocalString(document.updated_time) : "";

            if (!document.parent_id) {
                document.parent_id = "";
            }

            if (!mapAdded[document.key] && document.parent_id === parentNode.data.id) {
                mapAdded[document.key] = true;
                const node = {data: document, children: []};
                if (document.type === "dir" || document.type === "file") {
                    this.createNodeSource(listFiles, mapAdded, node);
                }

                parentNode.children.push(node);
            }
        }
    }

    menuContextItemSelected: DocumentInfo;
    openContextMenu(event, data) {
        this.styleBlock.type = 'text/css';
        this.styleBlock.innerHTML = '.menu-context-class { left: ' + event.clientX + 'px!important; top: ' + event.clientY + 'px!important } .menu-context-class li:hover {background-color: #f7f9fc!important;}';
        document.getElementsByTagName('head')[0].appendChild(this.styleBlock);

        console.log("openContextMenu event: ", event);

        console.log("openContextMenu contextMenuClass: ", this.contextMenu.contextMenuClass);
        this.contextMenu.contextMenuClass = 'menu-context-class';
        console.log("openContextMenu contextMenuClass: ", this.contextMenu.contextMenuClass);
        this.contextMenu.rebuild();
        console.log("openContextMenu: ", data);
        this.menuContextItemSelected = data;
        this.contextMenu.show();
        return false;
    }

    showFileDetail(dialogDetail: TemplateRef < any > , document: DocumentInfo) {
        if (document.type === "dir" || document.type === "folder") {
            return;
        }

        this.dialogService.open(dialogDetail, { autoFocus: true, context: document});
    }

    openAddFolderDialog(newOpt) {
        console.log("addFolder: ", newOpt);
        const data = newOpt.data;
        const n = newOpt.new;
        let location = "";
        if (data.type === "folder" || data.type === "dir") {
            location = "./" + data.key.replace(data.ver_source_id + "/", "");
        } else {
            location = "." + data.key.substring(data.key.indexOf("/"), data.key.lastIndexOf("/"));
            if (location === ".") {
                location = "./";
            }
        }

        this.dialogService.open<any>(this.addNewFolder, {
            context: {
                new: n,
                location: location,
                data: data,
            },
        });
    }

    onNameFolderChanged(data, name) {
        console.log("onNameFolderChanged d: ", data);
        console.log("onNameFolderChanged e: ", name);
        data.new = name;
    }

    onAddNewFolder(dialog: NbDialogRef < any >, newFolderOpt: any) {
        console.log("onAddNewFolder: ", newFolderOpt);
        dialog.close();

        if (newFolderOpt.new.length <= 3) {
            this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Warning", message: "Folder name least 3 characters", closeFunc: () => {
                this.openAddFolderDialog(newFolderOpt);
            }}});

            return;
        }

        const data = newFolderOpt.data;
        console.log("addFolder: ", data);
        let keyPath = "";
        if (data.type === "folder" || data.type === "dir") {
            keyPath = data.key + "/" + newFolderOpt.new;
            keyPath = keyPath.replace("//", "/");
        } else {
            keyPath = data.key.substring(0, data.key.lastIndexOf("/") + 1) + newFolderOpt.new;
        }
        console.log("onAddNewFolder addFolder: ", keyPath);

        let keyPathWithOutVer = keyPath;
        if (keyPathWithOutVer.startsWith('' + data.ver_source_id + "/")) {
            keyPathWithOutVer = "." + keyPathWithOutVer.substring(keyPathWithOutVer.indexOf("/"));
        }

        this.fileService.addFolder(data.ver_source_id, keyPath).subscribe(resp => {
            if (resp.message === "success" && resp.status === 200) {
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "New folder", message: "Folder " + keyPathWithOutVer + " created successfully"}});
            } else {
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "New folder", message: "Folder " + keyPathWithOutVer + " created failed"}});
            }
            this.initSourceTree();
        }, err => {
            console.error(err);
            this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "New folder", message: "Folder " + keyPathWithOutVer + " created failed"}});
        });
    }

    getShowOn(index: number) {
        const minWithForMultipleColumns = 400;
        const nextColumnStep = 100;
        return minWithForMultipleColumns + nextColumnStep * index;
    }

    getSortDirection(column: string): NbSortDirection {
        if (this.sortColumn === column) {
            return this.sortDirection;
        }
        return NbSortDirection.NONE;
    }

    updateSort(sortRequest: NbSortRequest): void {
        this.sortColumn = sortRequest.column;
        this.sortDirection = sortRequest.direction;
    }

    uploadProcess: Map<string, number> = new Map<string, number>();
    trackItem (index, item: any) {
        return item;
    }

    onDrop(event: any, row: any, windowForm: any) {
        const files: any[] = [];
        Array.prototype.push.apply( files,  event.dataTransfer.files ); // Covert FilesList to Array

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
        event.currentTarget.classList.remove("blink_me_top_border");

        if (isValid) {
            for (const file of files) {
                this.uploadProcess.set(file.name, 0);
            }
            const header = "Upload " + files.length + (( files.length > 1) ? ' files' : ' file');
            this.uploadWindowRef = this.windowService.open(windowForm, { title: header, hasBackdrop: true, context: {files: files, processes: this.uploadProcess, row: row.data} });
            this.uploadWindowRef.onClose.subscribe(() => {
                this.windowUploadButton = "Upload";
                this.uploadProcess = new Map<string, number>();
            });
        } else {
            this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Warning", message: "Can not upload folder"}});
        }

        event.stopPropagation();
        event.preventDefault();
    }

    dragOverTimer: NodeJS.Timer;
    onDragOver(event, row) {
        console.log("onDragOver: ", event);
        if (row.data.type === 'folder' || row.data.type === 'dir') {
            event.currentTarget.className = "blink_me";
            if (!row.expanded) {
                this.dragOverTimer = setTimeout(() => {
                    console.log("onDragOver Click----------------------------: ", event);
                    event.target.dispatchEvent(new Event("click"));
                    console.log("onDragOver Click----------------------------: ",  row.expanded);
                }, 1000);
                row.expanded = true;
            }
        } else {
            event.currentTarget.className = "blink_me_top_border";
        }
        event.stopPropagation();
        event.preventDefault();
    }

    onDragLeave(event, row) {
        if (this.dragOverTimer) {
            clearTimeout(this.dragOverTimer);
        }
        console.log("onDragLeave: ", event);

        event.currentTarget.classList.remove("blink_me");
        event.currentTarget.classList.remove("blink_me_top_border");

        event.stopPropagation();
        event.preventDefault();
    }

    onRemoveUploadingFile(data, file: any) {
        this.uploadProcess.delete(file.key);
        data.files = data.files.filter(function(f) {
            return f.name !== file.key;
        });

        const header = "Upload " + data.files.length + (( data.files.length > 1) ? ' files' : ' file');
        data.title = header;
        if (this.uploadWindowRef) {
            this.uploadWindowRef.config.title = header;
        }

        if (data.files.length <= 0 || this.uploadProcess.size <= 0) {
            this.windowUploadButton = "Close";
        }
    }

    uploadFiles(data: any) {
        if (this.windowUploadButton === "Close") {
            this.uploadWindowRef.close();
            this.windowUploadButton = "Upload";
            return;
        }

        if (data.files.length <= 0 ) {
            this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Warning", message: "Not fond any files"}});
        }

        const row = data.row;
        const files = data.files;
        console.log("Data: ", data);


        from(files).pipe(map(file => file), mergeMap((file: any) => {
            this.windowUploadButton = "Uploading";
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

            console.log("STEP 1: ", dataUpload);
            return this.versionAddFileService.addFile(dataUpload).pipe(filter(resp => resp.message === "success" && resp.data && resp.data.upload_links.length > 0), map(r => {
                return {f: file, r};
            }));
        }),
        mergeMap(resp1 => {
            console.log("STEP 2: resp1", resp1);
            const parentLinkUpload = resp1.r.data.upload_links;
            let linkUpload;
            const file = resp1.f;
            const formData = new FormData();
            formData.append("file", file, file.name);
            linkUpload = parentLinkUpload[0].link;
            return this.versionAddFileService.uploadFileToAWS(formData, linkUpload ).pipe(map((r: HttpEvent<any>) => {
                switch (r.type) {
                    case HttpEventType.Sent:
                        console.log(`Uploading file "${file.name}" of size ${file.size}.`);
                    break;
                    case HttpEventType.UploadProgress:
                        const percentDone = Math.round(100 * r.loaded / r.total);
                        console.log( `File "${file.name}" is ${percentDone}% uploaded.`);
                        data.processes.set(file.name, percentDone);
                        break;
                    case HttpEventType.Response:
                        console.log( `File "${file.name}" was completely uploaded!`);
                        break;
                    default:
                        console.log( `File "${file.name}" surprising upload event: ${r.type}.`);
                }

                return {r: r, d: resp1.r.data, p: parentLinkUpload[0].part_idx};
            }));
        }),
        filter((event: any) => {
            console.log("STEP 3: filter", event);
            return event.r.type === HttpEventType.Response && event.r.headers.get("Etag") !== "";
        }),
        mergeMap((resp2: any) => {
            console.log("STEP 4: ", resp2);
            const Etag = resp2.r.headers.get("Etag");
            const listPartsFile = {
                etag: Etag,
                part_idx:  resp2.p,
            };
            const dataUploaded = {
                file_id: resp2.d.id,
                upload_id:  resp2.d.upload_id,
                uploaded_parts: [listPartsFile],
            };
            console.log("STEP 4 dataUploaded: ", dataUploaded);

            return this.versionAddFileService.completeUpload(dataUploaded).pipe(map(r => {
                console.log("STEP 4 completeUpload resp: ", r);

                this.toastrService.success(`File ` + r.data.name + ` uploaded successfully`, "Upload", { status: 'success' });

                return r;
            }));
        })).subscribe( (r) => {
            console.log("STEP 5:", r);
            console.log("STEP ------------");
        },
            (err) => {
                console.error("STEP FINAL error:", err);
                this.windowUploadButton = "Close";
                this.uploadProcess = new Map<string, number>();
            },
            () => {
                this.windowUploadButton = "Close";
                this.uploadProcess = new Map<string, number>();
                this.initSourceTree();
                console.log('STEP FINAL completed httpResult$');
            },
        );
    }

    downloadFile(dialog: NbDialogRef < any > , linkFile: string) {
        window.open(linkFile);
        dialog.close();
    }

    deleteFile(dialog: NbDialogRef < any > , data: DocumentInfo) {
        console.log("deleteFile - data:", data);
        if (data.type === "folder" || data.type === "dir") {
            this.fileService.deleteFolder(data.ver_source_id, data.key).pipe(filter(r => r.message === "success" && r.status === 200)).subscribe(resp => {
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "Folder " + data.name + " deleted successfully"}});
            }, err => {
                console.error(err);
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "Folder " + data.name + " deleted failed:"}});
            }, () => {
                this.initSourceTree();
                dialog.close();
            });
        } else {
            this.fileService.deleteFile(data.ver_source_id, data.key).pipe(filter(r => r.message === "success" && r.status === 200)).subscribe(resp => {
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "File " + data.name + " deleted successfully"}});
            }, err => {
                console.error(err);
                this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Delete", message: "File " + data.name + " deleted failed"}});
            }, () => {
                this.initSourceTree();
                dialog.close();
            });
        }
    }

    onVersionSelectionChange(version: string) {
        console.log("onVersionSelectionChange", version);
        if (version && version !== "") {
            for (const v of this.versionsTag) {
                if (v.version === version) {
                    this.versionSelected = v;
                    this.autoInput = version;
                    this.initSourceTree();
                    return;
                }
            }
            this.autoInput = this.versionSelected.version;
            console.log("onVersionSelectionChange: this.autoInput ", this.autoInput);
            this.dialogService.open<any>(this.dialogInformation, { autoFocus: true, context: {title: "Error", message: "Version " + version + " is invalid"}});
        }
    }

    ngOnDestroy() {
    }
}
