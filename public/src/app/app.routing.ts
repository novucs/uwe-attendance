import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConnectComponent} from "./connect.component";
import {SessionAttendanceComponent} from "./attendance.session.component";
import {StudentAttendanceComponent} from "./attendance.student.component";
import {RegisterComponent} from "./register.component";
import {ScanComponent} from "./scan.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/connect",
        pathMatch: "full"
    },
    {
        path: "connect",
        component: ConnectComponent
    },
    {
        path: "attendance/session/:sessionId",
        component: SessionAttendanceComponent
    },
    {
        path: "attendance/student/:studentId",
        component: StudentAttendanceComponent
    },
    {
        path: "register/:sessionId/:tag",
        component: RegisterComponent
    },
    {
        path: "scan/:sessionId",
        component: ScanComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const appRoutingProviders: any[] = [];
