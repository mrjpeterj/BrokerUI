import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class BrokerState {
    public name: string;
    public id: string;
    public type: string;

    private canRead: boolean;
    private canWrite: boolean;

    private value: BehaviorSubject<unknown>;

    constructor(name: string, id: string, type: string, canRead: boolean, canWrite: boolean) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.canRead = canRead;
        this.canWrite = canWrite;

        const initVal: unknown = null;

        this.value = new BehaviorSubject(initVal);
    }

    public Update(val: unknown) {
        this.value.next(val);
    }

    public ListenForBool(): Observable<boolean> {
        return this.value.pipe(
            distinctUntilChanged(),
            map((val) => {
                return val == true;
            })
        );
    }
}
