import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
    constructor() {}

    ngOnInit(): void {
        let indexTabs = localStorage.getItem('indexTabs');

        if (indexTabs) {
            let tablinks = document.getElementsByClassName('tablink');
            tablinks[Number(indexTabs)].classList.add('active');
        } else {
            let tablinks = document.getElementsByClassName('tablink');
            tablinks[0].classList.add('active');
        }
    }
    openTab(evt: any, tabName: any) {
        var i, x, tablinks;
        x = document.getElementsByClassName(
            'itemContent'
        ) as HTMLCollectionOf<HTMLElement>;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = 'none';
        }
        tablinks = document.getElementsByClassName('tablink');
        for (i = 0; i < x.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(
                ' active',
                ''
            );
        }
        if (tabName != null) {
            let element = document.getElementById(tabName);
            if (element) {
                element.style.display = 'block';
            }
            evt.currentTarget.className += ' active';
        }
    }

    ngOnDestroy(): void {
        localStorage.removeItem('indexTabs');
    }
}
