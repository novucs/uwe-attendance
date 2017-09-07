import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConnectComponent} from "./component/connect.component";
import {SessionAttendanceComponent} from "./component/session.component";
import {StudentAttendanceComponent} from "./component/student.component";
import {ScanComponent} from "./component/scan.component";
import {ConfirmDeactivateGuard} from "./deactivateguard";
import {StatsComponent} from "./component/stats.component";

const appRoutes: Routes = [
    {
        path: "",
        component: ConnectComponent
    },
    {
        path: "stats",
        component: StatsComponent
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
        component: ScanComponent,
        canDeactivate: [ConfirmDeactivateGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const appRoutingProviders: any[] = [];
