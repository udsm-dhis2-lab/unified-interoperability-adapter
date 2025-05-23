import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { GeneralCodesComponent } from './containers/general-codes/general-codes.component';
import { StandardCodesComponent } from './containers/standard-codes/standard-codes.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'general-codes',
        component: GeneralCodesComponent,
    },
    {
        path: 'standard-codes',
        component: StandardCodesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServiceTerminologyRoutingModule { }
