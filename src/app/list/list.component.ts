import { Component, OnInit } from '@angular/core';
import { IobrokerService } from '../iobroker.service';
import { Observable } from 'rxjs';

class MachineState {
    public name: string;
    public state: Observable<boolean>;

    constructor(name: string, state: Observable<boolean>) {
        this.name = name;
        this.state = state;
    }
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.sass'],
    providers: [IobrokerService]
})
export class ListComponent implements OnInit {

    private broker: IobrokerService;

    public listeners: MachineState[];

    constructor(broker: IobrokerService) {
        this.broker = broker;
        this.listeners = [];
    }

    ngOnInit() {
        this.broker.Services.subscribe({
            next: (srvs) => {
                this.listeners.splice(0, this.listeners.length);

                const pingSrvs = srvs.filter((val, idx, list) => {
                    return val.startsWith('ping.0.pi1');
                });

                pingSrvs.forEach(element => {
                    const listener = this.broker.ListenForBool(element);
                    const stateHolder = new MachineState(element.substr(11), listener);

                    this.listeners.push(stateHolder);
                });
            }
        });
    }

}
