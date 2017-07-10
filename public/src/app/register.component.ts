import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AttendanceApiService} from "./api.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html"
})
export class RegisterComponent implements OnInit {

    tag: string;
    sessionId: string;
    allowedNames: string[] = [];
    fullName: string = "";
    registered: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private api: AttendanceApiService) {
        this.sessionId = route.snapshot.params["sessionId"];
        this.tag = route.snapshot.params["tag"];
    }

    isNameValid() {
        return this.allowedNames.indexOf(this.fullName) > -1;
    }

    onSubmit() {
        if (!this.isNameValid()) {
            return;
        }

        this.api.updateStudentTag(this.fullName, this.tag);
        this.api.updateAttendance(this.sessionId, this.tag);
        this.registered = true;

        setTimeout(() => {
            this.router.navigate(["/scan", this.sessionId]);
        }, 2000);
    }

    ngOnInit() {
        this.api.getAllStudents().subscribe(s => {
            this.allowedNames = [];
            const registeredTags: string[] = [];
            for (let i in s.data) {
                if (s.data[i].tag == "unknown") {
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