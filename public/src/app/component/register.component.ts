import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {AttendanceApiService} from "../api.service";

@Component({
    selector: 'app-register-dialog',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    control: FormControl = new FormControl();
    options = [];
    filteredOptions: Observable<string[]>;

    constructor(private api: AttendanceApiService) {
    }

    ngOnInit() {
        this.api.getAllStudents().subscribe(result => {
            result.data.forEach(student => {
                if (!student.tag) {
                    this.options.push(student.name);
                }
            });
            this.filteredOptions = this.control.valueChanges
                .startWith(null)
                .map(val => val ? this.filter(val) : this.options.slice());
        });
    }

    filter(val: string): string[] {
        return this.options.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) >= 0);
    }
}
