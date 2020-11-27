import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ServiceConn } from '../conn';

import { BrokerServices } from './broker/services';
import { BrokerState } from './broker/state';
import { BrokerDevice } from './broker/device';

@Injectable({
    providedIn: 'root'
})
export class IobrokerService {

    private servConn: ServiceConn;

    private services: BrokerServices;

    constructor() {

        this.services = new BrokerServices();

        this.servConn = new ServiceConn();

        this.servConn.init({
            name: 'ang.0',
            connLink: 'https://pi1:8084/',
            socketSession: ''
        }, this);
    }

    onConnChange(isConnected: boolean) {
        if (isConnected) {
            console.log('connected');

            this.servConn.getObjects(false, (err: any, data: any) => {
                if (data != null) {
                    Object.getOwnPropertyNames(data).sort().forEach((dataKey) => {
                        const item = data[dataKey];

                        if (item.type === 'channel') {
                            let role = item.common.role;
                            if (role == null) {
                                role = '';
                            }

                            const dev = this.services.GetDeviceFor(item._id);
                            if (dev != null) {
                                dev.GetOrCreateChannel(item.common.name, item._id, role);
                            } else {
                                const a = 0;
                            }
                        } else if (item.type === 'device') {
                            this.services.CreateDevice(item.common.name, item._id);
                        } else if (item.type === 'state') {
                            const channel = this.services.GetChannelFor(item._id);
                            if (channel != null) {
                                const canRead = item.common.read;
                                const canWrite = item.common.write;

                                channel.AddState(new BrokerState(item.common.name, item._id, item.common.type, canRead, canWrite));
                            }
                        } else if (item.type === 'instance') {
                            // Not interested
                        } else if (item.type === 'enum') {

                        } else {
                            console.log('unknown obj type ' + item.type);
                        }
                    });
                }
            });
        } else {
            console.log('disconnected');
        }
    }

    onRefresh() {
        window.location.reload();
    }
    onUpdate(id: string, state: any) {
        setTimeout(() => {
            // console.log('NEW VALUE of ' + id + ': ' + JSON.stringify(state));

            this.services.UpdateState(id, state.val);
        }, 0);
    }

    onError(err: any) {
        const msg = 'Cannot execute ' + err.command + ' for ' + err.arg + ', because of insufficient permissions';
        window.alert(msg);
    }

    public GetDeviceFor(id: string): Observable<BrokerDevice> {
        return this.services.ListenForDevice(id);
    }

    public GetState(stateId: string): BrokerState | null {
        return this.services.GetState(stateId);
    }

    public SetState(stateId: string, value: unknown) {
        const state = this.GetState(stateId);
        if (state != null) {
            this.servConn.setState(stateId, value);
        }
    }
}
