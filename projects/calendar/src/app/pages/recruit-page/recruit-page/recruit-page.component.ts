import { Component, OnInit } from '@angular/core';

interface Location {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-recruit-page',
  templateUrl: './recruit-page.component.html',
  styleUrls: ['./recruit-page.component.scss']
})
export class RecruitPageComponent implements OnInit {
  locations: Location[] = [
    {value: 'backend', viewValue: 'Backend'},
    {value: 'marketing', viewValue: 'Marketing Mobile App'},
    {value: 'hr', viewValue: 'HR'},
  ];
  dataRecruitment = [
    {title: 'Frontend (WebApp) Developer 1', amount: '999.999.999',level: 'new', id: '1'},
    {title: 'Nhân viên Marketing mobile app', amount: '999.999.999',level: 'hot', id: '2'},
    {title: 'Lập trình viên DevOps Engineer', amount: '999.999.999',level: 'new', id: '3'},
    {title: 'Nhân viên Marketing mobile app - Nhân viên Marketing mobile app', amount: '999.999.999',level: 'new', id: '4'},
    {title: 'Quản trị cơ sở dữ liệu (DBA)', amount: '999.999.999',level: 'new', id: '5'},
    {title: 'Nhân viên Marketing mobile app', amount: '999.999.999',level: 'new', id: '6'},
    {title: 'Quản trị cơ sở dữ liệu (DBA) - Database Administrator - Bảo mật dữ liệu', amount: '999.999.999',level: 'new', id: '7'},
    {title: 'Frontend (WebApp) Developer', amount: '999.999.999',level: 'new', id: '8'},
    {title: 'Lập trình viên DevOps Engineer', amount: '999.999.999',level: 'new', id: '9'},
    {title: 'Frontend (WebApp) Developer', amount: '999.999.999',level: 'new', id: '10'},

  ]
  constructor() { }

  ngOnInit(): void {
  }

}
