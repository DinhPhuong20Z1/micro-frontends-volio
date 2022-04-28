import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { FilesData } from '../../../../@core/data/files';



@Component({
    selector: 'ngx-add-folder',
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss'],
})
export class AddFolderComponent implements OnInit {
    name: string = '';
    dataIndexFolder: any = {};
    data: any = {};
    positions = NbGlobalPhysicalPosition;
    constructor(
        protected ref: NbDialogRef < AddFolderComponent > ,
        private toastrService: NbToastrService,
        private sourceTreeService: FilesData,
    ) {}

    ngOnInit(): void {}

    dismiss() {
        this.ref.close();
    }


    showToast(position, status, name: string) {
        this.ref.close();
        this.callAddFolder(position, status, name);
    }
    callAddFolder(position, status, name) {
        let formatName;
        let searchIndex;
        let searchIndexChild;
        for (let i = 0; i < this.data.length; i++) {
            if (
                this.dataIndexFolder &&
                this.dataIndexFolder.children &&
                this.dataIndexFolder.children.length > 0
            ) {
                searchIndex = this.data.findIndex(
                    (d) => d.data.name === this.dataIndexFolder.data.name,
                );
            } else {
                if (
                    this.data[i].children.findIndex(
                        (d) => d.data.name === this.dataIndexFolder.data.name,
                    ) >= 0
                ) {
                    searchIndexChild = this.data[i].children.findIndex(
                        (d) => d.data.name === this.dataIndexFolder.data.name,
                    );
                    searchIndex = this.data.findIndex(
                        (d) => d.data.name === this.data[i].data.name,
                    );
                }
            }
        }

        if (searchIndexChild >= 0) {
            formatName = `${this.data[searchIndex].data.name}/${name}`;
        }
        if (searchIndex >= 0 && !searchIndexChild) {
            formatName = name;
        }
        this.sourceTreeService.addFolderData(25, formatName).subscribe(resp => {

        }, err => {

        }, () => {

        }).unsubscribe();
        this.toastrService.show(status || 'Success', `Tải file lên thành công`, { position, status });

    }



}
