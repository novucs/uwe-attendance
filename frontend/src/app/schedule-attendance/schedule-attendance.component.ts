import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-attendance',
  templateUrl: './schedule-attendance.component.html',
  styleUrls: ['./schedule-attendance.component.css']
})
export class ScheduleAttendanceComponent implements OnInit {
  scheduleId: string;

  constructor(route: ActivatedRoute) {
    this.scheduleId = route.snapshot.params['scheduleId'];
  }

  ngOnInit() {
  }
}
