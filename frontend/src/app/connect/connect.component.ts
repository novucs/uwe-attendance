import { Component, OnInit } from '@angular/core';

import { AttendanceApiService } from '../attendance-api.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  schedules: any = [];
  msg : string = "none";


  constructor(private attendanceApiService: AttendanceApiService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.attendanceApiService.getSchedules().subscribe(s => {
      this.schedules = s.data;
    });
  }

}
