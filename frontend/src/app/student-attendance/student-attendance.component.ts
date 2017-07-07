import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit {
  studentId: string;

  constructor(route: ActivatedRoute) {
    this.studentId = route.snapshot.params['studentId'];
  }

  ngOnInit() {
  }
}