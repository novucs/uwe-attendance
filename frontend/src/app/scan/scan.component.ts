import { Component, OnInit } from '@angular/core';
import { AttendanceApiService } from '../service/attendance-api.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  constructor(private api: AttendanceApiService) {
  }

  ngOnInit() {
  }
}
