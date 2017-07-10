import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AttendanceApiService {

    constructor(private http: Http) {
    }

    getAllAttendances() {
        return this.http.get('/api/attendance/all')
            .map(res => res.json());
    }

    getSessionAttendances(sessionId: string) {
        return this.http.get('/api/attendance/session/' + sessionId)
            .map(res => res.json());
    }

    updateAttendance(attendance: Attendance) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put('/api/attendance', JSON.stringify(attendance), options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
            });
    }

    getSchedules() {
        return this.http.get('/api/schedule/all')
            .map(res => res.json());
    }

    getScheduleToday() {
        return this.http.get('/api/schedule/today')
            .map(res => res.json());
    }

    getSchedule(id: string) {
        return this.http.get('/api/schedule/id/' + id)
            .map(res => res.json());
    }

    // updateSchedule(schedule: Schedule) {
    //     let headers = new Headers({'Content-Type': 'application/json'});
    //     let options = new RequestOptions({headers: headers});
    //     return this.http.post('/api/schedule', JSON.stringify(schedule), options)
    //         .subscribe(data => {
    //             console.log(data.json());
    //         }, error => {
    //             console.log(error);
    //         });
    // }

    getAllStudents() {
        return this.http.get("/api/student/all")
            .map(res => res.json());
    }

    getStudent(tag: string) {
        return this.http.get("/api/student/tag/" + tag)
            .map(res => res.json());
    }

    updateStudentTag(student: Student) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post('/api/student/tag', JSON.stringify(student), options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
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
    sessionId: string;
    tag: string;
}
