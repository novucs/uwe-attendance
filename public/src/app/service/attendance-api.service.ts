import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AttendanceApiService {

    constructor(private http: Http) {
    }

    getAllAttendances() {
        return this.http.get("/api/attendance/all")
            .map(res => res.json());
    }

    getSessionAttendances(sessionId: string) {
        return this.http.get("/api/attendance/session/" + sessionId)
            .map(res => res.json());
    }

    updateAttendance(sessionId: string, studentTag: string) {
        const headers = new Headers({"Content-Type": "application/json"});
        const options = new RequestOptions({headers: headers});
        const body = JSON.stringify({
            sessionId: sessionId,
            studentTag: studentTag
        });

        return this.http.put("/api/attendance", body, options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
            });
    }

    getSessions() {
        return this.http.get("/api/schedule/all")
            .map(res => res.json());
    }

    getSessionsToday() {
        return this.http.get("/api/schedule/today")
            .map(res => res.json());
    }

    getSession(id: string) {
        return this.http.get("/api/schedule/id/" + id)
            .map(res => res.json());
    }

    getAllStudents() {
        return this.http.get("/api/student/all")
            .map(res => res.json());
    }

    getStudent(tag: string) {
        return this.http.get("/api/student/tag/" + tag)
            .map(res => res.json());
    }

    updateStudentTag(name: string, tag: string) {
        const headers = new Headers({"Content-Type": "application/json"});
        const options = new RequestOptions({headers: headers});
        const body = JSON.stringify({
            name: name,
            tag: tag
        });

        return this.http.post("/api/student/tag", body, options)
            .subscribe(data => {
                console.log(data.json());
            }, error => {
                console.log(error);
            });
    }
}

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
