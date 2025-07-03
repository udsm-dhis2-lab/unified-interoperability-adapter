import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { ValidationFormComponent } from './containers/validation-form/validation-form.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
    {
    path: 'validations/new', // The route for creating a new validation
    component: ValidationFormComponent
  },
  {
    path: 'validations/edit/:id', // An example route for editing in the future
    component: ValidationFormComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
