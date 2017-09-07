import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Attendance, AttendanceApiService, EMPTY_STUDENT, Session, Student} from "../api.service";
import {Observable} from "rxjs/Observable";
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/of';
import {MdPaginator} from "@angular/material";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


@Component({
    selector: "app-attendance-student",
    templateUrl: "./student.component.html"
})
export class StudentAttendanceComponent implements OnInit {
    studentTag: string;
    student: Student = EMPTY_STUDENT;
    sessions: Session[] = [];
    attended: Set<Session> = new Set();
    absent: Set<Session> = new Set();
    todo: Set<Session> = new Set();
    displayedColumns = ['date', 'event', 'status'];
    database = new SessionDatabase();
    dataSource: SessionDataSource | null;

    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService) {
        this.studentTag = route.snapshot.params["studentTag"];
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }

    ngOnInit() {
        this.dataSource = new SessionDataSource(this.database, this.paginator);
        const today = new Date();

        this.api.getStudent(this.studentTag).subscribe(reply => {
            this.student = reply.data;

            this.api.getSessionsByGroups(this.student.groups).subscribe(reply => {
                this.sessions = reply.data;

                this.api.getStudentAttendances(this.studentTag).subscribe(reply => {
                    const attendances: Attendance[] = reply.data;
                    const attendedIds = new Set<string>();

                    attendances.forEach((attendance) => attendedIds.add(attendance.sessionId));
                    this.sessions.forEach((session) => {
                        if (new Date(session.onDate).getTime() > today.getTime()) {
                            this.todo.add(session);
                        } else if (attendedIds.has(session._id)) {
                            this.attended.add(session);
                        } else {
                            this.absent.add(session);
                        }
                        this.database.addSession(session);
                    });
                });
            });
        });
    }
}

export class SessionDatabase {
    dataChange: BehaviorSubject<Session[]> = new BehaviorSubject<Session[]>([]);

    constructor() {
    }

    get data(): Session[] {
        return this.dataChange.value;
    }

    addSession(session: Session) {
        const copiedData = this.data.slice();
        copiedData.push(session);
        this.dataChange.next(copiedData);
    }
}

export class SessionDataSource extends DataSource<any> {
    constructor(private database: SessionDatabase, private paginator: MdPaginator) {
        super();
    }

    connect(): Observable<Session[]> {
        const displayDataChanges = [
            this.database.dataChange,
            this.paginator.page,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.database.data.slice();
            const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
            return data.splice(startIndex, this.paginator.pageSize);
        });
    }

    disconnect() {
    }
}
