import { UserData, User } from '../../@core/data/users';
import { NbDialogService } from '@nebular/theme';

import {
    Component,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'ngx-profile',
    styleUrls: ['./profile.component.scss'],
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
    constructor(private userService: UserData, private dialogService: NbDialogService) {}

    user: User;
    userPictureOnly: boolean = false;
    currentPasswordType: string = 'password';
    ngOnInit() {
        this.userService.getUsers().subscribe((users: any) => this.user = users.nick);
    }

    getInputType(): string {
        return 'password';
    }

    toggleShowPassword(): void {
        if (this.currentPasswordType === 'password') {
            this.currentPasswordType = 'type';
        } else {
            this.currentPasswordType = 'password';
        }
    }
}
