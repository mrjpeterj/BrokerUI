import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import * as ioBroker from 'types/iobroker';

import { BrokerState } from './state';

export class BrokerBoolState extends BrokerState {

    private trueState: string | null;
    private falseState: string | null;

    constructor(name: string, id: string, canRead: boolean, canWrite: boolean) {
        super(name, id, canRead, canWrite);

        this.trueState = null;
        this.falseState = null;
    }

    public ListenForValue(): Observable<boolean> {

        if (this.canRead === false) {
            throw new Error('Invalid');
        }

        return this.value.pipe(
            distinctUntilChanged(),
            map((val) => {
                return val == true;
            })
        );
    }

    // Bool states that are really strings need to specify
    // the strings to use for setting the value for true and false
    public SetStateValues(trueState: string, falseState: string) {
        this.trueState = trueState;
        this.falseState = falseState;
    }

    public Update(state: ioBroker.State) {
        if (this.trueState != null && state.val === this.trueState) {
            this.value.next(true);
        }
        else if (this.falseState != null && state.val === this.falseState) {
            this.value.next(false);
        }
        else {
            this.value.next(state.val);
        }
    }

    public BuildValue(value: unknown) {
        if (value === true && this.trueState != null) {
            return { val: this.trueState };
        }

        if (value == false && this.falseState != null) {
            return { val: this.falseState };
        }

        return { val: value };
    }
}
