import {Component, OnInit} from "@angular/core";
import {AttendanceApiService, Session, Student} from "../service/attendance-api.service";

@Component({
    selector: "app-connect",
    templateUrl: "./connect.component.html"
})
export class ConnectComponent implements OnInit {

    sessionsToday: Session[] = [];
    sessions: Session[] = [];
    students: Student[] = [];

    constructor(private api: AttendanceApiService) {
    }

    ngOnInit() {
        this.api.getSessionsToday().subscribe(reply => {
            this.sessionsToday = reply.data;
        });

        this.api.getSessions().subscribe(reply => {
            this.sessions = reply.data;
        });

        this.api.getAllStudents().subscribe(reply => {
            this.students = reply.data;
        });
    }
}
