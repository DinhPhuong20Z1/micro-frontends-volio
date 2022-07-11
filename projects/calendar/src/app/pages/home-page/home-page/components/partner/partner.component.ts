import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-partner',
    templateUrl: './partner.component.html',
    styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
    customOptions: OwlOptions = {
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: true,
        loop: true,
        autoplay: true,
        center: true,
        dots: false,
        autoHeight: true,
        autoWidth: true,
        URLhashListener: true,
        startPosition: 'URLHash',
        nav: false,
        animateOut: 'fadeOut',
        animateIn: "fadeIn",
        fluidSpeed: true,
        smartSpeed: 250,
        autoplaySpeed: 1000,
        autoplayTimeout: 1500,
        dragEndSpeed: true,
        autoplayHoverPause: true,
        lazyLoad: true,
        responsive: {
            200: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            }
        }
    }
    constructor() {}

    ngOnInit(): void {}
}
