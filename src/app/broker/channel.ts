import { BrokerState } from './state';

export class BrokerChannel {
    public name: string;
    public id: string;

    private states: BrokerState[];

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;

        this.states = [];
    }

    public GetStates(): BrokerState[] {
        return this.states;
    }

    public GetState(id: string): BrokerState | null {
        for (const state of this.states) {
            if (state.id === id) {
                return state;
            }
        }

        return null;
    }

    public AddState(state: BrokerState) {
        this.states.push(state);
    }
}

export class BrokerChannelList {
    public role: string;

    public items: BrokerChannel[];

    constructor(role: string) {
        this.role = role;
        this.items = [];
    }

    public GetChannelFor(id: string): BrokerChannel | null {
        for (const item of this.items) {
            if (id === item.id) {
                return item;
            } else if (id.startsWith(item.id)) {
                // Although we have a match, make sure that the match ends at a id part boundary.
                // ie the next char is a '.'
                if (id[item.id.length] === '.') {
                    return item;
                }
            }
        }

        return null;
    }
}
