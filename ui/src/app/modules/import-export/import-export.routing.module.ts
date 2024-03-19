import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportExportHomeComponent } from './pages/import-export-home/import-export-home.component';

const routes: Routes = [{ path: '', component: ImportExportHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportExportRoutingModule {}
