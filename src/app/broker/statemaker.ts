import * as ioBroker from 'types/iobroker';

import { BrokerState } from './state';
import { BrokerBoolState } from './boolstate';
import { BrokerNumberState } from './numberstate';
import { BrokerStringState } from './stringstate';
import { BrokerHelpers } from './helpers';
import { BrokerEnumState } from './enumstate';

export class BrokerStateMaker {

    public static Create(id: string, stateDesc: ioBroker.StateCommon): BrokerState | null {
        const name = BrokerHelpers.GetString(stateDesc.name);

        if (stateDesc.type === 'boolean' || stateDesc.role === 'button') {
            return new BrokerBoolState(name, id, stateDesc.read, stateDesc.write);
        } else if (stateDesc.type === 'number') {
            if (stateDesc.states != null) {
                const state = new BrokerEnumState(name, id, stateDesc.read, stateDesc.write);
                state.SetStateValues(stateDesc.states);

                return state;
            } else {
                return new BrokerNumberState(name, id, stateDesc.min, stateDesc.max, stateDesc.read, stateDesc.write);
            }
        } else if (stateDesc.type === 'string') {
            if (stateDesc.states != null) {
                const states = Object.values(stateDesc.states);
                if (states.length == 2 && BrokerStateMaker.IsOnOrOff(states[0]) && BrokerStateMaker.IsOnOrOff(states[1])) {
                    const state = new BrokerBoolState(name, id, stateDesc.read, stateDesc.write);

                    if (BrokerStateMaker.IsOn(states[0])) {
                        state.SetStateValues(states[0], states[1]);
                    } else {
                        state.SetStateValues(states[1], states[0]);
                    }


                    return state;
                }
            }

            return new BrokerStringState(name, id, stateDesc.read, stateDesc.write);
        }

        return null;
    }

    private static IsOnOrOff(name: string): boolean {
        const nameLower = name.toLocaleLowerCase();
        return nameLower.localeCompare('on') == 0 || nameLower.localeCompare('off') == 0;
    }

    private static IsOn(name: string): boolean {
        const nameLower = name.toLocaleLowerCase();
        return nameLower.localeCompare('on') == 0;
    }
}
