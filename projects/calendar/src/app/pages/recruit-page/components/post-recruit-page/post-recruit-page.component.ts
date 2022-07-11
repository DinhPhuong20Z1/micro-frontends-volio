import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-post-recruit-page',
  templateUrl: './post-recruit-page.component.html',
  styleUrls: ['./post-recruit-page.component.scss'],
})
export class PostRecruitPageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}
  id: string | null;

  ngOnInit(): void {
    // console.log("this.route.path: ", this.route.path)
    // console.log("this.route.path: ", this.route.path)
    this.id = this.route.snapshot.paramMap.get('id');
    // this.route.queryParams.subscribe((params) => {
    //   console.log(params); // { orderby: "price" }
    //   this.orderby = params.orderby;
    //   console.log(this.orderby); // price
    // });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogRecruitPage, {
      width: '600px',
      height: '600px',
      // data: {name: this.name, animal: this.animal},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'dialog-recruit-page',
  templateUrl: 'dialog-recruit-page.component.html',
  styleUrls: ['./post-recruit-page.component.scss'],
})
export class DialogRecruitPage {
  datafile: number = 0;
  files: any = []
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  success = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogRecruitPage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  getErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.emailFormControl.hasError('email') ? 'Not a valid email' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialog() {}

  onFileSelected(event: any) {
    const file = event.target.files;
    for (let i = 0; i < file.length; i++) {
      let dup = this.files.filter((j: any) => j.name === file[i].name);
      if (dup.length === 0) {
        this.files.push(file[i]);
      }

    }
    this.totalSizeFile();
    console.log('datafile', this.datafile);
    if (file) {
      const formData = new FormData();
      formData.append('thumbnail', file);
    }
  }

  handleFileDelete(f: any) {
    const deleteData = this.files.filter((i: any, idx: any) => idx !== f);
    this.files = deleteData;
    this.totalSizeFile();
  }

  totalSizeFile() {
    let totalData = 0;
    for (let j = 0; j < this.files.length; j++) {
      totalData += this.files[j].size;
    }
    console.log('totalData', totalData);
    console.log('files', this.files);

    let fSize = totalData / 1024;
    console.log('fSize', fSize);
    let sizeMB = fSize / 1024;
    this.datafile = Number(sizeMB.toFixed(2));
  }
}
