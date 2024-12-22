import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IobrokerService } from '../iobroker.service';
import { BrokerBoolState } from '@mrjpeterj/broker-lib';

class MachineState {
    public name: string;
    public state: Observable<string>;

    constructor(name: string, state: Observable<boolean>) {
        this.name = name;
        this.state = state.pipe(
            map((val) => {
                if (val) {
                    return 'On';
                } else {
                    return 'Off';
                }
            })
        );
    }
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [IobrokerService],
    standalone: false
})
export class ListComponent implements OnInit {

    private broker: IobrokerService;

    public listeners: MachineState[];

    constructor(broker: IobrokerService) {
        this.broker = broker;
        this.listeners = [];
    }

    ngOnInit() {
        this.broker.GetDeviceFor('ping.0.fire').subscribe({
            next: (device) => {
                const channel = device.GetChannelFor(device.id);
                if (channel != null) {
                    const states = channel.GetStates();

                    for (const state of states) {
                        const boolState = state as BrokerBoolState;
                        const listener = boolState.ListenForValue();
                        const stateHolder = new MachineState(state.name.substring(6), listener);

                        this.listeners.push(stateHolder);
                    }
                }
            }
        });
    }
}
