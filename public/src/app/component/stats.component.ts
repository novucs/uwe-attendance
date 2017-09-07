import {Component, OnInit, ViewChild} from "@angular/core";
import {AttendanceApiService, Session, Student} from "../api.service";
import {Observable} from "rxjs/Observable";
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/of';
import {MdPaginator} from "@angular/material";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

export interface StudentAttendance {
    name: string;
    absence: number;
    attendance: number;
}

@Component({
    selector: "app-stats-component",
    templateUrl: "./stats.component.html"
})
export class StatsComponent implements OnInit {
    weeklyAttendances: StudentAttendance[] = [];
    totalAttendances: StudentAttendance[] = [];
    displayedColumns = ['name', 'absent', 'attended'];
    weeklyDatabase = new StudentAttendanceDatabase();
    weeklyDataSource: StudentAttendanceDataSource | null;
    totalDatabase = new StudentAttendanceDatabase();
    totalDataSource: StudentAttendanceDataSource | null;

    @ViewChild(MdPaginator) weeklyPaginator: MdPaginator;
    @ViewChild(MdPaginator) totalPaginator: MdPaginator;

    constructor(private api: AttendanceApiService) {
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }

    ngOnInit() {
        this.weeklyDataSource = new StudentAttendanceDataSource(this.weeklyDatabase, this.weeklyPaginator);
        this.totalDataSource = new StudentAttendanceDataSource(this.totalDatabase, this.totalPaginator);

        this.api.getAllStudents().subscribe(reply => {
            const students: Student[] = reply.data;

            this.api.getSessions().subscribe(reply => {
                const sessions: Session[] = reply.data;

                this.api.getAllAttendances().subscribe(reply => {
                    const attendances: Map<string, Set<string>> = new Map();

                    reply.data.forEach((attendance) => {
                        let sessionIds: Set<string> = attendances.get(attendance.student);
                        if (sessionIds === undefined) {
                            sessionIds = new Set();
                        }
                        sessionIds.add(attendance.sessionId);
                        attendances.set(attendance.studentTag, sessionIds);
                    });

                    this.buildAttendance(students, sessions, attendances);
                });
            });
        });
    }

    buildAttendance(students: Student[], sessions: Session[], attendances: Map<string, Set<string>>) {
        const currentTime = new Date().getTime();

        students.forEach(student => {
            const weeklyAttendance: StudentAttendance = {
                name: student.name,
                absence: 0,
                attendance: 0
            };
            const totalAttendance: StudentAttendance = {
                name: student.name,
                absence: 0,
                attendance: 0
            };

            const sessionIds = attendances.get(student.tag);

            if (sessionIds === undefined) {
                return;
            }

            sessions.forEach(session => {
                const sessionTime = new Date(session.onDate).getTime();
                if (sessionTime > currentTime) {
                    return;
                }

                if (currentTime - 604800000 < sessionTime) {
                    if (sessionIds.has(session._id)) {
                        weeklyAttendance.attendance++;
                    } else {
                        weeklyAttendance.absence++;
                    }
                }

                if (sessionIds.has(session._id)) {
                    totalAttendance.attendance++;
                } else {
                    totalAttendance.absence++;
                }
            });

            this.weeklyAttendances.push(weeklyAttendance);
            this.totalAttendances.push(totalAttendance);
        });

        this.weeklyAttendances.sort((a, b) => {
            return b.absence - a.absence;
        });

        this.totalAttendances.sort((a, b) => {
            return b.absence - a.absence;
        });

        this.weeklyAttendances.forEach((attendance) => this.weeklyDatabase.addSession(attendance));
        this.totalAttendances.forEach((attendance) => this.totalDatabase.addSession(attendance));
    }
}

export class StudentAttendanceDatabase {
    dataChange: BehaviorSubject<StudentAttendance[]> = new BehaviorSubject<StudentAttendance[]>([]);

    constructor() {
    }

    get data(): StudentAttendance[] {
        return this.dataChange.value;
    }

    addSession(attendance: StudentAttendance) {
        const copiedData = this.data.slice();
        copiedData.push(attendance);
        this.dataChange.next(copiedData);
    }
}

export class StudentAttendanceDataSource extends DataSource<any> {
    constructor(private database: StudentAttendanceDatabase, private paginator: MdPaginator) {
        super();
    }

    connect(): Observable<StudentAttendance[]> {
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
