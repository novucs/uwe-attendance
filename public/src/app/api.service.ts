import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";
import {DatePipe} from "@angular/common";

@Injectable()
export class AttendanceApiService {

    urlBase = "http://localhost:3000";

    constructor(private http: Http) {
    }

    formatDate(date: Date) {
        const datePipe = new DatePipe("en-UK");
        return datePipe.transform(date, "dd/MM/yyyy @ HH:mm");
    }

    getAllAttendances() {
        return this.http.get(this.urlBase + "/api/attendance/all")
            .map(res => res.json());
    }

    getSessionAttendances(sessionId: string) {
        return this.http.get(this.urlBase + "/api/attendance/session/" + sessionId)
            .map(res => res.json());
    }

    getStudentAttendances(tag: string) {
        return this.http.get(this.urlBase + "/api/attendance/student/" + tag)
            .map(res => res.json());
    }

    updateAttendance(sessionId: string, studentTag: string) {
        const headers = new Headers({"Content-Type": "application/json"});
        const options = new RequestOptions({headers: headers});
        const body = JSON.stringify({
            sessionId: sessionId,
            studentTag: studentTag
        });

        return this.http.put(this.urlBase + "/api/attendance", body, options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
            });
    }

    getSessions() {
        return this.http.get(this.urlBase + "/api/schedule/all")
            .map(res => res.json());
    }

    getSessionsToday() {
        return this.http.get(this.urlBase + "/api/schedule/today")
            .map(res => res.json());
    }

    getSession(id: string) {
        return this.http.get(this.urlBase + "/api/schedule/id/" + id)
            .map(res => res.json());
    }

    getSessionsByGroups(groups: string[]) {
        return this.http.get(this.urlBase + "/api/schedule/groups/" + groups.join(','))
            .map(res => res.json());
    }

    getAllStudents() {
        return this.http.get(this.urlBase + "/api/student/all")
            .map(res => res.json());
    }

    getStudent(tag: string) {
        return this.http.get(this.urlBase + "/api/student/tag/" + tag)
            .map(res => res.json());
    }

    getStudentsByGroups(groups: string[]) {
        return this.http.get(this.urlBase + "/api/student/groups/" + groups.join(','))
            .map(res => res.json());
    }

    updateStudentTag(name: string, tag: string) {
        const headers = new Headers({"Content-Type": "application/json"});
        const options = new RequestOptions({headers: headers});
        const body = JSON.stringify({
            name: name,
            tag: tag
        });

        return this.http.post(this.urlBase + "/api/student/tag", body, options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
            });
    }
}

export const EMPTY_SESSION: Session = {_id: "_", event: "_", onDate: new Date(), groups: []};
export const EMPTY_STUDENT: Student = {_id: "_", tag: "_", name: "_", groups: []};
export const EMPTY_ATTENDANCE: Attendance = {_id: "_", sessionId: "_", studentTag: "_"};

export interface Session {
    _id: string;
    event: string;
    onDate: Date;
    groups: string[];
}

export interface Student {
    _id: string;
    tag: string;
    name: string;
    groups: string[];
}

export interface Attendance {
    _id: string;
    sessionId: string;
    studentTag: string;
}
