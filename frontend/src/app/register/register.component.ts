import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceApiService } from '../service/attendance-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  tag: string;
  allowedNames: string[] = [];
  fullName: string = "";
  form: FormData;

  constructor(private route: ActivatedRoute,
              private attendanceApiService: AttendanceApiService) {
    this.tag = route.snapshot.params['tag'];
  }

  isNameValid() {
    return this.allowedNames.indexOf(this.fullName) > -1
  }

  onSubmit() {
    if (!this.isNameValid()) {
      return;
    }

    console.log(this.fullName);
  }

  ngOnInit() {
    this.attendanceApiService.getStudents().subscribe(s => {
      this.allowedNames = [];
      for (var i in s.data) {
        this.allowedNames.push(s.data[i].name);
      }
    });
  }
}
