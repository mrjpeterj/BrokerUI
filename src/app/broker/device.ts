import { BrokerChannelList, BrokerChannel } from './channel';

export class BrokerDevice {
    public name: string;
    public id: string;
    private native: any;

    private states: BrokerChannel;

    private roles: {
        [key: string]: BrokerChannelList;
    };

    constructor(name: string, id: string, native: any) {
        this.name = name;
        this.id = id;
        this.native = native;

        this.states = new BrokerChannel(name, id);
        this.roles = {};
    }

    public GetOrCreateChannel(name: string, id: string, role: string): BrokerChannel {
        let list = this.roles[role];
        if (list == null) {
            list = new BrokerChannelList(role);
            this.roles[role] = list;
        }

        let item = list.GetChannelFor(id);
        if (item == null) {
            item = new BrokerChannel(name, id);
            list.items.push(item);
        }

        return item;
    }

    public GetChannelFor(id: string): BrokerChannel | null {
        for (const roleKey in this.roles) {
            if (this.roles.hasOwnProperty(roleKey)) {
                const channelList = this.roles[roleKey];

                const channel = channelList.GetChannelFor(id);
                if (channel != null) {
                    return channel;
                }
            }
        }

        // Have a better sanity check that this is the correct thing to do
        return this.states;
    }

    public GetRoles(): string[] {
        return Object.getOwnPropertyNames(this.roles);
    }

    public GetRole(roleName: string): BrokerChannelList {
        return this.roles[roleName];
    }

    public GetDeviceProperty(propName: string): any | null {
        if (this.native) {
            const val = this.native[propName];
            if (val != null) {
                return val;
            } else {
                // make sure that we return null and never undefined.
                return null;
            }
        }

        return null;
    }
}
