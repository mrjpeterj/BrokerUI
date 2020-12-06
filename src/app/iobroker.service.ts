import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import * as ioBroker from 'types/iobroker';

import { ServiceConn } from '../conn';

import { BrokerServices } from './broker/services';
import { BrokerState } from './broker/state';
import { BrokerStateMaker } from './broker/statemaker';
import { BrokerDevice } from './broker/device';
import { BrokerHelpers } from './broker/helpers';

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
            connLink: 'http://pi1:8084/',
            socketSession: ''
        }, this);
    }

    onConnChange(isConnected: boolean) {
        if (isConnected) {
            console.log('connected');

            this.servConn.getObjects(false, (err: any, data: any) => {
                if (data != null) {
                    Object.getOwnPropertyNames(data).sort().forEach((dataKey) => {
                        const item: ioBroker.BaseObject = data[dataKey];

                        if (item.type === 'channel') {
                            const chItem = item as ioBroker.ChannelObject;
                            let role = chItem.common.role;
                            if (role == null) {
                                role = '';
                            }

                            const dev = this.services.GetDeviceFor(item._id);
                            if (dev != null) {
                                dev.GetOrCreateChannel(BrokerHelpers.GetString(chItem.common.name), item._id, role);
                            }
                        } else if (item.type === 'device') {
                            const devItem = item as ioBroker.DeviceObject;

                            this.services.CreateDevice(BrokerHelpers.GetString(devItem.common.name), item._id);
                        } else if (item.type === 'state') {
                            const channel = this.services.GetChannelFor(item._id);
                            if (channel != null) {
                                const stateItem = item as ioBroker.StateObject;

                                const state = BrokerStateMaker.Create(item._id, stateItem.common);
                                if (state != null) {
                                    channel.AddState(state);
                                }
                            }
                        } else if (item.type === 'instance') {
                            // Not interested
                        } else if (item.type === 'enum') {

                        } else {
                            console.log('unknown obj type ' + item.type);
                        }
                    });

                    // now get the values
                    this.servConn.getStates((err1: any, data1: any) => {
                        if (data1 != null) {
                            Object.getOwnPropertyNames(data1).forEach((stateId) => {
                                const dataItem = data1[stateId] as ioBroker.State;

                                if (dataItem != null) {
                                    const state = this.GetState(stateId);
                                    if (state != null) {
                                        state.Update(dataItem);
                                    }
                                }
                            });
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
    onUpdate(id: string, state: ioBroker.State) {
        setTimeout(() => {
            // console.log('NEW VALUE of ' + id + ': ' + JSON.stringify(state));

            this.services.UpdateState(id, state);
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

    public SetState(state: BrokerState, value: unknown) {
        if (state != null) {
            this.servConn.setState(state.id, { val: value });
        }
    }
}
