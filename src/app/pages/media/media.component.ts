import { Component, OnInit } from "@angular/core";

@Component({
    selector: "ngx-media",
    templateUrl: "./media.component.html",
    styleUrls: ["./media.component.scss"],
})
export class MediaComponent implements OnInit {
    fileName = "";
    fileUoload: any;
    files: any = [];
    constructor() {}

    ngOnInit(): void {}

    previewFiles() {
        const preview = document.querySelector("#preview");
        const files = document.querySelector(
            "input[type=file]"
        ) as HTMLInputElement | null;

        function readAndPreview(file) {
            // Make sure `file.name` matches our extensions criteria
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                const reader = new FileReader();

                reader.addEventListener(
                    "load",
                    function () {
                        const image = new Image();
                        image.height = 180;
                        image.width = 180;
                        image.title = file.name;
                        image.src = this.result as string;
                        preview.appendChild(image);
                    },
                    false
                );

                reader.readAsDataURL(file);
            }
        }
        if (files.files) {
            [].forEach.call(files.files, readAndPreview);
        }
    }
}
