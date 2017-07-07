import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceApiService,
         Student,
         Schedule,
         Attendance } from '../service/attendance-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  tag: string;
  allowedNames: string[] = [];
  fullName: string = "";
  registered: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: AttendanceApiService) {
    this.tag = route.snapshot.params['tag'];
  }

  isNameValid() {
    return this.allowedNames.indexOf(this.fullName) > -1;
  }

  onSubmit() {
    if (!this.isNameValid()) {
      return;
    }

    var student: Student = {
      tag: this.tag,
      name: this.fullName
    };

    this.api.updateStudent(student);
    this.registered = true;

    setTimeout(() => {
      this.router.navigate(['scan']);
    }, 2000);
  }

  ngOnInit() {
    this.api.getStudents().subscribe(s => {
      this.allowedNames = [];
      var registeredTags: string[] = [];
      for (var i in s.data) {
        if (s.data[i].tag == 'unknown') {
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
