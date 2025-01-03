import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { IobrokerService } from './iobroker.service';
import { BrokerBoolState } from '@mrjpeterj/broker-lib';

import { AirComponent } from './air/air.component';
import { AmpComponent } from './amp/amp.component';
import { LightsComponent } from './hue/lights/lights.component';
import { ListComponent } from './list/list.component';
import { OptionsComponent } from './options/options.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule,

        LightsComponent,
        ListComponent,
        AirComponent,
        AmpComponent,
        OptionsComponent,
    ]
})
export class AppComponent implements OnInit {

    private broker: IobrokerService;

    public hasAmp: Observable<boolean> | null;

    constructor() {
        const broker = inject(IobrokerService);

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
