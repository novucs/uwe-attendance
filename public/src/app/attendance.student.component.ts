import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: "app-attendance-student",
    templateUrl: "./attendance.student.component.html"
})
export class StudentAttendanceComponent implements OnInit {
    studentId: string;

    constructor(route: ActivatedRoute) {
        this.studentId = route.snapshot.params["studentId"];
    }

    ngOnInit() {
    }
}
