import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrokerStringState } from '@mrjpeterj/broker-lib';

import { IobrokerService } from '../../iobroker.service';

@Component({
    selector: 'app-amp-extra-info',
    templateUrl: './extra-info.component.html',
    styleUrls: ['./extra-info.component.scss'],
    imports: [ CommonModule]
})
export class ExtraInfoComponent implements OnInit {

    private broker: IobrokerService;

    public inputName: Observable<string> | null;
    public surroundName: Observable<string> | null;

    public extraLines: Observable<string>[];

    constructor(broker: IobrokerService) {
        this.broker = broker;

        this.inputName = null;
        this.surroundName = null;
        this.extraLines = [];
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('denon.0').subscribe({
            next: (device) => {
                const zoneChannel = device.GetChannelFor(device.id + '.zoneMain');
                const settingsChannel = device.GetChannelFor(device.id + '.settings');

                if (settingsChannel) {
                    const surroundState = settingsChannel.GetState(settingsChannel.id + '.surroundMode') as BrokerStringState;
                    if (surroundState) {
                        this.surroundName = surroundState.ListenForValue();
                    }
                }

                const inputState = zoneChannel?.GetState(zoneChannel.id + '.selectInput') as BrokerStringState;

                if (inputState == null) {
                    return;
                }

                this.inputName = inputState.ListenForValue();

                const displayChannel = device.GetChannelFor(device.id + '.display');

                if (displayChannel) {
                    const displayStates = displayChannel.GetStates();

                    for (const state of displayStates.sort((a, b) => a.id.localeCompare(b.id))) {
                        if (state.id.indexOf('displayContent') >= 0) {
                            const dispState = state as BrokerStringState;

                            const convertedText = combineLatest(this.inputName, dispState.ListenForValue()).pipe(
                                map((vals) => {
                                    const inputName = vals[0];
                                    const displayText = vals[1].trim();
                                    const displayItem = dispState.id.substr(dispState.id.length - 1);

                                    return this.HandleText(inputName, displayItem, displayText);
                                })
                            );

                            this.extraLines.push(convertedText);
                        }
                    }
                }
            }
        });
    }

    private HandleText(inputName: string, displayItem: string, displayText: string): string {
        if (inputName === 'SERVER') {
            if (displayItem === '0') {
                return displayText.replace(' mServer', '');
            } else if (displayItem === '3') {
                return '';
            } else if (displayItem === '5') {
                const space = displayText.indexOf(' ');
                return displayText.substring(0, space);
            } else if (displayItem === '8') {
                return '';
            } else {
                return displayText;
            }
        } else {
            return '';
        }
    }
}
