import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Attendance, AttendanceApiService} from "../service/attendance-api.service";
import {$WebSocket} from "angular2-websocket/angular2-websocket";

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html'
})
export class ScanComponent implements OnInit {

    scanned: boolean = false;
    scheduleId: string;

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService,
                private router: Router) {
        this.scheduleId = route.snapshot.params['scheduleId'];
    }

    ngOnInit() {
        // Wait for the server to send us a card scan.
        const ws = new $WebSocket("ws://127.0.0.1:3001");
        ws.onMessage(
            (msg: MessageEvent) => {
                // The card has now been scanned and this is the tag.
                const tag = msg.data;

                // Get the student by this tag from the database.
                this.api.getStudent(tag).subscribe(s => {
                    // If the student does not currently exist in the database,
                    // create them.
                    if (!s.data) {
                        this.router.navigate(['/register', this.scheduleId, tag]);
                        return;
                    }

                    // Set the state to scanned and save the attendance record.
                    this.scanned = true;
                    const record: Attendance = {
                        sessionId: this.scheduleId,
                        tag: tag
                    };
                    this.api.updateAttendance(record);

                    // Change state back to not scanned after two seconds.
                    setTimeout(() => {
                        this.scanned = false;
                    }, 2000);
                });
            },
            {autoApply: false}
        );
    }
}
