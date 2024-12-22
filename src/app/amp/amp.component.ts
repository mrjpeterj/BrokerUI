import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BrokerBoolState, BrokerNumberState } from '@mrjpeterj/broker-lib';

import { IobrokerService } from '../iobroker.service';

@Component({
    selector: 'app-amp',
    templateUrl: './amp.component.html',
    styleUrls: ['./amp.component.scss'],
    standalone: false
})
export class AmpComponent implements OnInit {

    private broker: IobrokerService;

    private muteState: BrokerBoolState | null;
    public muted: Observable<boolean> | null;

    public volume: BrokerNumberState | null;
    public maxVol: Observable<number> | null;

    private volumeUp: BrokerBoolState | null;
    private volumeDown: BrokerBoolState | null;

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.muteState = null;
        this.muted = null;

        this.volume = null;
        this.maxVol = null;

        this.volumeUp = null;
        this.volumeDown = null;
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('denon.0').subscribe({
            next: (device) => {
                // const infoChannel = device.GetChannelFor(device.id + '.info');
                const zoneChannel = device.GetChannelFor(device.id + '.zoneMain');

                // const nameState = infoChannel?.GetState(infoChannel.id + '.friendlyName');

                this.volume = zoneChannel?.GetState(zoneChannel.id + '.volume') as BrokerNumberState;
                const maxLevelState = zoneChannel?.GetState(zoneChannel.id + '.maximumVolume') as BrokerNumberState;
                this.volumeUp = zoneChannel?.GetState(zoneChannel.id + '.volumeUp') as BrokerBoolState;
                this.volumeDown = zoneChannel?.GetState(zoneChannel.id + '.volumeDown') as BrokerBoolState;

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

    public VolumeUp() {
        if (this.volumeUp) {
            this.broker.SetState(this.volumeUp, true);
        }
    }

    public VolumeDown() {
        if (this.volumeDown) {
            this.broker.SetState(this.volumeDown, true);
        }
    }

    public SetMuted(val: boolean) {
        if (this.muteState) {
            this.broker.SetState(this.muteState, val);
        }
    }
}
