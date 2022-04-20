import {
    Directive,
    Input,
    OnInit
} from '@angular/core';
import {
    ElementRef
} from '@angular/core';
import {
    AnimationPlayer,
    AnimationBuilder,
    AnimationMetadata,
    animate,
    style,
} from '@angular/animations';

@Directive({
    selector: '[zetFadeInOut]',
})
export class FadeInOutDirective implements OnInit {
    player: AnimationPlayer;

    isShow: boolean = false;

    @Input()
    set show(show: boolean) {
        this.isShow = show;
        if (this.player) {
            this.player.destroy();
        }

        const metadata = show ? this.fadeIn() : this.fadeOut();

        const factory = this.builder.build(metadata);
        const player = factory.create(this.el.nativeElement);

        player.play();
    }

    constructor(private builder: AnimationBuilder, private el: ElementRef) {}

    ngOnInit(): void {
    }

    private fadeIn(): AnimationMetadata[] {
        return [
            style({
                opacity: 0
            }),
            animate('400ms ease-in', style({
                opacity: 1
            })),
        ];
    }

    private fadeOut(): AnimationMetadata[] {
        return [
            style({
                opacity: '*'
            }),
            animate('400ms ease-in', style({
                opacity: 0
            })),
        ];
    }
}
