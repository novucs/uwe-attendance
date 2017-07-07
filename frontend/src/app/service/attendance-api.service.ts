import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AttendanceApiService {

  constructor(private http: Http) {
  }

  getSchedules() {
    return this.http.get('/api/schedule')
      .map(res => res.json());
  }

  updateSchedule(schedule: Schedule) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/schedule', JSON.stringify(schedule), options)
      .subscribe(data => {
        console.log('Successfully updated schedule');
      }, error => {
        console.log(error.json());
      });
  }

  getStudents() {
    return this.http.get('/api/student')
      .map(res => res.json());
  }

  updateStudent(student: Student) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/student', JSON.stringify(student), options)
      .subscribe(data => {
        console.log('Successfully updated student');
      }, error => {
        console.log(error.json());
      });
  }

  getAttendance() {
    return this.http.get('/api/attendance')
      .map(res => res.json());
  }

  updateAttendance(attendance: Attendance) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/attendance', JSON.stringify(attendance), options)
      .subscribe(data => {
        console.log('Successfully updated attendance');
      }, error => {
        console.log(error.json());
      });
  }
}

export interface Schedule {
  event: string;
  onDate: Date;
}

export interface Student {
  tag: string;
  name: string;
}

export interface Attendance {
  tag: string;
  sessionId: string;
}
