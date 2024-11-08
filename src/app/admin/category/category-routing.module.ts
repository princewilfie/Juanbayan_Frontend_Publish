import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryAdminComponent } from './category.component';

const routes: Routes = [
  { path: '', component: CategoryAdminComponent },  // Default route to CategoryAdminComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryAdminRoutingModule { }
