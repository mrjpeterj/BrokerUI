import { Component, OnInit } from '@angular/core';

import { IobrokerService } from '../../iobroker.service';
import { LightState } from '../lightstate';

@Component({
    selector: 'app-hue-lights',
    templateUrl: './lights.component.html',
    styleUrls: ['./lights.component.scss'],
    providers: [IobrokerService]
})
export class LightsComponent implements OnInit {

    private broker: IobrokerService;

    public lights: LightState[];

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.lights = [];
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('hue.0').subscribe({
            next: (device) => {
                const roleNames = device.GetRoles();
                const lightRoles = roleNames.filter((name) => name.startsWith('light.'));

                for (const roleName of lightRoles) {
                    const role = device.GetRole(roleName);

                    for (const channel of role.items) {
                        this.lights.push(new LightState(channel, this.broker));
                    }
                }
            }
        });
    }
}
