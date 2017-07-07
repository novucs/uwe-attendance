import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AttendanceApiService, Schedule, Attendance, Student } from '../service/attendance-api.service';

@Component({
  selector: 'app-schedule-attendance',
  templateUrl: './schedule-attendance.component.html',
  styleUrls: ['./schedule-attendance.component.css']
})
export class ScheduleAttendanceComponent implements OnInit {
  scheduleId: string;
  schedule: Schedule = {event: "", onDate: new Date()};
  attended: string[];
  date: string = "";

  constructor(private route: ActivatedRoute,
              private api: AttendanceApiService) {
    this.scheduleId = route.snapshot.params['scheduleId'];
  }

  ngOnInit() {
    this.api.getSchedule(this.scheduleId).subscribe(schedule => {
      this.schedule.event = schedule.data.event;
      this.schedule.onDate = schedule.data.onDate;

      var datePipe = new DatePipe('en-UK');
      this.date = datePipe.transform(this.schedule.onDate, 'dd/MM/yyyy @ HH:mm:ss');
    });

    this.api.getScheduleAttendance(this.scheduleId).subscribe(a => {
      for (var i in a.data) {
        var attendance = a.data[i];
        this.api.getStudent(attendance.tag).subscribe(s => {
          this.attended.push(s.data.name);
        });
      }
    });
  }
}
