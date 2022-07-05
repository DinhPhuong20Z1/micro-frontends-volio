import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { CdkDragDrop, moveItemInArray, CdkDrag } from "@angular/cdk/drag-drop";
import { NbDialogService } from "@nebular/theme";

@Component({
    selector: "ngx-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
    movies = [
        "Trang chủ",
        "Giới thiệu",
        "Sản Phẩm",
        "Hoạt động",
        "Thư viện",
        "Tuyển dụng",
        "Liên hệ",
    ];
    @ViewChild("dialogEditMenu", { read: TemplateRef })
    dialogEditMenu: TemplateRef<HTMLElement>;
    nameEdit: string;
    nameAdd: string;
    urlNameEdit: string;
    UrlAdd: string;
    constructor(private dialogService: NbDialogService) {}

    ngOnInit(): void {}

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    }

    openEditMenu(index: number) {
        this.dialogService.open<any>(this.dialogEditMenu, {
            autoFocus: true,
            context: { indexMenu: index },
        });

        console.log("this.movies[index]", this.movies[index]);
        console.log("index", index);

        if (!this.nameEdit) {
            this.nameEdit = this.movies[index];
        }
    }

    onNameEditMenu(name) {
        this.nameEdit = name;
    }

    deleteMenu(index: number) {
        const deleteData = this.movies.filter(
            (i: any, idx: any) => idx !== index
        );
        this.movies = deleteData;
    }
    clickAddName(name: string) {
        console.log("nameAdd", this.nameAdd);

        this.movies.push(name);
        this.nameAdd = "";
    }

    onNameAddMenu(name: string) {
        this.nameAdd = name;
    }

    onUrlAddMenu(url: string) {
        this.UrlAdd = url;
    }
}
