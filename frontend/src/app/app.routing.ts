import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { AttendanceComponent } from './attendance/attendance.component';

const appRoutes: Routes = [
  {
      path: 'connect',
      component: ConnectComponent,
  },
  {
    path: '',
    redirectTo: '/connect',
    pathMatch: 'full'
  },
  {
    path: 'attendance/:id',
    component: AttendanceComponent
  }

//  { path: '**', component: PageNotFoundComponent }
];
export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
