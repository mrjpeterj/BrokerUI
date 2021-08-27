import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { BrokerNumberState } from '../../broker/numberstate';
import { IobrokerService } from 'src/app/iobroker.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {

    @Input()
    public vertical: boolean;

    @Input()
    public disabled: boolean;

    @Input()
    public min: number;

    @Input()
    public max: number;

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

        this.vertical = false;
        this.disabled = false;
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        if (this.stateListener != null) {
            this.stateListener.unsubscribe();
        }
    }

    public OnChanged(event: MatSliderChange) {
        if (event.value != null && this.stateHolder != null) {
            this.broker.SetState(this.stateHolder, event.value);
        }
    }
}
