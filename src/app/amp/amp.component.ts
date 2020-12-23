import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BrokerBoolState } from '../broker/boolstate';
import { BrokerIntState } from '../broker/numberstate';
import { BrokerStringState } from '../broker/stringstate';
import { IobrokerService } from '../iobroker.service';

@Component({
    selector: 'app-amp',
    templateUrl: './amp.component.html',
    styleUrls: ['./amp.component.scss']
})
export class AmpComponent implements OnInit {

    private broker: IobrokerService;

    private muteState: BrokerBoolState | null;
    public muted: Observable<boolean> | null;

    public volume: BrokerIntState | null;
    public maxVol: Observable<number> | null;

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.muteState = null;
        this.muted = null;

        this.volume = null;
        this.maxVol = null;
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('denon.0').subscribe({
            next: (device) => {
                const infoChannel = device.GetChannelFor(device.id + '.info');
                const zoneChannel = device.GetChannelFor(device.id + '.zoneMain');

                const nameState = infoChannel?.GetState(infoChannel.id + '.friendlyName');

                this.volume = zoneChannel?.GetState(zoneChannel.id + '.volume') as BrokerIntState;
                const maxLevelState = zoneChannel?.GetState(zoneChannel.id + '.maximumVolume') as BrokerIntState;

                this.muteState = zoneChannel?.GetState(zoneChannel.id + '.muteIndicator') as BrokerBoolState;

                if (this.muteState) {
                    this.muted = this.muteState.ListenForValue();
                }

                if (maxLevelState) {
                    this.maxVol = maxLevelState.ListenForValue();
                }
            }
        });
    }

    public SetMuted(val: boolean) {
        if (this.muteState) {
            this.broker.SetState(this.muteState, val);
        }
    }
}
