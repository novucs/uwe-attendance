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
    return this.http.post('/api/student', JSON.stringify(schedule), options)
      .subscribe(data => {
        console.log("Successfully created schedule");
      }, error => {
        console.log(error);
      });
  }
}

interface Schedule {
  event: string;
  onDate: Date;
}
