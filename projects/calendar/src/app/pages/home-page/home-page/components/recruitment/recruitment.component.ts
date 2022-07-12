import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-recruitment',
    templateUrl: './recruitment.component.html',
    styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {
    customOptions: OwlOptions = {
        // center:true,
        // mouseDrag: true,
        // touchDrag: true,
        // pullDrag: true,
        // freeDrag: true,
        // loop: true,
        // dots: false,
        // autoHeight: true,
        // autoWidth: true,
        // URLhashListener: true,
        // startPosition: 'URLHash',
        // nav: true,
        // animateOut: 'fadeOut',
        // animateIn: "fadeIn",
        // dragEndSpeed: true,
        // lazyLoad: true,
        // items: 2
        items : 2,
        margin: 20,
        nav: true,
        navText : ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
        dots: false,
        center: true,
        loop: true,
        responsive: {
            0: {
                items: 1
            },
            800: {
                items: 2,
            },
            1000: {
                items: 3,
            }
        }
    }

    dataRecruitment = [{
            title: 'Frontend (WebApp) Developer 1',
            amount: '999.999.999',
            deadline: '12/05/2021',
            des: 'Tham gia phát triển các dự án của công ty. Lập trình xây dựng core, front end cho các hệ thống của công ty và người dùng Thực hiện phát triển các dự án bằng ngôn ngữ React, VueJS, AngularJS, PHP...',
            tag: 'new',
            index: '1'
        },
        {
            title: 'Frontend (WebApp) Developer 2',
            amount: '999.999.999',
            deadline: '12/05/2021',
            des: 'Tham gia phát triển các dự án của công ty. Lập trình xây dựng core, front end cho các hệ thống của công ty và người dùng Thực hiện phát triển các dự án bằng ngôn ngữ React, VueJS, AngularJS, PHP...',
            tag: 'new',
            index: '2'
        },
        {
            title: 'Frontend (WebApp) Developer 3',
            amount: '999.999.999',
            deadline: '12/05/2021',
            des: 'Tham gia phát triển các dự án của công ty. Lập trình xây dựng core, front end cho các hệ thống của công ty và người dùng Thực hiện phát triển các dự án bằng ngôn ngữ React, VueJS, AngularJS, PHP...',
            tag: 'hot',
            index: '3'
        },
    ]
    constructor() {}

    ngOnInit(): void {}

}
