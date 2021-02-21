import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as ioBroker from 'types/iobroker';

import { BrokerChannel } from './channel';
import { BrokerDevice } from './device';
import { BrokerState } from './state';

export class BrokerServices {
    private devices: BrokerDevice[];

    private devListening: {
        [key: string]: Subject<BrokerDevice>;
    };

    constructor() {
        this.devices = [];
        this.devListening = {};
    }

    public CreateDevice(name: string, deviceId: string, native: any) {
        const dev = new BrokerDevice(name, deviceId, native);
        this.devices.push(dev);

        const listener = this.devListening[deviceId];
        if (listener != null) {
            listener.next(dev);

            delete this.devListening[deviceId];
        }
    }

    public ListenForDevice(id: string): Observable<BrokerDevice> {
        const dev = this.GetDeviceFor(id);
        if (dev != null) {
            // Already exists, so just return it.
            return new BehaviorSubject(dev);
        } else if (this.devListening[id] == null) {
            this.devListening[id] = new Subject<BrokerDevice>();
        }

        const res = this.devListening[id];

        return res.pipe(
            delay(1)
        );
    }

    public GetDeviceFor(id: string): BrokerDevice | null {
        for (const dev of this.devices) {
            if (id === dev.id) {
                return dev;
            } else if (id.startsWith(dev.id)) {
                // Although we have a match, make sure that the match ends at a id part boundary.
                // ie the next char is a '.'
                if (id[dev.id.length] === '.') {
                    return dev;
                }
            }
        }

        return null;
    }

    public GetChannelFor(id: string): BrokerChannel | null {
        const dev = this.GetDeviceFor(id);
        if (dev == null) {
            return null;
        }

        return dev.GetChannelFor(id);
    }

    public GetState(stateId: string): BrokerState | null {
        const channel = this.GetChannelFor(stateId);
        if (channel == null) {
            return null;
        }

        return channel.GetState(stateId);
    }

    public UpdateState(stateId: string, stateVal: ioBroker.State) {
        const stateObj = this.GetState(stateId);
        if (stateObj != null) {
            stateObj.Update(stateVal);
        }
    }
}
