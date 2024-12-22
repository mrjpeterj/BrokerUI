import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IobrokerService } from '../../iobroker.service';

import { BrokerState } from '@mrjpeterj/broker-lib';

import { RoomState } from '../roomstate';

@Component({
    selector: 'app-hue-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    providers: [IobrokerService],
    standalone: false
})
export class RoomComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialogRef<RoomComponent>;
    public room: RoomState;

    constructor(broker: IobrokerService, dialogRef: MatDialogRef<RoomComponent>, @Inject(MAT_DIALOG_DATA) data: RoomState) {

        this.broker = broker;

        this.dialog = dialogRef;
        this.room = data;
    }

    ngOnInit(): void {
    }

    public SelectScene(scene: BrokerState) {
        this.broker.SetState(scene, true);

        this.dialog.close();
    }
}
