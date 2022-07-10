import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  myFunction() {
    var x = document.getElementById('menu-mobile');
    if (x != null) {
      if (x.style.left === '0px') {
        // if (x.className === "topnav") {
        //   x.className += " responsive";
        // } else {
        //   x.className = "topnav";
        // }
        x.style.left = '-300px';
      } else {
        x.style.left = '0px';
      }
    }

  }
}
