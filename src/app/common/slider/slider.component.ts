import { Component, OnInit, OnDestroy, input } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';

import { Subscription } from 'rxjs';

import { BrokerNumberState } from '@mrjpeterj/broker-lib';
import { IobrokerService } from '../../iobroker.service';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    imports: [MatSliderModule]
})
export class SliderComponent implements OnInit, OnDestroy {

    public disabled = input<boolean>(false);
    public min = input<number>(0);
    public max = input<number>(100);
    public maxJump = input<number>(0);

    public state = input.required<BrokerNumberState, BrokerNumberState>({transform: this.UpdateState.bind(this)});

    public value: number;

    private broker: IobrokerService;

    private stateListener: Subscription | null;

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.stateListener = null;

        this.value = 0;
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        if (this.stateListener != null) {
            this.stateListener.unsubscribe();
        }
    }


    UpdateState(val : BrokerNumberState): BrokerNumberState {

        if (val != null) {
            this.stateListener = val.ListenForValue().subscribe({
                next: (v) => {
                    this.value = v;
                }
            });
        }

        return val;
    }

    public OnChanged() {
        var theState = this.state();

        if (theState != null) {
            if (this.maxJump() > 0) {
                const current = theState.Value();
                if (Math.abs(current - this.value) > this.maxJump()) {
                    // clamp value down
                    if (current < this.value) {
                        // jump up was too high
                        this.value = current + this.maxJump();
                    } else {
                        // jump up was too low
                        this.value = current - this.maxJump();
                    }
                }
            }

            this.broker.SetState(theState, this.value);
        }
    }
}
