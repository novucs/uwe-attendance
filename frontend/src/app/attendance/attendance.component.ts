import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  scheduleID: string;

  constructor(route: ActivatedRoute) { // 2
    this.scheduleID = route.snapshot.params['id']; // 3
  }

  ngOnInit() {
  }
}
