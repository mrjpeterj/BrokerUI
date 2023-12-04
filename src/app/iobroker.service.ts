import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
    BrokerDevice,
    BrokerService,
    BrokerState
} from '@mrjpeterj/broker-lib';


@Injectable({
    providedIn: 'root'
})
export class IobrokerService {

    private services: BrokerService;

    constructor() {
        this.services = new BrokerService({
                name: 'ang.0',
                connLink: 'http://router:8084/'
        });
    }

    public GetDeviceFor(id: string): Observable<BrokerDevice> {
        return this.services.GetDeviceFor(id);
    }

    public GetDevicesMatching(id: RegExp | string) : Observable<BrokerDevice[]> {
        return this.services.GetDevicesMatching(id);
    }

    public GetState(stateId: string): BrokerState | null {
        return this.services.GetState(stateId);
    }

    public SetState(state: BrokerState, value: unknown) {
        this.services.SetState(state, value);
    }
}
