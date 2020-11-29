import { Component, OnInit, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { LightState } from '../lightstate';

@Component({
    selector: 'app-hue-light',
    templateUrl: './light.component.html',
    styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnInit {

    @Input()
    public state: LightState | null;;

    constructor() {
        this.state = null;
    }

    ngOnInit(): void {
    }

    public OnChanged(state: MatSlideToggleChange) {
        if (this.state != null) {
            this.state.UpdateState(state.checked);
        }
    }
}
