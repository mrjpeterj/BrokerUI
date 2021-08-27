import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';

import { BrokerDevice } from '../broker/device';
import { BrokerNumberState } from '../broker/numberstate';
import { BrokerStringState } from '../broker/stringstate';

import { IobrokerService } from '../iobroker.service';

class AirInfo {
    public name: string;

    public temp: number;
    public humidity: number;

    constructor(device: BrokerDevice) {
        this.name = '';
        this.temp = 0;
        this.humidity = 0;

        const devId = device.id;
        const title = device.name;

        const devChannel = device.GetChannelFor(devId);
        if (devChannel == null) {
            return;
        }

        const sensors = device.GetChannelFor(devId + '.Sensor');
        if (sensors != null) {
            const temp = sensors.GetState(sensors.id + '.Temperature') as (BrokerNumberState | null);
            if (temp != null) {
                temp.ListenForValue().subscribe({
                    next: (val) => {
                        this.temp = val;
                    }
                });
            }

            const humidity = sensors.GetState(sensors.id + '.Humidity') as (BrokerNumberState | null);
            if (humidity != null) {
                humidity.ListenForValue().subscribe({
                    next: (val) => {
                        this.humidity = val;
                    }
                })
            }
        }


        const name = devChannel.GetState(devId + '.Name') as (BrokerStringState | null);
        name?.ListenForValue().subscribe({
            next: (val) => {
                this.name = title + ' - ' + val;
            }
        });
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
           this.airUnits.push(new AirInfo(device));
        }
    }
}
