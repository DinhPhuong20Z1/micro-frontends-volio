import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbWindowService } from '@nebular/theme';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbTokenService, NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;

    private destroy$: Subject < void > = new Subject < void > ();
    userPictureOnly: boolean = false;
    user: any;

    themes = [{
            value: 'default',
            name: 'Light',
        },
        {
            value: 'dark',
            name: 'Dark',
        },
        {
            value: 'cosmic',
            name: 'Cosmic',
        },
        {
            value: 'corporate',
            name: 'Corporate',
        },
    ];

    currentTheme = 'default';

    userMenu = [{
        title: 'Profile',
    }, {
        title: 'Log out',
    }];


    constructor(private sidebarService: NbSidebarService,
        // @Inject(NB_WINDOW) private window)
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private userService: UserData,
        private layoutService: LayoutService,
        private breakpointService: NbMediaBreakpointsService,
        private windowService: NbWindowService,
        private router: Router,
        private tokenService: NbTokenService,
        private authService: NbAuthService) {}

    ngOnInit() {
        this.currentTheme = this.themeService.currentTheme;

        this.userService.getUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((users: any) => this.user = users.nick);

        const {xl} = this.breakpointService.getBreakpointsMap();
        this.themeService.onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$),
            )
            .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

        this.themeService.onThemeChange()
            .pipe(
                map(({
                    name,
                }) => name),
                takeUntil(this.destroy$),
            )
            .subscribe(themeName => this.currentTheme = themeName);

        this.menuService.onItemClick().pipe(filter(({ tag }) => tag === 'headerMenuContext'), map(({ item: { title } }) => title)).subscribe(title => {
            // this.windo.alert(`${title} was clicked!`)
            switch (title) {
                case "Profile":
                    this.router.navigate(['/pages/profile']);
                    break;
                case "Log out":
                    this.authService.logout("email").subscribe(data => {
                        this.router.navigate(['/auth/login']);
                    });
                    break;
                default:
                    this.router.navigate(['/pages/profile']);
                    break;
            }
        });

        this.tokenService.get().subscribe((token: NbAuthJWTToken) => {
            if (!!token.getPayload()) {
                this.user.name = token.getPayload().name;
                if (token.getPayload().avatar) {
                    this.user.picture = token.getPayload().avatar;
                }
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }

    openNotifications() {
        console.log("openNotifications");
    }
}
