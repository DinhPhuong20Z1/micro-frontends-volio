import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from './../../@core/service/data.service';
import { Family } from './../../@core/models/family';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
    loading = false;
    // username: String ;
    password: String ;
    username: String;
    private families : Family[] = [];

    nameRq = new FormControl('', [Validators.required]);
  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  getErrorMessageUser() {
    if (this.nameRq.hasError('required')) {
      return 'Thiếu tên đăng nhập';
    }

    return this.nameRq.hasError('nameRq') ? 'Not a valid name' : '';
  }

  getErrorMessagePass() {
    if (this.nameRq.hasError('required')) {
      return 'Thiếu mật khẩu';
    }

    return this.nameRq.hasError('nameRq') ? 'Not a valid name' : '';
  }

  sumbitForm() {
    this.dataService.get_families().subscribe((res)=>{
        // this.families = res;
      });
  }

}
