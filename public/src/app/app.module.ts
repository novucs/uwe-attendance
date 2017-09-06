import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
    MdAutocompleteModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdIconModule,
    MdListModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdSnackBarModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {appRoutingProviders, routing} from "./app.routing";
import {AttendanceApiService} from "./api.service";
import {AppComponent} from "./app.component";
import {ConnectComponent} from "./component/connect.component";
import {SessionAttendanceComponent} from "./component/session.component";
import {StudentAttendanceComponent} from "./component/student.component";
import {ScanComponent} from "./component/scan.component";
import {RegisterComponent} from "./component/register.component";
import {ConfirmDeactivateGuard} from "./deactivateguard";
import {PromptComponent} from "./component/prompt.component";

@NgModule({
    declarations: [
        AppComponent,
        ConnectComponent,
        PromptComponent,
        RegisterComponent,
        SessionAttendanceComponent,
        StudentAttendanceComponent,
        ScanComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        BrowserAnimationsModule,
        MdSelectModule,
        MdButtonModule,
        MdCheckboxModule,
        MdCardModule,
        MdTabsModule,
        MdToolbarModule,
        MdTableModule,
        MdPaginatorModule,
        MdListModule,
        MdIconModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdDialogModule,
        MdAutocompleteModule,
        MdSnackBarModule
    ],
    providers: [
        AttendanceApiService,
        appRoutingProviders,
        ConfirmDeactivateGuard
    ],

    entryComponents: [
        PromptComponent,
        RegisterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
