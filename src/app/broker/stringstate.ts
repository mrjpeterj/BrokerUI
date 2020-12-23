import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { BrokerState } from './state';

export class BrokerStringState extends BrokerState {

    constructor(name: string, id: string, canRead: boolean, canWrite: boolean) {
        super(name, id, canRead, canWrite);
    }

    public ListenForValue(): Observable<string> {
        if (this.canRead === false) {
            throw new Error('Invalid');
        }

        return this.value.pipe(
            distinctUntilChanged(),
            map((val) => {
                return (val as object).toString();
            })
        );
    }
}
