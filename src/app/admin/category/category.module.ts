// src/app/admin/category-admin/category-admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CategoryAdminRoutingModule } from './category-routing.module';
import { CategoryAdminComponent } from './category.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CategoryAdminRoutingModule
  ],
  declarations: [
    CategoryAdminComponent
  ]
})
export class CategoryAdminModule { }
