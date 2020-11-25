import { Component, OnInit } from '@angular/core';
import { IobrokerService } from '../iobroker.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
                    const listener = this.broker.ListenOn(element);
                    if (listener != null) {
                        const stateHolder = new MachineState(element.substr(11), listener.pipe(
                            map((val) => {
                                return val == true;
                            })
                        ));

                        this.listeners.push(stateHolder);
                    }
                });
            }
        });
    }

}
