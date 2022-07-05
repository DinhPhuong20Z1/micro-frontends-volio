import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UserTable } from '../../@core/data/user-table';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    settings = {
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          id: {
            title: 'ID',
            type: 'number',
          },
          username: {
            title: 'Username',
            type: 'string',
          },
          email: {
            title: 'E-mail',
            type: 'string',
          },
        },
      };



      source: LocalDataSource = new LocalDataSource();

  constructor(private service: UserTable) {
    const data = this.service.getData();
    this.source.load(data);
  }

  ngOnInit(): void {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
