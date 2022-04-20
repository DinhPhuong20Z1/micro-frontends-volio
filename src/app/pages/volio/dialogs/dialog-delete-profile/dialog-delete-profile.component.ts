import {
    Component
} from '@angular/core';
import {
    NbDialogRef
} from '@nebular/theme';

@Component({
    selector: 'ngx-dialog-delete-profile',
    templateUrl: 'dialog-delete-profile.component.html',
    styleUrls: ['dialog-delete-profile.component.scss'],
})
export class DialogDeleteProfileComponent {

    constructor(protected ref: NbDialogRef < DialogDeleteProfileComponent > ) {}

    onOke() {
        this.ref.close(true);
    }

    cancel() {
        this.ref.close(false);
    }
}
