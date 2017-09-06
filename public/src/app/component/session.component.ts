import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Attendance, AttendanceApiService, Session, Student} from "../api.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MdPaginator} from "@angular/material";
import {DataSource} from '@angular/cdk/collections';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
    selector: "app-attendance-session",
    templateUrl: "./session.component.html"
})
export class SessionAttendanceComponent implements OnInit {
    sessionId: string;
    session: Session = {_id: '', event: '', onDate: new Date(), groups: []};
    students: Student[] = [];
    attended: Set<Student> = new Set();
    absent: Set<Student> = new Set();
    todo: Set<Student> = new Set();
    date: string = '';
    displayedColumns = ['tag', 'name', 'status'];
    database = new StudentDatabase();
    dataSource: StudentDataSource | null;

    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(private route: ActivatedRoute,
                private api: AttendanceApiService) {
        this.sessionId = route.snapshot.params["sessionId"];
    }

    formatDate(date: Date) {
        return this.api.formatDate(date);
    }

    ngOnInit() {
        this.dataSource = new StudentDataSource(this.database, this.paginator);
        const today = new Date();

        this.api.getSession(this.sessionId).subscribe(reply => {
            this.session = reply.data;
            this.date = this.formatDate(this.session.onDate);

            this.api.getStudentsByGroups(this.session.groups).subscribe(reply => {
                this.students = reply.data;

                this.api.getSessionAttendances(this.sessionId).subscribe(reply => {
                    const attendances: Attendance[] = reply.data;
                    const attendedTags = new Set<string>();

                    attendances.forEach((attendance) => attendedTags.add(attendance.studentTag));
                    this.students.forEach((student) => {
                        if (this.session.onDate > today) {
                            this.todo.add(student);
                        } else if (attendedTags.has(student.tag)) {
                            this.attended.add(student);
                        } else {
                            this.absent.add(student);
                        }
                        this.database.addSession(student);
                    });
                });
            });
        });
    }
}

export class StudentDatabase {
    dataChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

    constructor() {
    }

    get data(): Student[] {
        return this.dataChange.value;
    }

    addSession(student: Student) {
        const copiedData = this.data.slice();
        copiedData.push(student);
        this.dataChange.next(copiedData);
    }
}

export class StudentDataSource extends DataSource<any> {
    constructor(private database: StudentDatabase, private paginator: MdPaginator) {
        super();
    }

    connect(): Observable<Student[]> {
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
