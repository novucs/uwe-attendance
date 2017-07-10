import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {Ng2CompleterModule} from "ng2-completer";

import {appRoutingProviders, routing} from "./app.routing";
import {AttendanceApiService} from "./api.service";
import {AppComponent} from "./app.component";
import {ConnectComponent} from "./connect.component";
import {SessionAttendanceComponent} from "./attendance.session.component";
import {StudentAttendanceComponent} from "./attendance.student.component";
import {RegisterComponent} from "./register.component";
import {ScanComponent} from "./scan.component";

@NgModule({
    declarations: [
        AppComponent,
        ConnectComponent,
        SessionAttendanceComponent,
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
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
