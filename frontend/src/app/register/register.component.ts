import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AttendanceApiService } from '../service/attendance-api.service';

declare var angular: any;

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
@Component({
  selector: 'example-app',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  tag: string;
  // name: any;
  allowed_names: string[];

  constructor(private route: ActivatedRoute,
              private attendanceApiService: AttendanceApiService) {
    this.tag = route.snapshot.params['tag'];
  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

  // onSubmit(f: NgForm) {
  //   console.log("Submitted");
  // }

  ngOnInit() {
    this.attendanceApiService.getStudents().subscribe(s => {
      this.allowed_names = [];
      for (var i in s.data) {
        this.allowed_names.push(s.data[i].name);
      }
    });
  }
}
