import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConnectComponent} from "./connect/connect.component";
import {ScheduleAttendanceComponent} from "./schedule-attendance/schedule-attendance.component";
import {StudentAttendanceComponent} from "./student-attendance/student-attendance.component";
import {RegisterComponent} from "./register/register.component";
import {ScanComponent} from "./scan/scan.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/connect',
        pathMatch: 'full'
    },
    {
        path: 'connect',
        component: ConnectComponent
    },
    {
        path: 'schedule-attendance/:scheduleId',
        component: ScheduleAttendanceComponent
    },
    {
        path: 'student-attendance/:studentId',
        component: StudentAttendanceComponent
    },
    {
        path: 'register/:scheduleId/:tag',
        component: RegisterComponent
    },
    {
        path: 'scan/:scheduleId',
        component: ScanComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const appRoutingProviders: any[] = [];
