import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AttendanceApiService, EMPTY_SESSION, Session} from "../api.service";
import {$WebSocket} from "angular2-websocket/angular2-websocket";
import {MdDialog, MdSnackBar} from "@angular/material";
import {RegisterComponent} from "./register.component";

@Component({
    selector: "app-scan",
    templateUrl: "./scan.component.html",
    styles: [`
        md-icon {
            color: green;
            font-size: 94px;
            height: 94px;
            width: 94px;
        }
    `]
})
export class ScanComponent implements OnInit {

    scanned: boolean = false;
    sessionId: string;
    session: Session = EMPTY_SESSION;

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService,
                private dialog: MdDialog,
                private snackBar: MdSnackBar) {
        this.sessionId = route.snapshot.params["sessionId"];
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }


    ngOnInit() {
        this.api.getSession(this.sessionId).subscribe(reply => {
            this.session = reply.data;
        });

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
                        const dialogRef = this.dialog.open(RegisterComponent, {
                            height: "350px"
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            if (!result) {
                                this.snackBar.open("Registration failed, invalid name selected", "Close");
                                return;
                            }

                            this.api.updateStudentTag(result, tag);
                            this.api.updateAttendance(this.sessionId, tag);
                            this.snackBar.open(`Successfully registered as ${result}`, "Close");
                            this.scanned = true;

                            setTimeout(() => {
                                this.scanned = false;
                            }, 2000);
                        });
                        return;
                    }

                    // Set the state to scanned and save the attendance record.
                    this.scanned = true;
                    this.api.updateAttendance(this.sessionId, tag);
                    this.snackBar.open(`Welcome back, ${reply.data.name}!`, "Close");

                    // Change state back to not scanned after two seconds.
                    setTimeout(() => {
                        this.scanned = false;
                        this.snackBar.dismiss();
                    }, 2000);
                });
            },
            {autoApply: false}
        );
    }
}
