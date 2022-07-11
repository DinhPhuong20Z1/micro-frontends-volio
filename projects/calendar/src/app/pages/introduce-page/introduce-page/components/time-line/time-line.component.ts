import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {
  customOptions: OwlOptions = {
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    startPosition: 4,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    nav: true,
    navText:["<div class='nav-btn prev-slide'><span class='material-symbols-outlined'>west</span></div>","<div class='nav-btn next-slide'><span class='material-symbols-outlined'>east</span></div>"],
  }

  constructor() { }

  ngOnInit(): void {



  }




}
