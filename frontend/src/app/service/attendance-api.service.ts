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

  createSchedule(schedule: Schedule) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/schedule', JSON.stringify(schedule), options)
      .subscribe(data => {
        console.log('Successfully created schedule');
      }, error => {
        console.log(error.json());
      });
  }

  getStudents() {
    return this.http.get('/api/student')
      .map(res => res.json());
  }

  createStudent(student: Student) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/student', JSON.stringify(student), options)
      .subscribe(data => {
        console.log('Successfully created student');
      }, error => {
        console.log(error.json());
      });
  }

  getAttendance() {
    return this.http.get('/api/attendance')
      .map(res => res.json());
  }

  createAttendance(attendance: Attendance) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/attendance', JSON.stringify(attendance), options)
      .subscribe(data => {
        console.log('Successfully created attendance');
      }, error => {
        console.log(error.json());
      });
  }
}

interface Schedule {
  event: string;
  onDate: Date;
}

interface Student {
  tag: string;
  name: string;
}

interface Attendance {
  tag: string;
  sessionId: string;
}
