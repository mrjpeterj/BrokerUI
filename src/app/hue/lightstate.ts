import { Observable } from "rxjs";
import { IobrokerService } from '../iobroker.service';

export class LightState {
    public name: string;
    private id: string;
    public value: Observable<boolean>;

    private broker: IobrokerService;

    constructor(name: string, id: string, state: Observable<boolean>, broker: IobrokerService) {
        this.name = name;
        this.id = id;
        this.value = state;
        this.broker = broker;
    }

    public UpdateState(value: boolean) {
        this.broker.SetState(this.id, value);
    }
}
