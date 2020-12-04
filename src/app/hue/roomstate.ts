import { BrokerChannel } from '../broker/channel';
import { BrokerState } from '../broker/state';

export class RoomState {

    private channel: BrokerChannel;

    public scenes: BrokerState[];

    constructor(roomChannel: BrokerChannel) {
        this.channel = roomChannel;

        this.scenes = this.channel.GetStates().filter((state) => {
            return state.name.startsWith('Scene');
        });
    }

    public get Name(): string {
        if (this.channel.name.endsWith('Room')) {
            // Hack - rooms that have been called the same as a light have ' Room'
            // appended to them.
            return this.channel.name.substring(0, this.channel.name.length - 5);
        } else {
            return this.channel.name;
        }
    }

    public GetSceneName(scene: BrokerState): string {
        return scene.name.substring(6);
    }
}
