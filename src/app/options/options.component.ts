import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Observable } from 'rxjs';

import { BrokerBoolState } from '@mrjpeterj/broker-lib';

import { IobrokerService } from '../iobroker.service';

class BoolOptionHolder {

    private broker: IobrokerService;

    public name: string;
    public value: Observable<boolean>;

    private state: BrokerBoolState;

    constructor(name: string, state: BrokerBoolState, broker: IobrokerService)
    {
        this.broker = broker;

        this.name = name;
        this.value = state.ListenForValue();

        this.state = state;
    }

    public UpdateState(state: MatSlideToggleChange) {
        this.broker.SetState(this.state, state.checked);
    }
}

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: false
})
export class OptionsComponent implements OnInit {

    private broker: IobrokerService;

    public boolOptions: BoolOptionHolder[];

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.boolOptions = [];
     }

    ngOnInit(): void {
        this.broker.GetDeviceFor('0_userdata.0.ifttt').subscribe({
            next: (device) => {
                const channel = device.GetChannelFor(device.id + '.options');
                if (channel != null) {
                    for (const state of channel.GetStates()) {
                        if (state.StateType == "boolean") {
                            const boolState = state as BrokerBoolState;

                            this.boolOptions.push(new BoolOptionHolder(state.name, boolState, this.broker));
                        }
                    }
                }
            }
        });
    }
}
