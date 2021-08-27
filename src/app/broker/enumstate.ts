import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import * as ioBroker from 'types/iobroker';

import { BrokerState } from './state';

export class BrokerEnumState extends BrokerState {

    private strings: Record<number, string> | null;

    constructor(name: string, id: string, canRead: boolean, canWrite: boolean) {
        super(name, id, canRead, canWrite);

        this.strings = null;
    }

    public ListenForValue(): Observable<string> {
        if (this.canRead === false) {
            throw new Error('Invalid');
        }

        return this.value.pipe(
            distinctUntilChanged(),
            map((val) => {
                if (val == null) {
                    return '';
                } else if (this.strings != null) {
                    return this.strings[val as number];
                } else {
                    return (val as Object).toString();
                }
            })
        );
    }

    public SetStateValues(strings: Record<number, string>): void {
        this.strings = strings;
    }

    public Update(state: ioBroker.State) {
        this.value.next(state.val);
    }

    public BuildValue(value: unknown) {
        return { val: value };
    }
}
