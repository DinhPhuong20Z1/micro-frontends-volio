import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calendar';

  isSticky: boolean = false
  showScroll: boolean;
    showScrollHeight = 300;
    hideScrollHeight = 10;

    @HostListener('window:scroll', [])
    onWindowScroll()
    {
      if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight)
      {
          this.showScroll = true;
      }
      else if ( this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight)
      {
        this.showScroll = false;
      }
    }

    scrollToTop()
    {
      (function smoothscroll()
      { var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0)
        {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
      })();
    }

    ;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }
}
