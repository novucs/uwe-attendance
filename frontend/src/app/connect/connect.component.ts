import { Component, OnInit } from '@angular/core';

import { AttendanceApiService } from '../service/attendance-api.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  schedules: any = [];

  constructor(private attendanceApiService: AttendanceApiService) {
  }

  ngOnInit() {
    // Retrieve posts from the API
    this.attendanceApiService.getCurrentSchedules().subscribe(s => {
      this.schedules = s.data;
    });
  }
}
