import { Observable } from 'rxjs';

import { IobrokerService } from '../iobroker.service';
import { BrokerChannel } from '../broker/channel';
import { BrokerBoolState } from '../broker/boolstate';
import { BrokerIntState } from '../broker/numberstate';

export class LightState {
    private channel: BrokerChannel;

    private onState: BrokerBoolState;
    private briState: BrokerIntState;

    private broker: IobrokerService;

    public onSwitch: Observable<boolean>;
    public brightness: Observable<number>;

    constructor(channel: BrokerChannel, broker: IobrokerService) {
        this.channel = channel;
        this.broker = broker;

        this.onState = channel.GetState(channel.id + '.on') as BrokerBoolState;
        this.briState = channel.GetState(channel.id + '.bri') as BrokerIntState;

        this.onSwitch = this.onState.ListenForValue();
        this.brightness = this.briState.ListenForValue();
    }

    public get Name(): string {
        return this.channel.name;
    }

    public GetBrightnessState(): BrokerIntState {
        return this.briState;
    }

    public UpdateOnState(value: boolean) {
        this.broker.SetState(this.onState, value);
    }

    public UpdateBrightness(value: number) {
        this.broker.SetState(this.briState, value);
    }
}
