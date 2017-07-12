import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AttendanceApiService} from "./api.service";
import {$WebSocket} from "angular2-websocket/angular2-websocket";

@Component({
    selector: "app-scan",
    templateUrl: "./scan.component.html",
    styles: [".tick {width: 10%; display: block; margin-left: auto; margin-right: auto;}"]
})
export class ScanComponent implements OnInit {

    scanned: boolean = false;
    sessionId: string;

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService,
                private router: Router) {
        this.sessionId = route.snapshot.params["sessionId"];
    }

    ngOnInit() {
        // Wait for the server to send us a card scan.
        const ws = new $WebSocket("ws://127.0.0.1:3001");
        ws.onMessage(
            (msg: MessageEvent) => {
                // The card has now been scanned and this is the tag.
                const tag = msg.data;

                // Get the student by this tag from the database.
                this.api.getStudent(tag).subscribe(reply => {
                    // If the student does not currently exist in the database,
                    // create them.
                    if (!reply.data) {
                        this.router.navigate(["/register", this.sessionId, tag]);
                        return;
                    }

                    // Set the state to scanned and save the attendance record.
                    this.scanned = true;
                    this.api.updateAttendance(this.sessionId, tag);

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
