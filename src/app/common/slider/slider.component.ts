import { Component, OnInit, Input, OnDestroy } from '@angular/core';

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

    @Input()
    public disabled: boolean;

    @Input()
    public min: number;

    @Input()
    public max: number;

    @Input()
    public maxJump: number;

    public get state(): BrokerNumberState | null {
        return this.stateHolder;
    }

    @Input()
    public set state(val: BrokerNumberState | null) {
        this.stateHolder = val;

        if (val != null) {
            this.stateListener = val.ListenForValue().subscribe({
                next: (v) => {
                    this.value = v;
                }
            });
        }
    }

    public value: number;

    private broker: IobrokerService;

    private stateHolder: BrokerNumberState | null;
    private stateListener: Subscription | null;

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.stateHolder = null;
        this.stateListener = null;

        this.min = 0;
        this.max = 100;
        this.value = 0;

        this.maxJump = 0;

        this.disabled = false;
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        if (this.stateListener != null) {
            this.stateListener.unsubscribe();
        }
    }

    public OnChanged() {
        if (this.stateHolder != null) {
            if (this.maxJump) {
                const current = this.stateHolder.Value();
                if (Math.abs(current - this.value) > this.maxJump) {
                    // clamp value down
                    if (current < this.value) {
                        // jump up was too high
                        this.value = current + this.maxJump;
                    } else {
                        // jump up was too low
                        this.value = current - this.maxJump;
                    }
                }
            }

            this.broker.SetState(this.stateHolder, this.value);
        }
    }
}
