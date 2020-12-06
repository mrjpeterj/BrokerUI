import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { LightState } from '../lightstate';
import { LightsettingsComponent } from '../lightsettings/lightsettings.component';

@Component({
    selector: 'app-hue-light',
    templateUrl: './light.component.html',
    styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnInit {

    @Input()
    public state: LightState | null;

    private dialog: MatDialog;

    constructor(dialog: MatDialog) {
        this.dialog = dialog;

        this.state = null;
    }

    ngOnInit(): void {
    }

    public OnChanged(state: MatSlideToggleChange) {
        if (this.state != null) {
            this.state.UpdateOnState(state.checked);
        }
    }

    public ShowDialog() {
        this.dialog.open(LightsettingsComponent, {
            data: this.state
        });
    }
}
