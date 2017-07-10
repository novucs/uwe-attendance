import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Attendance, AttendanceApiService, Session, Student} from "./api.service";

@Component({
    selector: "app-attendance-student",
    templateUrl: "./attendance.student.component.html"
})
export class StudentAttendanceComponent implements OnInit {
    studentTag: string;
    student: Student = {_id: '', tag: '', name: '', groups: []};
    sessions: Session[] = [];
    attended: Session[] = [];
    absent: Session[] = [];

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService) {
        this.studentTag = route.snapshot.params["studentTag"];
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }

    ngOnInit() {
        this.api.getStudent(this.studentTag).subscribe(reply => {
            this.student = reply.data;

            this.api.getSessionsByGroups(this.student.groups).subscribe(reply => {
                this.sessions = reply.data;

                this.api.getStudentAttendances(this.studentTag).subscribe(reply => {
                    const attendances: Attendance[] = reply.data;
                    const attendedIds = new Set<string>();

                    attendances.forEach((attendance) => attendedIds.add(attendance.sessionId));
                    this.sessions.forEach((session) => attendedIds.has(session._id) ?
                        this.attended.push(session) : this.absent.push(session));
                })
            });
        })
    }
}
