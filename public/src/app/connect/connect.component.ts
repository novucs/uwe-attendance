import {Component, OnInit} from "@angular/core";
import {AttendanceApiService} from "../service/attendance-api.service";

@Component({
    selector: 'app-connect',
    templateUrl: './connect.component.html'
})
export class ConnectComponent implements OnInit {

    currentSchedules: any = [];
    schedules: any = [];
    students: any = [];

    constructor(private api: AttendanceApiService) {
    }

    ngOnInit() {
        // Retrieve posts from the API
        this.api.getScheduleToday().subscribe(s => {
            this.currentSchedules = s.data;
        });
        this.api.getSchedules().subscribe(s => {
            this.schedules = s.data;
        });
        this.api.getAllStudents().subscribe(s => {
            this.students = s.data;
        });
    }
}
