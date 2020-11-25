import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import servConn from '../conn';

@Injectable({
  providedIn: 'root'
})
export class IobrokerService {
    private states: { [key: string]: null | BehaviorSubject<unknown> };

    public Services: BehaviorSubject<string[]>;

    constructor() {

        this.states = {};
        this.Services = new BehaviorSubject(['']);

        servConn.init({
            name: 'ang.0',
            connLink: 'https://pi1:8084/',
            socketSession: ''
        }, this);
    }

    onConnChange(isConnected: boolean) {
        if (isConnected) {
            console.log('connected');
            servConn.getStates((err: any, states: any) => {
                Object.keys(states).forEach((id) => {
                    if (states[id] != null) {
                        this.states[id] = new BehaviorSubject(states[id].val);
                    }
                });

                this.Services.next(Object.getOwnPropertyNames(this.states));
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

            const stateSub = this.states[id];

            if (stateSub == null) {
                this.states[id] = new BehaviorSubject(state.val);

                this.Services.next(Object.getOwnPropertyNames(this.states));
            } else {
                stateSub.next(state.val);
            }
        }, 0);
    }

    onError(err: any) {
        const msg = 'Cannot execute ' + err.command + ' for ' + err.arg + ', because of insufficient permissions';
        window.alert(msg);
    }

    ListenOn(service: string): null | Observable<unknown> {
        const srv = this.states[service];

        if (srv != null) {
            return srv.pipe(
                distinctUntilChanged()
            );
        } else {
            return null;
        }
    }
}
