import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { IobrokerService } from './iobroker.service';
import { BrokerBoolState } from '@mrjpeterj/broker-lib';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    private broker: IobrokerService;

    public hasAmp: Observable<boolean> | null;

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.hasAmp = null;
    }

    ngOnInit() {
        this.broker.GetDeviceFor('ping.0.fire').subscribe({
            next: (device) => {
                const channel = device.GetChannelFor(device.id);
                if (channel != null) {
                    const ampState = channel.GetState(channel.id + '.Amp');
                    const boolState = ampState as BrokerBoolState;
                    const listener = boolState.ListenForValue();

                    this.hasAmp = listener;
                }
            }
        });
    }
}
