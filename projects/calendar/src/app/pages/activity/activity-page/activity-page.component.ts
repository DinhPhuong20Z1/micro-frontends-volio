import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';



@Component({
    selector: 'app-activity-page',
    templateUrl: './activity-page.component.html',
    styleUrls: ['./activity-page.component.scss']
})


export class ActivityPageComponent implements OnInit {




    limit: number = 10; // <==== Edit this number to limit API results
    customOptions: OwlOptions = {
        loop: true,
        // autoplay: true,
        center: true,
        dots: false,
        // autoHeight: true,
        // autoWidth: true,
        URLhashListener: true,
        autoplayHoverPause: true,
        startPosition: 'URLHash',
        nav: true,
        navText: ["<div class='nav-btn prev-slide'><span class='material-symbols-outlined'>west</span></div>", "<div class='nav-btn next-slide'><span class='material-symbols-outlined'>east</span></div>"],
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1,
            },
            1000: {
                items: 1,
            }
        }
    }
    constructor(

    ) {}

    ngOnInit(): void {

    }


}
