import {
    ElementRef,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {
    Directive,
    Input,
    OnChanges,
    OnInit
} from '@angular/core';

@Directive({
    selector: '[AnimatedDigit]'
})
export class AnimatedDigitDirective implements OnInit, OnChanges {
    durationValue: number = 1000;
    digitValue: number;
    stepsValue: number = 12;

    @Input()
    set duration(duration: number) {
        this.durationValue = Number(duration);
    }

    @Input()
    set digit(digit: number) {
        this.digitValue = Number(digit);
    }
    @Input()
    set steps(steps: number) {
        if (!!!steps) {
            steps = 12;
        }
        this.stepsValue = Number(steps);
    }

    constructor(private el: ElementRef ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["digit"]) {
            this.animateCount();
        }
    }

    ngOnInit(): void {
    }

    animateCount() {
        if (!this.durationValue) {
            this.durationValue = 1000;
        }

        if (typeof this.digitValue === "number") {
            this.counterFunc(this.digitValue, this.durationValue);
        }
    }

    counterFunc(endValue, durationMs) {
        if (!this.stepsValue) {
            this.stepsValue = 12;
        }

        const stepCount = Math.abs(durationMs / this.stepsValue);
        const valueIncrement = (endValue - 0) / stepCount;
        const sinValueIncrement = Math.PI / stepCount;

        let currentValue = 0;
        let currentSinValue = 0;

        let step = () => {
            currentSinValue += sinValueIncrement;
            currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

            this.el.nativeElement.innerHTML = "" + Math.abs(Math.floor(currentValue));

            if (currentSinValue < Math.PI) {
                window.requestAnimationFrame(step);
            }
        }

        step();
    }

    ngAfterViewInit() {
        if (!!this.digitValue) {
            this.animateCount();
        }
    }

}
