import { Component, OnInit } from '@angular/core';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Observable } from 'rxjs';

import { IobrokerService } from '../iobroker.service';

import {
    BrokerChannel,
    BrokerDevice,
    BrokerBoolState,
    BrokerEnumState,
    BrokerNumberState,
    BrokerStringState
} from '@mrjpeterj/broker-lib';

class AirInfo {
    private broker: IobrokerService;

    public desc: string;
    public name: string;

    public temp: number;
    public humidity: number;

    public quality: string;

    private powerState: BrokerBoolState;
    public power: Observable<boolean>;

    constructor(device: BrokerDevice, devChannel: BrokerChannel, broker: IobrokerService) {
        this.broker = broker;

        this.name = '';
        this.temp = 0;
        this.humidity = 0;
        this.quality = '';

        const devId = device.id;
        this.desc = device.name;

        const sensors = device.GetChannelFor(devId + '.Sensor');
        if (sensors != null) {
            const temp = sensors.GetState(sensors.id + '.Temperature') as BrokerNumberState;
            temp.ListenForValue().subscribe({
                next: (val) => {
                    this.temp = val;
                }
            });

            const humidity = sensors.GetState(sensors.id + '.Humidity') as BrokerNumberState;
            humidity.ListenForValue().subscribe({
                next: (val) => {
                    this.humidity = val;
                }
            });
        }

        this.powerState = devChannel.GetState(devId + '.MainPower') as BrokerBoolState;
        this.power = this.powerState.ListenForValue();

        const name = devChannel.GetState(devId + '.Name') as BrokerStringState;
        name.ListenForValue().subscribe({
            next: (val) => {
                this.name = val;
            }
        });

        const quality = devChannel.GetState(devId + '.AirQuality') as BrokerEnumState;
        quality.ListenForStringValue().subscribe({
            next: (val) => {
                this.quality = val;
            }
        })
    }

    public OnChanged(state: MatSlideToggleChange) {
        this.broker.SetState(this.powerState, state.checked);
    }
}

@Component({
    selector: 'app-air',
    templateUrl: './air.component.html',
    styleUrls: ['./air.component.scss']
})
export class AirComponent implements OnInit {

    private broker: IobrokerService;

    public airUnits: AirInfo[];

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.airUnits = [];
    }

    ngOnInit(): void {
        this.broker.GetDevicesMatching("^dysonairpurifier").subscribe({
            next: (devices) => {
                this.BuildDeviceList(devices);
            }
        });
    }

    private BuildDeviceList(devices: BrokerDevice[]): void {

        this.airUnits.splice(0, this.airUnits.length);

        for (const device of devices) {
            const devChannel = device.GetChannelFor(device.id);

            if (devChannel != null) {
                this.airUnits.push(new AirInfo(device, devChannel, this.broker));
            }
        }
    }
}
