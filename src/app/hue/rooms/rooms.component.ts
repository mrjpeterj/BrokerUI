import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { IobrokerService } from '../../iobroker.service';
import { RoomState } from '../roomstate';
import { RoomComponent } from '../room/room.component';

@Component({
    selector: 'app-hue-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.scss'],
    providers: [IobrokerService],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule
    ]
})
export class RoomsComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialog;

    public rooms: RoomState[];

    constructor() {
        const broker = inject(IobrokerService);
        const dialog = inject(MatDialog);

        this.broker = broker;
        this.dialog = dialog;

        this.rooms = [];
    }

    ngOnInit(): void {
        this.broker.GetDeviceFor('hue.0').subscribe({
            next: (device) => {
                const roomRole = device.GetRole('Room');
                roomRole.items.forEach((channel) => {
                    const room = new RoomState(channel);

                    this.rooms.push(room);
                });
            }
        });
    }

    public OnRoomClicked(room: RoomState) {
        this.dialog.open<RoomComponent, RoomState>(RoomComponent, {
            data: room,
            maxHeight: '90%'
        });
    }
}
