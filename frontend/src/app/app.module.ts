import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing,
         appRoutingProviders }  from './app.routing';

import { AttendanceApiService } from './service/attendance-api.service';
import { SocketService } from './service/socket.service';

import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import { AttendanceComponent } from './attendance/attendance.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    AttendanceComponent
  ],
  imports: [
    BrowserModule,
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
