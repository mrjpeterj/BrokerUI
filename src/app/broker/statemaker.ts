import * as ioBroker from 'types/iobroker';

import { BrokerState } from './state';
import { BrokerBoolState } from './boolstate';
import { BrokerNumberState } from './numberstate';
import { BrokerStringState } from './stringstate';
import { BrokerHelpers } from './helpers';

export class BrokerStateMaker {

    public static Create(id: string, stateDesc: ioBroker.StateCommon): BrokerState | null {
        const name = BrokerHelpers.GetString(stateDesc.name);

        if (stateDesc.type === 'boolean' || stateDesc.role === 'button') {
            return new BrokerBoolState(name, id, stateDesc.read, stateDesc.write);
        } else if (stateDesc.type === 'number') {
            return new BrokerNumberState(name, id, stateDesc.min, stateDesc.max, stateDesc.read, stateDesc.write);
        } else if (stateDesc.type === 'string') {
            return new BrokerStringState(name, id, stateDesc.read, stateDesc.write);
        }

        return null;
    }
}
