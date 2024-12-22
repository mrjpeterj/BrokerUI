import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';

import { LightState } from '../lightstate';

@Component({
    selector: 'app-hue-lightsettings',
    templateUrl: './lightsettings.component.html',
    styleUrls: ['./lightsettings.component.scss'],
    standalone: false
})
export class LightsettingsComponent implements OnInit {

    public light: LightState;

    public brightMin: number;
    public brightMax: number;

    constructor(@Inject(MAT_DIALOG_DATA) data: LightState) {

        this.light = data;

        const bright = this.light.GetBrightnessState();
        if (bright.minVal != null) {
            this.brightMin = bright.minVal;
        } else {
            this.brightMin = 0;
        }
        if (bright.maxVal != null) {
            this.brightMax = bright.maxVal;
        } else {
            this.brightMax = 0;
        }
    }

    ngOnInit(): void {
    }

    public OnChanged(event: MatSliderChange) {
        if (event.value != null) {
            this.light.UpdateBrightness(event.value);
        }
    }
}
