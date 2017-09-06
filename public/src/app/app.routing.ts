import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConnectComponent} from "./component/connect.component";
import {SessionAttendanceComponent} from "./component/session.component";
import {StudentAttendanceComponent} from "./component/student.component";
import {ScanComponent} from "./component/scan.component";

const appRoutes: Routes = [
    {
        path: "",
        component: ConnectComponent
    },
    {
        path: "session/:sessionId",
        component: SessionAttendanceComponent
    },
    {
        path: "student/:studentTag",
        component: StudentAttendanceComponent
    },
    {
        path: "scan/:sessionId",
        component: ScanComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const appRoutingProviders: any[] = [];
