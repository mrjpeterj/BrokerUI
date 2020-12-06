import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { BrokerState } from './state';

export class BrokerIntState extends BrokerState {

    public minVal: number | undefined;
    public maxVal: number | undefined;

    constructor(name: string, id: string, minVal: number|undefined, maxVal: number|undefined, canRead: boolean, canWrite: boolean) {
        super(name, id, canRead, canWrite);

        this.minVal = minVal;
        this.maxVal = maxVal;
    }

    public ListenForValue(): Observable<number> {

        if (this.canRead === false) {
            throw new Error('Invalid');
        }

        return this.value.pipe(
            distinctUntilChanged(),
            map((val) => {
                if (typeof (val) === 'number') {
                    return val;
                } else if (typeof (val) === 'string') {
                    return Number.parseInt(val as string, 10);
                } else {
                    return 0;
                }
            })
        );
    }
}
