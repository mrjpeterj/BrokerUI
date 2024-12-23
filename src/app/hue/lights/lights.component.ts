import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { IobrokerService } from '../../iobroker.service';

import { LightComponent } from '../light/light.component';
import { LightState } from '../lightstate';
import { RoomsComponent } from '../rooms/rooms.component';

@Component({
    selector: 'app-hue-lights',
    templateUrl: './lights.component.html',
    styleUrls: ['./lights.component.scss'],
    providers: [IobrokerService],
    imports: [
        CommonModule,
        MatButtonModule,
        LightComponent
    ]
})
export class LightsComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialog;

    public lights: LightState[];

    constructor(broker: IobrokerService, dialog: MatDialog) {
        this.broker = broker;
        this.dialog = dialog;

        this.lights = [];
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('hue.0').subscribe({
            next: (device) => {
                const roleNames = device.GetRoles();
                const lightRoles = roleNames.filter((name) => name.startsWith('light.'));

                for (const roleName of lightRoles) {
                    const role = device.GetRole(roleName);

                    const lightList = role.items.sort((a, b) => a.name.localeCompare(b.name) );

                    for (const channel of lightList) {
                        this.lights.push(new LightState(channel, this.broker));
                    }
                }
            }
        });
    }

    public ShowRoomDialog() {
        this.dialog.open(RoomsComponent, {

        });
    }
}
