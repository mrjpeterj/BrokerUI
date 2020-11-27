import { Component, OnInit } from '@angular/core';
import { IobrokerService } from '../iobroker.service';
import { Observable } from 'rxjs';

class MachineState {
    public name: string;
    public state: Observable<boolean>;

    constructor(name: string, state: Observable<boolean>) {
        this.name = name;
        this.state = state;
    }
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.sass'],
    providers: [IobrokerService]
})
export class ListComponent implements OnInit {

    private broker: IobrokerService;

    public listeners: MachineState[];

    constructor(broker: IobrokerService) {
        this.broker = broker;
        this.listeners = [];
    }

    ngOnInit() {
        this.broker.GetDeviceFor('ping.0.pi1').subscribe({
            next: (device) => {
                const channel = device.GetChannelFor(device.id);
                if (channel != null) {
                    const states = channel.GetStates();

                    for (const state of states) {
                        const listener = state.ListenForBool();
                        const stateHolder = new MachineState(state.name.substring(6), listener);

                        this.listeners.push(stateHolder);
                    }
                }
            }
        });
    }
}
