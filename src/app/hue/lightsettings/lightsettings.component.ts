import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';

import { IobrokerService } from '../../iobroker.service';

import { LightState } from '../lightstate';

@Component({
    selector: 'app-hue-lightsettings',
    templateUrl: './lightsettings.component.html',
    styleUrls: ['./lightsettings.component.scss']
})
export class LightsettingsComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialogRef<LightsettingsComponent>;
    public light: LightState;

    public brightMin: number;
    public brightMax: number;

    constructor(broker: IobrokerService, dialogRef: MatDialogRef<LightsettingsComponent>, @Inject(MAT_DIALOG_DATA) data: LightState) {

        this.broker = broker;

        this.dialog = dialogRef;
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
