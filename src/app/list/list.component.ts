import { Component, OnInit } from '@angular/core';
import { IobrokerService } from '../iobroker.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.sass'],
    providers: [IobrokerService]
})
export class ListComponent implements OnInit {

    constructor(broker: IobrokerService) {

    }

    ngOnInit() {
    }

}
