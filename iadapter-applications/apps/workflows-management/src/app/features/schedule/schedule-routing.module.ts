import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { AddScheduleComponent } from './containers/add-schedule/add-schedule.component';
import { MainComponent } from './containers/main/main.component';
import { EditScheduleComponent } from './containers/edit-schedule/edit-schedule.component';
import { ScheduleTableComponent } from './containers/schedule-table/schedule-table.component';
import { ScheduleManagementComponent } from './containers/schedule-management/schedule-management.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
  },
  {
    path: 'config',
    component: ScheduleManagementComponent,
    children: [
      {
        path: 'add',
        component: AddScheduleComponent,
        pathMatch: 'full',
      },
      {
        path: 'edit/:id',
        component: EditScheduleComponent,
        pathMatch: 'full',
      },
    ]
  },
  // {
  //   path: 'schedules',
  //   component: MainComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: ScheduleTableComponent,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'add',
  //       component: AddScheduleComponent,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'edit/:id',
  //       component: EditScheduleComponent,
  //       pathMatch: 'full',
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
