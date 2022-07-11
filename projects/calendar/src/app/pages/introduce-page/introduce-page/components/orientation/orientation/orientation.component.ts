import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-orientation',
    templateUrl: './orientation.component.html',
    styleUrls: ['./orientation.component.scss'],
})
export class OrientationComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        window.onscroll = function () {
            myFunction();
        };
        function myFunction() {
            let element = document.getElementById('myOrientation').offsetTop;
            if (document.documentElement.scrollTop >= element) {
                document.getElementById('myPillar').classList.add('slideUp');
            }
        }
    }
}
