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
import { AttendanceComponent } from './attendance/attendance.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    AttendanceComponent,
    RegisterComponent
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
