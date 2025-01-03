import { CommonModule } from '@angular/common';
import { Component, OnInit, model, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LightState } from '../lightstate';
import { LightsettingsComponent } from '../lightsettings/lightsettings.component';

@Component({
    selector: 'app-hue-light',
    templateUrl: './light.component.html',
    styleUrls: ['./light.component.scss'],
    imports: [
        CommonModule,

        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule
    ]
})
export class LightComponent implements OnInit {

    public readonly state = model.required<LightState>();

    private dialog: MatDialog;

    constructor() {
        const dialog = inject(MatDialog);

        this.dialog = dialog;
    }

    ngOnInit(): void {
    }

    public OnChanged(state: MatSlideToggleChange) {
        var lightState = this.state();

        if (lightState) {
            lightState.UpdateOnState(state.checked);
        }
    }

    public ShowDialog() {
        this.dialog.open<LightsettingsComponent, LightState>(LightsettingsComponent, {
            data: this.state()
        });
    }
}
