import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConnectComponent} from "./component/connect.component";
import {SessionAttendanceComponent} from "./component/session.component";
import {StudentAttendanceComponent} from "./component/student.component";
import {RegisterComponent} from "./component/register.component";
import {ScanComponent} from "./component/scan.component";

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
        path: "attendance/student/:studentTag",
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
