import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    slideIndex = 1;
    constructor() {}

    ngOnInit(): void {
        this.showSlides(this.slideIndex);
    }

    plusSlides(n: any) {
        this.showSlides((this.slideIndex += n));
    }

    currentSlide(n: any) {
        this.showSlides((this.slideIndex = n));
    }

    showSlides(n: any) {
        let i;
        let slides = document.getElementsByClassName(
            'mySlides'
        ) as HTMLCollectionOf<HTMLElement>;
        let dots = document.getElementsByClassName(
            'dot'
        ) as HTMLCollectionOf<HTMLElement>;
        if (n > slides.length) {
            this.slideIndex = 1;
        }
        if (n < 1) {
            this.slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        // this.slideIndex++;
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(' active', '');
        }
        slides[this.slideIndex - 1].style.display = 'block';
        dots[this.slideIndex - 1].className += ' active';
        // setTimeout(this.showSlides, 2000); // Change image every 2 seconds
    }

    openTabs(index: any) {
        localStorage.setItem('indexTabs', index);
    }
}
