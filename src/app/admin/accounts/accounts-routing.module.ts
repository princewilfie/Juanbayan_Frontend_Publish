
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';
import { EditComponent } from './edit.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'edit/:id', component: EditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountsRoutingModule { }
