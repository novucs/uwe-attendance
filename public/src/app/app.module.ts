import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2CompleterModule } from "ng2-completer";

import { routing,
         appRoutingProviders }  from './app.routing';
import { AttendanceApiService } from './service/attendance-api.service';
import { SocketService } from './service/socket.service';
import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import { ScheduleAttendanceComponent } from './schedule-attendance/schedule-attendance.component';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { RegisterComponent } from './register/register.component';
import { ScanComponent } from './scan/scan.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    ScheduleAttendanceComponent,
    StudentAttendanceComponent,
    RegisterComponent,
    ScanComponent
  ],
  imports: [
    BrowserModule,
    Ng2CompleterModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AttendanceApiService,
    SocketService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
