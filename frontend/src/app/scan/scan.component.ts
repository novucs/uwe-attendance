import { Component, OnInit } from '@angular/core';
import { AttendanceApiService } from '../service/attendance-api.service';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  constructor(private api: AttendanceApiService) {
  }

  ngOnInit() {
    var ws = new $WebSocket("ws://127.0.0.1:3001");

    ws.onMessage(
        (msg: MessageEvent)=> {
            console.log("onMessage ", msg.data);
        },
        {autoApply: false}
    );
  }
}
