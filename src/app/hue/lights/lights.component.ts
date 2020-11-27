import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { IobrokerService } from '../../iobroker.service';

class LightState {
    public name: string;
    public state: Observable<boolean>;

    constructor(name: string, state: Observable<boolean>) {
        this.name = name;
        this.state = state;
    }
}

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
                        const lightName = channel.name;
                        const lightState = channel.GetState(channel.id + '.on');
                        if (lightState != null) {
                            this.lights.push(new LightState(lightName, lightState.ListenForBool()));
                        }
                    }
                }
            }
        });
    }

}
