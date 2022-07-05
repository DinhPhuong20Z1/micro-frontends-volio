import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-meta',
  templateUrl: './dialog-meta.component.html',
  styleUrls: ['./dialog-meta.component.scss']
})
export class DialogMetaComponent implements OnInit {
    @Input() title: string;
  constructor(protected ref: NbDialogRef<DialogMetaComponent>) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close();
  }

}
