import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { IobrokerService } from '../../iobroker.service';

import { BrokerState } from '@mrjpeterj/broker-lib';

import { RoomState } from '../roomstate';

@Component({
    selector: 'app-hue-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    providers: [IobrokerService],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule
    ]
})
export class RoomComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialogRef<RoomComponent>;
    public room: RoomState;

    constructor() {
        const broker = inject(IobrokerService);
        const dialogRef = inject<MatDialogRef<RoomComponent>>(MatDialogRef);
        const data = inject<RoomState>(MAT_DIALOG_DATA);


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
