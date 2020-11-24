import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import servConn from  '../conn.js';


@Injectable({
  providedIn: 'root'
})
export class IobrokerService {
    private states: { [key: string]: BehaviorSubject<string> };

    constructor() {

        this.states = {};

        servConn.namespace   = 'ang.0';
        servConn._useStorage = false;

        servConn.init({
            name: 'ang.0',
            connLink: 'http://pi1:8084/',
            socketSession: ''
        }, this);
    }

    onConnChange(isConnected) {
        if (isConnected) {
            console.log('connected');
            servConn.getStates((err, states) => {
                let count = 0;
                for (var id in states) {
                    count++;
                }
                console.log('Received ' + count + ' states.');
                states = states;
            });
        } else {
            console.log('disconnected');
        }
    }

    onRefresh() {
        window.location.reload();
    }
    onUpdate(id, state) {
        setTimeout(() => {
            // console.log('NEW VALUE of ' + id + ': ' + JSON.stringify(state));

            if (this.states[id] == null) {
                this.states[id] = new BehaviorSubject(state.val);
            } else {
                this.states[id].next(state.val);
            }
        }, 0);
    }

    onError(err) {
        const msg = 'Cannot execute ' + err.command + ' for ' + err.arg + ', because of insufficient permissions';
        window.alert(msg);
    }
}
