import { AnimationMetadata, style, animate, AnimationBuilder, AnimationPlayer, state, transition } from '@angular/animations';
import { AfterViewInit, ElementRef } from '@angular/core';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[AnimatedBlink]',
})
export class AnimatedBlinkDirective implements AfterViewInit {
    durationValue: number = 1000;

    @Input()
    set duration(duration: number) {
        this.durationValue = Number(duration);
    }

    constructor(private builder: AnimationBuilder, private el: ElementRef) {}

    player: AnimationPlayer;
    ngAfterViewInit(): void {
        if (this.player) {
            this.player.destroy();
        }

        const factory = this.builder.build(this.blink());
        this.player = factory.create(this.el.nativeElement);

        this.player.play();
    }

    private blink(): AnimationMetadata[] {
        return [
            state("hide", style({opacity: 0})),
            state("show", style({opacity: 1})),
            transition({fromState: "hide", toState: "show" }, [animate(1000)]),
        ];
    }
}
