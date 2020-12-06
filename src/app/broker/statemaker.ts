import * as ioBroker from 'types/iobroker';

import { BrokerState } from './state';
import { BrokerBoolState } from './boolstate';
import { BrokerIntState } from './numberstate';
import { BrokerHelpers } from './helpers';

export class BrokerStateMaker {

    public static Create(id: string, stateDesc: ioBroker.StateCommon): BrokerState | null {
        const name = BrokerHelpers.GetString(stateDesc.name);

        switch (stateDesc.type) {
            case 'boolean':
                return new BrokerBoolState(name, id, stateDesc.read, stateDesc.write);
            case 'number':
                return new BrokerIntState(name, id, stateDesc.min, stateDesc.max, stateDesc.read, stateDesc.write);
            case 'string':
                return null;
            default:
                return null;
        }
    }
}
