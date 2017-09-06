import {Component, OnInit} from "@angular/core";
import {AttendanceApiService, EMPTY_SESSION, EMPTY_STUDENT, Session, Student} from "../api.service";

@Component({
    selector: "app-connect",
    templateUrl: "./connect.component.html"
})
export class ConnectComponent implements OnInit {

    sessionsToday: Session[] = [];
    sessions: Session[] = [];
    students: Student[] = [];
    session: Session = EMPTY_SESSION;
    student: Student = EMPTY_STUDENT;

    constructor(private api: AttendanceApiService) {
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
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
