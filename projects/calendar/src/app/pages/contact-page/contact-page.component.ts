import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit {
  datafile: number = 0;
  files: any = [];

  nameRq = new FormControl('', [Validators.required]);

  constructor() {}

  ngOnInit(): void {}

  sumbitForm() {

  }

  getErrorMessage() {
    if (this.nameRq.hasError('required')) {
      return 'You must enter a value';
    }

    return this.nameRq.hasError('nameRq') ? 'Not a valid name' : '';
  }

  onFileSelected(event: any) {
    const file = event.target.files;
    console.log('file', file);
    for (let i = 0; i < file.length; i++) {
      let dup = this.files.filter((j: any) => j.name === file[i].name).length;
      if (dup === 0) {
        this.files.push(file[i]);
      }
    }
    this.totalSizeFile();
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
