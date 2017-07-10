import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Attendance, AttendanceApiService, Student} from "../service/attendance-api.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    tag: string;
    scheduleId: string;
    allowedNames: string[] = [];
    fullName: string = "";
    registered: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private api: AttendanceApiService) {
        this.scheduleId = route.snapshot.params['scheduleId'];
        this.tag = route.snapshot.params['tag'];
    }

    isNameValid() {
        return this.allowedNames.indexOf(this.fullName) > -1;
    }

    onSubmit() {
        if (!this.isNameValid()) {
            return;
        }

        const student: Student = {
            tag: this.tag,
            name: this.fullName
        };

        this.api.updateStudentTag(student);

        this.registered = true;
        const record: Attendance = {
            sessionId: this.scheduleId,
            tag: this.tag
        };
        this.api.updateAttendance(record);

        setTimeout(() => {
            this.router.navigate(['/scan', this.scheduleId]);
        }, 2000);
    }

    ngOnInit() {
        this.api.getAllStudents().subscribe(s => {
            this.allowedNames = [];
            const registeredTags: string[] = [];
            for (let i in s.data) {
                if (s.data[i].tag == 'unknown') {
                    this.allowedNames.push(s.data[i].name);
                } else {
                    registeredTags.push(s.data[i].tag);
                }
            }

            if (registeredTags.indexOf(this.tag) > -1) {
                this.registered = true;
            }
        });
    }
}
