import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AttendanceApiService {

  constructor(private http: Http) {
  }

  getSchedules() {
    return this.http.get('/api/schedule')
      .map(res => res.json());
  }
}
