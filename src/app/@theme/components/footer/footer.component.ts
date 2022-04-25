import { Component } from '@angular/core';

@Component({
    selector: 'ngx-footer',
    styleUrls: ['./footer.component.scss'],
    template: `
        <span class="created-by">
            Created with ♥ by <b><a href="https://volio.vn" target="_blank">Volio</a></b> 2022
        </span>
        <div class="socials">
            <a href="https://volio.vn" target="_blank" class="ion ion-social"><img src="assets/images/volio.png"></a>
            <a href="https://www.facebook.com/volio.vn" target="_blank" class="ion ion-social-facebook"></a>
            <a href="https://www.linkedin.com/company/voliovietnam" target="_blank" class="ion ion-social-linkedin"></a>
        </div>`,
})
export class FooterComponent {
}
