import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-amp-mute',
    templateUrl: './mute.component.html',
    styleUrls: ['./mute.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ]
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
