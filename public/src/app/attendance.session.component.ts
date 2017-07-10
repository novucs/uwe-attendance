import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Attendance, AttendanceApiService, Session, Student} from "./api.service";

@Component({
    selector: "app-attendance-session",
    templateUrl: "./attendance.session.component.html"
})
export class SessionAttendanceComponent implements OnInit {
    sessionId: string;
    session: Session = {_id: '', event: '', onDate: new Date(), groups: []};
    students: Student[] = [];
    attended: Student[] = [];
    absent: Student[] = [];
    date: string = '';

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService) {
        this.sessionId = route.snapshot.params["sessionId"];
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }

    ngOnInit() {
        this.api.getSession(this.sessionId).subscribe(reply => {
            this.session = reply.data;
            this.date = this.formatDate(this.session.onDate);

            this.api.getStudentsByGroups(this.session.groups).subscribe(reply => {
                this.students = reply.data;

                this.api.getSessionAttendances(this.sessionId).subscribe(reply => {
                    const attendances: Attendance[] = reply.data;
                    const attendedTags = new Set<string>();

                    attendances.forEach((attendance) => attendedTags.add(attendance.studentTag));
                    this.students.forEach((student) => attendedTags.has(student.tag) ?
                        this.attended.push(student) : this.absent.push(student));
                });
            });
        });
    }
}
