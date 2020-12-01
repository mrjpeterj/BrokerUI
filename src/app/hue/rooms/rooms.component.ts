import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IobrokerService } from '../../iobroker.service';
import { RoomState } from '../roomstate';
import { RoomComponent } from '../room/room.component';

@Component({
    selector: 'app-hue-rooms',
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.scss'],
    providers: [IobrokerService]
})
export class RoomsComponent implements OnInit {

    private broker: IobrokerService;
    private dialog: MatDialog;

    public rooms: RoomState[];

    constructor(broker: IobrokerService, dialog: MatDialog) {
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
        this.dialog.open(RoomComponent, {
            data: room,
            maxHeight: '90%'
        });
    }
}
