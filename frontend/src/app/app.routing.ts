import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { RegisterComponent } from './register/register.component';

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
    path: 'attendance/:id',
    component: AttendanceComponent
  },
  {
    path: 'register/:tag',
    component: RegisterComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const appRoutingProviders: any[] = [];
