import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-amp-mute',
    templateUrl: './mute.component.html',
    styleUrls: ['./mute.component.scss']
})
export class MuteComponent {

    @Input()
    public mute: boolean;

    @Output()
    public readonly changed: EventEmitter<boolean>;

    constructor() {
        this.mute = false;

        this.changed = new EventEmitter();
    }

    public ToggleMute() {
        this.mute = !this.mute;

        this.changed.next(this.mute);
    }
}
