import { BehaviorSubject } from 'rxjs';

import * as ioBroker from 'types/iobroker';

export class BrokerState {
    public name: string;
    public id: string;

    protected canRead: boolean;
    protected canWrite: boolean;

    protected value: BehaviorSubject<unknown>;

    protected constructor(name: string, id: string, canRead: boolean, canWrite: boolean) {
        this.name = name;
        this.id = id;
        this.canRead = canRead;
        this.canWrite = canWrite;

        const initVal: unknown = null;

        this.value = new BehaviorSubject(initVal);
    }

    public Update(state: ioBroker.State) {
        this.value.next(state.val);
    }
}
