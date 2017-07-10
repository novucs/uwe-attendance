import {Component, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {AttendanceApiService, Session} from "./api.service";

@Component({
    selector: "app-attendance-session",
    templateUrl: "./attendance.session.component.html"
})
export class SessionAttendanceComponent implements OnInit {
    sessionId: string;
    session: Session = {_id: '', event: '', onDate: new Date(), groups: []};
    attended: string[];
    date: string = '';

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService) {
        this.sessionId = route.snapshot.params["sessionId"];
    }

    ngOnInit() {
        this.api.getSession(this.sessionId).subscribe(schedule => {
            this.session.event = schedule.data.event;
            this.session.onDate = schedule.data.onDate;

            const datePipe = new DatePipe("en-UK");
            this.date = datePipe.transform(this.session.onDate, "dd/MM/yyyy @ HH:mm:ss");
        });

        this.api.getSessionAttendances(this.sessionId).subscribe(a => {
            for (let i in a.data) {
                const attendance = a.data[i];
                this.api.getStudent(attendance.tag).subscribe(s => {
                    this.attended.push(s.data.name);
                });
            }
        });
    }
}
