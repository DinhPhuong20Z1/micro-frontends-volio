import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduce-page',
  templateUrl: './introduce-page.component.html',
  styleUrls: ['./introduce-page.component.scss']
})
export class IntroducePageComponent implements OnInit {

  public routerLinkVariable = "/gioi-thieu";
  constructor() { }

  ngOnInit(): void {
  }


}
