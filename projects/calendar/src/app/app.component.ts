import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    title = 'web-volio';
    isSticky: boolean = false;
    showScroll: boolean;
    showScrollHeight = 300;
    hideScrollHeight = 10;

    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

        if (scrollPosition >= this.showScrollHeight) {
            this.showScroll = true;
        } else {
            this.showScroll = false;
        }

        this.isSticky = window.pageYOffset > 0;
    }

    scrollToTop() {
        (function smoothscroll() {
            var currentScroll =
                document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - currentScroll / 5);
            }
        })();
    }

    ngAfterViewInit() {
        var header = document.getElementById('myHeader');
        (function () {
            var previousScroll = 0;

            $(window).scroll(function () {
                var currentScroll = $(this).scrollTop();
                if (currentScroll > previousScroll) {
                    header.classList.add('header-up');
                    header.classList.remove('header-down');
                } else {
                    header.classList.add('header-down');
                    header.classList.remove('header-up');
                }
                previousScroll = currentScroll;
                if (currentScroll == 0) {
                    header.classList.remove('header-down');
                    header.classList.remove('header-up');
                }
            });
        })(); //run this anonymous function immediately
    }
}
